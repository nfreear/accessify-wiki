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

WIKI_BASE_URL = 'http://accessify.wikia.com/wiki/'
WIKI_SEARCH_URL = (
    WIKI_BASE_URL +
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
                }

    return result


def request_wiki_search(url):
    up = urlparse(url, scheme = "http")
    search_url = WIKI_SEARCH_URL + up.hostname
    rsp = requests.get(search_url)  #, timeout=0.001)
    rsp.raise_for_status()
    return rsp


def parse_fixes(page, page_title):
    fixes_yaml = preface = None
    matchObj = re.search(r"""
        (?P<preface>.+?)?
        (?P<newlines>[\r\n]*)
        <source[^>]*>
            (?P<fixes>.*)
        </source>
        """, page, re.I|re.M|re.S|re.X)

    if matchObj:
        preface = matchObj.group('preface')
        fixes_yaml = matchObj.group('fixes')

        fixes_yaml = fixes_yaml.replace(
            "&lt;", "<").replace("{{PAGENAME}}", page_title)

        fixes_yaml = parse_wiki_links(fixes_yaml)
        fixes_yaml = parse_date_hack(fixes_yaml)

    category_list = parse_categories(page)

    try:
        result = yaml.safe_load(fixes_yaml)
        #result['__CONFIG__']['wk_keywords'] = category_list
    except:
        result = {
            "stat": "fail",
            "code": 500.1,
            "message": "Error, YAML load failed."
        }
    config = result['_CONFIG_']
    config['wk_keywords'] = category_list
    config['wk_preface'] = preface

    return result


def parse_wiki_links(text):
    return re.sub(
        r'\[\[(?P<wikilink>\w+:\w+)\]\]',
        WIKI_BASE_URL + r'\g<wikilink>', text)

def parse_categories(text):
    list = re.findall(
        r'\[\[Category:([^\]]+)\]\]', text)
    if 'Fix' in list: list.remove('Fix')
    return list

def parse_date_hack(text):
    return re.sub(
        r'(?P<key>(created|updated)): (?P<date>[\w\-\+\:]+)',
        r'\g<key>: "\g<date>"', text)


# ===========================

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
