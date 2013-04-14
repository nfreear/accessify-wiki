import scraperwiki

"""
 Online YAML to JSON-P converter.

 Copyright 2013-03-27 Nick Freear. All rights reserved.
 License:

 Usage: https://views.scraperwiki.com/run/yaml_2_jsonp/?callback=FN&url=http://example.org/my.yaml
 Source: <https://gist.github.com/nfreear/5253382>
"""

import os, cgi, re, json, urllib, urllib2, yaml
# import webpy


p_callback = re.compile('^[\$a-zA-Z_][\w\._]+$')



def myError(message = "unknown error", status = 400):
    print "Error, ", message, status
    exit(-1)



try:
    qsenv = dict(cgi.parse_qsl(os.getenv("QUERY_STRING")))
    if 'url' in qsenv:
        url = qsenv['url']
    else:
        myError("'url' parameter is missing.")

    if 'callback' in qsenv:
        callback = qsenv['callback']
        m_cb = p_callback.match(callback)
        if not m_cb:
            myError("invalid 'callback' parameter: " + callback)

        # Callback special case -- AccessifyHTML5(false, {}}
        if callback == 'AccessifyHTML5':
            callback += '(false,'
        else:
            callback += '('
except:
    myError("missing parameters (exception).")



# http://docs.python.org/release/2.4.4/lib/urllib2-examples.html

req = urllib2.Request( url )
req.add_header('Referer', 'https://scraperwiki.com/profiles/nfreear/')
req.add_header('User-agent', 'yaml_2_jsonp/v1/python')
try:
    resp = urllib2.urlopen(req)
except:
    myError("not found: " + url, 404)


try:
    obj = yaml.load( resp.read() )
except:
    myError("bad YAML: " + url, 500)


scraperwiki.utils.httpresponseheader("Content-Type", "application/json; charset=utf-8")
scraperwiki.utils.httpresponseheader("Content-Disposition", "inline; filename=yaml_2_jsonp.json")
# Not allowed :( scraperwiki.utils.httpresponseheader("Access-Control-Allow-Origin", "*")


if 'callback' in qsenv:
    print '/*'
    print ' JSON-P source:', url
    print '*/'
    print callback, json.dumps( obj ), ');'
else:
    print json.dumps( obj )

exit(0)
