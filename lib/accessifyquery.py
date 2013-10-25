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
import urllib, urllib2, yaml, json, re
from urlparse import urlparse

WIKI_BASE_URL = 'http://accessify.wikia.com/'
WIKI_SEARCH_URL = (
    WIKI_BASE_URL +
    "wiki/Special:Search?ns0=1&format=json&limit=5&fulltext=Search&search=")
WIKI_RECENT_URL = (
    WIKI_BASE_URL +
    "api.php?action=query&list=recentchanges&format=json" +
    "&rcnamespace=0&rclimit=15&rcprop=title&rctoponly=1")

LOCALE_ATTR_RE = r"(alt|aria-label|placeholder|title)"


def query(url, min = None, lang = None):
    result = query = host = found = page_url = None

    if not url:
        # Error.
        result = {
            "stat": "fail",
            "code": 400,
            "message": "Error, expecting a 'url' parameter."
        }
        return result

    up = urlparse(url, scheme = "http")

    if up.netloc and not up.netloc == "":
    #if up.hostname not "":
        #query = up.hostname
        query = host = up.netloc
    elif url.find("Fix:") > -1:
        query = url.replace("_", " ")
    else:
        result = {
            "stat": "fail",
            "code": 400.2,
            "message": "Error, expecting a 'url' parameter (2)"
        }

    if host:
        # TODO: error handling - parse, urlopen-read, json-load...

        try:
            r = request_wiki_search(host)
        except requests.HTTPError:
            result = {
                'stat': 'fail',
                'code': r.status_code,
                'message': 'Error, HTTP error on search request.'
            }
        else:
            search_results = r.json()
            # The response format has changed (23 Aug 2013), and back.
            if len(search_results) < 1:
                result = {
                    "stat": "fail",
                    "code": 404.1,
                    "message": "Warning, fixes not found."
                }
            else:
                for result in search_results:
                    print result
                    if result["title"].find("Fix:") > -1:
                        found = result
                        break
                else:
                    result = {
                        "stat": "fail",
                        "code": 404.2,
                        "message": "Warning, fixes not found (search 2)."
                    }

    if not host and query:
        page_id = None
        page_url = WIKI_BASE_URL + 'wiki/' + query.replace(' ', '_')
        page_title = query.replace("Fix:", "")

    elif found:
        page_id  = found["pageid"]
        page_url = found["url"]
        page_title = found["title"].replace("Fix:", "")

    if page_url:
        r = requests.get(page_url + '?action=raw')
        page = r.text

        result = parse_fixes(page, page_title, min)

        try:
            config = result['_CONFIG_']
        except:
            print "ERROR ", page_url
            return result

        # Prevent spurious warnings.
        if 'ignore_defaults' not in config:
            config['ignore_defaults'] = True

        test_urls = ''.join(config['test_urls'])

        if host and test_urls.find(host) == -1:
            print "Warning can't find host in test_urls."

        if min and '_CONFIG_' in result:
            config['test_urls'] = [config['test_urls'][0]]
            config['description'] = None
            config['authors'] = []

        elif not min:
            config['wk_query'] = query
            config['wk_page_url'] = page_url
            config['wk_page_id']  = page_id
            config['rq_lang'] = lang

            #if config['wk_preface'] and not config['description']:
            if 'wk_preface' in config and 'description' not in config:
                config['description'] = config['wk_preface']
                config['wk_preface'] = None

        #result["_DEBUG_"] = {
        #    "query": query,
        #    #"search_url": search_url,
        #    "page_url": page_url,
        #    "page_id": page_id,
        #}

    result = parse_lang_attr(result, lang)

    return result


def request_wiki_search(query):
    #up = urlparse(url, scheme = "http")
    search_url = WIKI_SEARCH_URL + urllib.quote_plus(query)
    print search_url

    rsp = requests.get(search_url)  #, timeout=0.001)
    rsp.raise_for_status()
    return rsp


def parse_fixes(page, page_title, min = None):
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
    except:
        # Need exception details!
        result = {
            "stat": "fail",
            "code": 500.1,
            "message": "Error, YAML load failed.",
            "data": fixes_yaml
        }
    if not min:
        config = result['_CONFIG_']
        config['wk_keywords'] = category_list
        config['wk_preface'] = preface

    return result


def parse_wiki_links(text):
    return re.sub(
        r'\[\[(?P<wikilink>\w+:\w+)\]\]',
        WIKI_BASE_URL + r'wiki/\g<wikilink>', text)

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

# Search for localized attributes, transform none-localized..
def parse_lang_attr(result, lang = None):
    if not lang or not re.search(r'^[a-z]{2}([-][A-Z]{2}|-?\.\*)$', lang, re.I):
        return result

    lang_attr_re = re.compile(LOCALE_ATTR_RE + "." + lang, re.I)

    # Maybe: loop over a copy, modify the original.
    for selector in result:
        fixes = result[selector]

        for key in fixes:
            value = fixes[key]

            m = lang_attr_re.match(key)
            if m:
                old_val = fixes[m.group(1)]
                #result[selector][m.group(1) + ".xxx"] = val
                fixes[m.group(1)] = value
                #fixes[key] = old_val

    return result

# ===========================

def parse_search_alt(search_results):
    result = found = None
    # The response format has changed (23 Aug 2013).
    if "currentUrl" not in search_results:
        result = {
            "stat": "fail",
            "code": 500.2,
            "message": "Error, no 'currentUrl' index in search results."
        }
    elif "0" not in search_results:
        result = {
            "stat": "fail",
            "code": 404.1,
            "message": "Warning, fixes not found."
        }
    else:
        found = None
        print ">> Search results", search_results
        for n in range(0, 10):
            try:
                result = search_results[str(n)]
                if result["title"].find("Fix:") > -1:
                    found = result
                    break
            except:
                pass

        if not found:
            result = {
                "stat": "fail",
                "code": 404.2,
                "message": "Warning, fixes not found (search 2)."
            }
    return result


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
