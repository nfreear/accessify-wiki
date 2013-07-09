#!/usr/bin/env python
#
# Query the Wiki for accessibility fixes.
#
# Copyright 2013 Nick Freear.
#
# http://localhost:8080/query?url=http://www.open.ac.uk
##import httplib2
#
import requests
import urllib2, yaml, json, re
from urlparse import urlparse

WIKI_SEARCH_URL = (
    "http://accessify.wikia.com/wiki/"
    "Special:Search?ns0=1&format=json&limit=5&search=")


def query(url):
    result = None

    if not url:
        # Error.
        result = {
            "stat": "fail",
            "code": 400,
            "message": "Error, expecting a 'url' parameter."
        }
    else:
        # TODO: error handling - parse, urlopen-read, json-load...

        up = urlparse(url, scheme = "http")
        found = None
        try:
            r = request_wiki_search(url)
        except requests.HTTPError:
            #print 'Could not download page'
            result = {
                'stat': 'fail',
                'code': r.status_code,
                'message': 'Error, HTTP error on search request.'
            }
        else:
            search_results = r.json()
            #search_result = json.loads(search_json)
            if len(search_results) < 1:
                result = {
                    "stat": "fail",
                    "code": 404,
                    "message": "Error, fixes not found."
                }
            else:
                for result in search_results:
                    if result["title"].find("Fix:") > -1:
                        found = result
                        break
                else:
                    result = {
                        "stat": "fail",
                        "code": 500.404,
                        "message": "Error, search failed - not found."
                    }

            if found:
                search_result = found
                page_id = search_result["pageid"]
                page_url = search_result["url"]
                page_title = search_result["title"].replace("Fix:", "")

                #page_rsp = urllib2.urlopen(page_url + "?action=raw")
                #page = page_rsp.read()
                r = requests.get(page_url + '?action=raw')
                page = r.text

                result = parse_fixes(page, page_title)

                result["_DEBUG_"] = {
                    "host": up.hostname,
                    #"search_url": search_url,
                    "page_url": page_url,
                    "page_id": page_id,
                    #"_title": page_title,
                    #"_fixes": fixes
                }

    return result


def request_wiki_search(url):
    up = urlparse(url, scheme = "http")
    search_url = WIKI_SEARCH_URL + up.hostname
    rsp = requests.get(search_url)  #, timeout=0.001)
    rsp.raise_for_status()
    return rsp


def parse_fixes(page, page_title):
    # RegExp problem??
    matchObj = re.match(
        r'<source[^>]*>(.*)<\/source>' #".*\[\Category:(.*?)"
        , page, re.I|re.M|re.S)

    if matchObj:
        fixes_yaml = matchObj.group(1)
        #cat = matchObj.group(2)

    # This works!
    fixes_yaml = page.replace(
        "<source", "#").replace("</source>", "#").replace(
        "&lt;", "<").replace("[[Category:", "#").replace(
        "{{PAGENAME}}", page_title)

    try:
        result = yaml.safe_load(fixes_yaml)
    except:
        result = {
            "stat": "fail",
            "code": 500.1,
            "message": "Error, YAML load failed."
        }
    return result


from urllib2 import Request, urlopen, URLError

def request_url(url):
    result = None

    req = Request(url)
    try:
        response = urlopen(req)
    except URLError, e:
        if hasattr(e, 'reason'):
            result = {
                'stat': 'fail',
                'code': 500.1,
                'message': "Error, we failed to reach a server. Reason: " + e.reason
            }
            #print 'We failed to reach a server.'
            #print 'Reason: ', e.reason
        elif hasattr(e, 'code'):
            result = {
                'stat': 'fail',
                'code': e.code,
                'message': 'The server couldn\'t fulfill the request.'
            }
            #print 'The server couldn\'t fulfill the request.'
            #print 'Error code: ', e.code
    else:
        # everything is fine
        result = response.read()
        result['stat'] = 'ok';

    return result


#end.
