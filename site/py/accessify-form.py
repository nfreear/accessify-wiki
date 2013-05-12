import scraperwiki
'''
  Accessify Wiki form to submit fixes.

  Copyright Nick Freear, 11 April 2013.

  https://views.scraperwiki.com/run/accessify-form/?url=http%3A//dl.dropbox.com/u/3203144/wai-aria/baidu-search-wai-aria.yaml

'''
import os, cgi, yaml, sys, lxml.html, httplib2, hashlib
from datetime import datetime

my = scraperwiki.utils.swimport("accessify_library_v1")


drop = None
if drop:
    res = scraperwiki.sqlite.execute('DROP TABLE IF EXISTS "fixes"')
    res = scraperwiki.sqlite.execute('DROP TABLE IF EXISTS "include_map"')
    print res
    exit()


if not my.form_submit():
    print my.render(my.accessifyForm())
    exit()


notices = []
notices.append("Thank you for submitting accessibility fixes.")


url = my.get('url', my.re_yaml_url())
email = my.get('email', my.re_email())
comment = my.get_option('comment', my.re_any())
intouch = my.get_option('intouch', my.re_any())
#form_name = my.get('form_name', my.re_any())


http = httplib2.Http(".cache")
try:
    resp, yaml_file = http.request(url, None, { "User-Agent":"accessify-form/v1/scraperwiki/python" })
except httplib2.HttpLib2Error as ex:
    my.error("Sorry, I can't read the YAML file: "+ url +"<p class=ex >" + repr(ex), 500)
if resp.status != 200:
    my.error("Sorry, I can't read or find the YAML file: " + url, resp.status)


notices.append("OK, I've read your fixes file: " + url)

try:
    fixes = yaml.safe_load(yaml_file)
except:
    #print ex
    my.error("Sorry, the YAML is not well-formed: " + url, 500)

notices.append("The YAML appears to be well-formed.")

# A rough 'validation' of the _CONFIG_ or manifest hash.
# See, https://github.com/nfreear/accessify-wiki/tree/master/schema
try:
    manifest = fixes["_CONFIG_"]
    fix_name = manifest["name"]
    include = manifest["include"]
    include_1 = include[0]
    test_url = manifest["test_urls"][0]
    fix_locale = manifest.get("locale", "x-AcfyGlobal")
    fix_status = manifest.get("status", "in progress")
    fix_active = manifest.get("active", True)
except:
    #print sys.exc_info()[0]
    my.error("Sorry, I can't validate the `_CONFIG_` block in the YAML: " + url, 500)

notices.append("OK, the `_CONFIG_` block appears to be valid.")

#print name, test_url


# Are all the includes valid 'http://example/*' globs?
for inc in include:
    ok = my.re_https_url().match(inc)
    if (not ok):
        my.error("Sorry, I don't recognize this `include` as a URL glob/ pattern: " + inc, 500)

notices.append("All the `include` entries appear to be valid URL globs.")


# Are all the selectors valid?
root = lxml.html.fromstring("<html></html>")
try:
    for sel in fixes:
        root.cssselect(sel)
except: #ExpressionError
    #print ex
    my.error("Invalid selector in YAML: " + sel, 500)

notices.append("Congratulations, all the CSS selectors are valid.")


# TODO: Insert/ update in database.
#key = hashlib.md5( url ).hexdigest()

key_u = fix_name + "::" + fix_locale
key = hashlib.md5( key_u ).hexdigest()


res = scraperwiki.sqlite.save(
    unique_keys=["updated"], #["key"],
    data={"key":key, "url":url, "name":fix_name, "yaml":yaml_file, "email":email, "updated":datetime.utcnow(),
        "status":fix_status, "active":fix_active, "comment":comment, "intouch":intouch},
    table_name="fixes"
    )

#notices.append(expr(res))


for inc in include:
    res = scraperwiki.sqlite.save(
        unique_keys=["pattern"],
        data = { "key":key, "pattern":inc, "locale":fix_locale },
        table_name="include_map"
        )

notices.append("OK, your fixes were added to the database, key: " + key_u + " / " + key)
print my.render('<p class="first notice">' + " <p class=notice >".join(notices))


# End.
