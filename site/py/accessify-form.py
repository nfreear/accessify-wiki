import scraperwiki
'''

  Copyright Nick Freear, 11 April 2013.

https://views.scraperwiki.com/run/accessify-form/?form_name=accessify-1&url=https%3A//gist.github.com/nfreear/5270020/raw/wai-aria-fixes-ex1.yaml&email=a%40b.c
https://views.scraperwiki.com/run/accessify-form/?url=http%3A//dl.dropbox.com/u/3203144/wai-aria/baidu-search-wai-aria.yaml

'''
import os, cgi, urllib2, yaml, sys, lxml.html
#from httplib2 import Http
import httplib2

#print os.getenv("HTTP_HOST"), os.getenv("QUERY_STRING"), os.getenv("HTTP_METHOD")
#print os.environ

#form = cgi.FieldStorage()

my = scraperwiki.utils.swimport("accessify_library_v1")

if (not my.form_submit()):
    print my.render(my.accessifyForm())
    exit()


notices = []
notices.append("Thank you for submitting some accessibility fixes to us.")


url = my.get('url', my.re_yaml_url())
email = my.get('email', my.re_email())
#form_name = my.get('form_name', my.re_any())


http = httplib2.Http(".cache")
#http.add_header('User-agent', 'accessify-form/v1/python')
try:
    rsp, yaml_file = http.request( url )
except httplib2.HttpLib2Error as ex:
    my.error("Sorry, I can't read the YAML file: "+ url +"<p class=ex >" + repr(ex), 500)
if (rsp.status != 200):
    my.error("Sorry, I can't read or find the YAML file: " + url, rsp.status)


notices.append("OK, I've read your fixes file: " + url)


#req = urllib2.Request( url )
#req.add_header('Referer', 'https://scraperwiki.com/profiles/nfreear/')
#req.add_header('User-agent', 'accessify-form/v1/python')
#try:
#    resp = urllib2.urlopen(req)
#except:
#    print ex
#    my.error("Sorry, I can't read or find the YAML file: " + url, 404)
#
#yaml_file = resp.read()
#print resp.code


try:
    fixes = yaml.load(yaml_file)
except:
    #print ex
    my.error("Sorry, the YAML is not well-formed: " + url, 500)

notices.append("The YAML appears to be well-formed.")

# A rough 'validation' of the _CONFIG_ or manifest hash.
try:
    manifest = fixes["_CONFIG_"]
    name = manifest["name"]
    include = manifest["include"]
    include_1 = include[0]
    test_url = manifest["test_urls"][0]
except:
    #print sys.exc_info()[0]
    my.error("Sorry, I can't validate the `_CONFIG_` block in the YAML: " + url, 500)

notices.append("OK, the `_CONFIG_` block appears to be valid.")

#print name, test_url


# Are all the includes valid 'http://example/*' globs?
for inc in include:
    ok = my.re_https_url().match(inc)
    #print inc, ok
    if (not ok):
        my.error("Sorry, I don't recognize this `include` as a URL glob: " + inc, 500)

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



print my.render(" <p class=notice >".join(notices))

# End.
