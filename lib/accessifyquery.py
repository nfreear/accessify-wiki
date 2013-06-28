#!/usr/bin/env python
#
# Query the Wiki for accessibility fixes.
#
# Copyright 2013 Nick Freear.
#
# http://localhost:8080/query?url=http://www.open.ac.uk
#
import urllib2, yaml, json, re
from urlparse import urlparse

WIKI_SEARCH_URL = (
    "http://accessify.wikia.com/wiki/"
    "Special:Search?ns0=1&format=json&limit=1&search=")


def query(url):
    if not url:
        # Error.
        result = {
            "stat": "fail",
            "code": 400,
            "message": "Error, expecting a 'url' parameter."
        }
    else:
        # TODO: error handling - parse, urlopen-read, json-load...

        p = urlparse(url, scheme = "http")
        search_url = WIKI_SEARCH_URL + p.hostname

        search_rsp = urllib2.urlopen(search_url)
        search_json = search_rsp.read()

        search_result = json.loads(search_json)
        if len(search_result) < 1:
            result = {
                "stat": "fail",
                "code": 404,
                "message": "Error, not found."
            }
        else:
            search_result = search_result[0]
            page_id = search_result["pageid"]
            page_url = search_result["url"]
            page_title = search_result["title"].replace("Fix:", "")

            page_rsp = urllib2.urlopen(page_url + "?action=raw")
            page = page_rsp.read()

            # RegExp problem??
            matchObj = re.match(
                r'<source[^>]*>(.*)<\/source>' #".*\[\Category:(.*?)"
                , page, re.I|re.M|re.S)

            if matchObj:
                fixes_yaml = matchObj.group(1)
                #cat = matchObj.group(2)
            else:
                fixes_yaml = None

            # This works!
            fixes_yaml = page.replace(
                "<source", "#").replace("</source>", "#").replace(
                "&lt;", "<").replace("[[Category:", "#").replace(
                "{{PAGENAME}}", page_title)

            result = yaml.safe_load(fixes_yaml)

            debug = {
                "host": p.hostname,
                "search_url": search_url,
                "page_url": page_url,
                "page_id": page_id,
                #"_title": page_title,
                #"_fixes": fixes
            }
            result["_DEBUG_"] = debug

    return result