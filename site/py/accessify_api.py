import scraperwiki
'''
  Accessify Wiki API service.

  Copyright Nick Freear, 15 April 2013.

  https://views.scraperwiki.com/run/accessify_api/?url=http%3A//baidu.com/&callback=_FN
'''
import re, yaml, json


my = scraperwiki.utils.swimport("accessify_library_v1")


url = my.get("url", my.re_https_url())
callback = my.get_option("callback", my.re_jsonp_callback())
format = my.get_option("format", my.re_api_format(), "json")


scraperwiki.sqlite.attach("accessify-form", "acfy")

result = scraperwiki.sqlite.select("* FROM `acfy`.`include_map`")
key = None

for include in result:
    pattern = include["pattern"]
    # Convert from URL glob to regex
    regex = re.compile(pattern.replace("*", ".*"))
    if regex.match( url ):
        key = include["key"]
        break


if not key:
    my.apiError("Sorry, no fixes found for this page.", 404, callback)


result = scraperwiki.sqlite.select("* FROM `acfy`.`fixes` WHERE `key` = ? ORDER BY `updated` DESC LIMIT 1", key)
result = result[0]


fixes = yaml.safe_load(result["yaml"])


config = fixes["_CONFIG_"]
config["updated"] = result["updated"]
config["key"] = result["key"]
config["source_url"] = result["url"]
config["request_url"] = url
config["include_used"] = pattern
##TODO: confirm --  config["license"] = "MIT"


if format == "yaml-c":
    my.httpHeaders("text/plain", "accessify-fixes.yaml")
    print yaml.safe_dump(fixes, encoding="utf-8", indent=4, canonical=True)
    exit()

if format == "yaml":
    my.httpHeaders("text/plain", "accessify-fixes.yaml")
    print yaml.safe_dump(fixes, encoding="utf-8", indent=2)
    exit()


my.httpHeaders("application/json", "accessify-fixes.json")


if callback:
    #print "/*"
    #print " JSON-P source:", url
    #print "*/"
    print callback, "(", json.dumps( fixes ), ");"
else:
    print json.dumps( fixes )


# End.
