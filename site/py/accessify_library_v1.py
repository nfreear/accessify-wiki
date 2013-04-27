import scraperwiki
'''
  Shared Python library functions for the Accessify Wiki prototype.

  Copyright Nick Freear, 11 April 2013.
'''
import os, cgi, re, json, urllib, urllib2, yaml

#class accessify_library_v1:



def httpHeaders(ctype, filename = None):
    scraperwiki.utils.httpresponseheader("Content-Type", ctype + "; charset=utf-8")
    if filename:
        scraperwiki.utils.httpresponseheader("Content-Disposition", "inline; filename=" + filename)


def render(page, title = "Accessify Wiki prototype"):
    google_analytics = googleAnalyticsJs()
    styles = getStylesheet()
    navigation = getNavigation()
    footer = getFooter()
    template = """
<!doctype html><html lang="en"><meta charset="utf-8" /><title>%(title)s</title>
%(styles)s

<h1 role="banner"><span>Accessify Wiki</span></h1>
%(navigation)s
<div id=main role="main">

%(page)s

</div>
%(footer)s
%(google_analytics)s
</html>
""" % locals()
    return template


def error(message = "unknown error", status = 400):
    print render("<p class=error >Error, "+ message +" "+ str(status))
    exit(-1)

def apiError(message = "unknown error", status = 400, callback = None):
    # Based on Flickr's JSON REST error handling.
    er = { "stat":"fail", "code":status, "message":message }
    httpHeaders("application/json")
    if callback:
        print callback, "(", json.dumps( er ), ");"
    else:
        print json.dumps( er )
    exit(-1)


def form_submit():
    return os.getenv("QUERY_STRING")

def get(key, regex):
    #regex.match("anything")
    try:
        qsenv = dict(cgi.parse_qsl(os.getenv("QUERY_STRING")))
        if key in qsenv:
            value = qsenv[key]
            m_value = regex.match(value)
            if not m_value:
                #error("invalid '%s' parameter: %s" % key, value)
                error("invalid '%s' parameter." % key)
        else:
            error("'%s' parameter is missing." % key)

    except:
        error("missing parameters (exception).")

    return value

def get_option(key, regex, default=None):
    try:
        qsenv = dict(cgi.parse_qsl(os.getenv("QUERY_STRING")))
        if key in qsenv:
            value = qsenv[key]
            m_value = regex.match(value)
            if not m_value:
                error("invalid '%s' parameter." % key)
        else:
            return default
    except:
        return default

    return value


# http://regexpal.com
# http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address
def re_email():
    return re.compile("^\S+@\S+\.\S+$")

def re_https_url():
    return re.compile("^https?\:\/\/.+\..+$")

def re_yaml_url():
    return re.compile("^https?\:\/\/.+\..+\/.+\.ya?ml$")

def re_jsonp_callback():
    return re.compile("^[\$a-zA-Z_][\w\._]+$")

def re_api_format():
    return re.compile("^json|yaml|yaml-c$")

def re_any():
    return re.compile(".*")


# ==========================================
# Page fragments.


def accessifyForm():
    page = """

<h2>Submit fixes</h2>
<p>Submit your fixes in YAML format.

<form method="get" data-method="post" action="">

<!--{% csrf_token %}-->
<!--<input type="hidden" name="form_name" value="accessify-submit" />-->

<p><label for="u">URL of YAML file <small>publicly visible</small></label>
  <input id="u" name="url" type="url" pattern="^https?://.+\.ya?ml$" required
  placeholder="http://example.org/site-fixes.yaml" />

<p><label for="e">Email <small>we'll keep it private</small></label>
  <input id="e" name="email" type="email" />

<p><input id="i" name="intouch" type="checkbox" />
  <label for="i">I'd like to stay in touch
  <small>occasional newsletters and announcements</small>.</label>

<!--
 Text CAPTCHA?
-->
<p><input type="submit" />
</form>

"""
    return page


def getStylesheet():
    return """
<style>
body{ background:#fcfcfc; color:#333; font:1.1em sans-serif; margin:3em; }
input, button, label{ font-size:1em; display:inline-block; min-width:16em; }
h1{ font-size:1.6em; }
#nav{margin:0; padding:0;}
#nav li{display:inline-block; padding:0;}
#nav a {display:inline-block; min-width:6em; padding:8px 16px; margin:8px; text-align:center; border:1px solid #ccc; background:#eee;}
#nav a:hover, #nav a:focus{background:#f9f9f9;}
#foot{padding-top:1em; margin-top:2em; border-top:1px solid #bbb;}
#feed{padding-left:30px; display:inline-block; min-height:26px; background:url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Feed-icon.svg/24px-Feed-icon.svg.png) no-repeat left;}
#bookmark{ border:1px solid orange; padding:2px 20px; background:#eee; border-radius:4px; }
</style>
"""


def getNavigation():
    return """
<ul id=nav role="navigation">
  <li><a href="/run/accessify-wiki">Home</a>
  <li><a href="/run/accessify-bookmarklet" title="Browser extensions &amp; bookmarklets for end-users">For users</a>
  <li><a href="/run/accessify-author-1" title="Bookmarklets &amp; tools for people contributing fixes">For authors</a>
  <li><a href="/run/accessify-form">Submit fixes</a>
  <li><a href="/run/accessify-site">For site owners</a>
</ul>
"""


def getFooter(feed_limit = 4):
    api_url = "https://api.scraperwiki.com/api/1.0/datastore/sqlite"
    query = "SELECT+name+AS+title%2Cname+AS+description%2C+url+AS+link%2C+updated+AS+date+FROM+fixes"
    footer = """
<p id=foot role=contentinfo >
  <a id=feed rel=alternate title="RSS feed" href=
  "%(api_url)s?format=rss2&amp;name=accessify-form&amp;query=%(query)s+LIMIT+%(feed_limit)s"
  >Feed</a>
  | <a id=code href="https://github.com/nfreear/accessify-wiki" title="Fork me on Github">Get the code</a>
  | <a id=poweredby href="https://scraperwiki.com/views/accessify-form/" title="Powered by ScraperWiki">Powered by ScraperWiki</a>
</p>
""" % locals()
    return footer


def googleAnalyticsJs(analytics_id = "UA-40194374-1"):
    script = """
<script id="gajs">
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', '%(analytics_id)s', 'scraperwiki.com');
  ga('send', 'pageview');
</script>
""" % locals()
    return script


def markdownReferences():
    return """
[def-a11y]: http://en.wikipedia.org/wiki/Web_accessibility
[def-usable]: http://en.wikipedia.org/wiki/Usability
[def-addon]: http://en.wikipedia.org/wiki/Browser_extension
[def-userjs]: http://en.wikipedia.org/wiki/Greasemonkey
[def-aug]: http://en.wikipedia.org/wiki/Augmented_browsing
[def-yaml]: http://en.wikipedia.org/wiki/YAML
[def-api]: http://en.wikipedia.org/wiki/Application_programming_interface#Web_APIs
[def-opencontent]: http://en.wikipedia.org/wiki/Open_content
[def-critical]: https://en.wikipedia.org/wiki/Critical_friend
[def-jsonschema]: http://en.wikipedia.org/wiki/JSON#Schema

[code-accessify]: https://github.com/nfreear/accessify-wiki
[pr-accessify]: https://views.scraperwiki.com/run/accessify-form/

"""


# End.
