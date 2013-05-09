import scraperwiki
'''
  Shared Python library functions for the Accessify Wiki prototype.

  Copyright Nick Freear, 11 April 2013.

'''
import sys, os, cgi, re, json, urllib, urllib2, yaml, markdown


def httpHeaders(ctype, filename = None):
    scraperwiki.utils.httpresponseheader("Content-Type", ctype + "; charset=utf-8")
    if filename:
        scraperwiki.utils.httpresponseheader("Content-Disposition", "inline; filename=" + filename)

def scrape(url, params = None, user_agent = None):
    return scraperwiki.scrape(url, params, user_agent)


def scraperName():
    #['/home/startup/exec.py', '--script=/home/scriptrunner/script.py', '--scraper=accessify-user']
    return re.sub('.+=', '', sys.argv[2])


def render(page, title = "Accessify Wiki prototype"):
    google_analytics = googleAnalyticsJs()
    head = getPageHead()
    sname = scraperName()
    navigation = getNavigation()
    footer = getFooter()
    template = """<!doctype html>
<html lang="en"><meta charset="utf-8" /><title>%(title)s</title>
%(head)s

<div id="container" class="%(sname)s">

<h1 role="banner"><span>Accessify Wiki</span> <em>prototype</em></h1>
%(navigation)s
<div id=main role="main">

%(page)s

</div>
%(footer)s
</div>
%(google_analytics)s
</html>
""" % locals()
    return template


def error(message = "unknown error", status = 400):
    if "calls" not in error.__dict__: error.calls = 0
    if error.calls < 1:
        print render("<p class=error >Error, "+ message +" "+ str(status), "Error | Accessify Wiki")
    error.calls += 1
    sys.exit(1)


def apiError(message = "unknown error", status = 400, callback = None):
    # Based on Flickr's JSON REST error handling.
    er = { "stat":"fail", "code":status, "message":message }
    httpHeaders("application/json")
    if callback:
        print callback, "(", json.dumps( er ), ");"
    else:
        print json.dumps( er )
    sys.exit(1)


def form_submit():
    return os.getenv("QUERY_STRING")

def get(key, regex):
    if type(regex) == str:
        regex = re.compile(regex)
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
    if type(regex) == str:
        regex = re.compile(regex)
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

<p><label for="c">Comment <small>optional</small></label>
  <input id="c" name="comment" placeholder="Describe updated fixes.." />

<p><label for="e">Email <small>we'll keep it private</small></label>
  <input id="e" name="email" type="email" placeholder="j.blogs@example.com" />

<p><input id="i" name="intouch" type="checkbox" />
  <label for="i">I'd like to stay in touch
  <small>occasional newsletters and announcements</small>.</label>

<!--
 Text CAPTCHA?
-->
<p><button type="submit">Submit</button>
</form>

"""
    return page


def getPageHead():
    font = "PT Sans"
    font_enc = "PT+Sans"
    head = """
<!--[if lt IE 9]>
<script> document.createElement('main') </script>
<script src="//html5shim.googlecode.com/svn/trunk/html5-els.js"></script>
<![endif]-->

<link rel=stylesheet href="//fonts.googleapis.com/css?family=%(font_enc)s:400,700" />
<link rel=stylesheet href="/run/style/?url=github:trevorturk/pygments/master/default.css" />
<style>
body{ background:#fbfbfb; color:#333; font:1.05em '%(font)s',sans-serif; margin:1em 3em; }
input, button, label{ font-size:1em; display:inline-block; min-width:13em; }
input:not([type = checkbox]){min-width:30em; padding:2px;}
h1{ font-size:1.7em; }
h1 em{font-size:.8em; font-weight:normal; color:gray;}
h2{ font-size:1.4em; }
li{margin:2px 0;}
#nav ul{margin:0; padding:0;}
#nav li{display:inline-block; padding:0;}
#nav a {display:inline-block; min-width:6em; padding:6px 18px; margin-right:8px; text-align:center; border:1px solid #ccc; background:#eee;}
#nav a:hover, #nav a:focus{background:#f9f9f9;}
#foot{padding:1em 6px; margin-top:3em; border-top:1px solid #bbb; background:#eee; font-size:.95em;}
#feed{padding-left:30px; display:inline-block; min-height:26px; background:url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Feed-icon.svg/24px-Feed-icon.svg.png) no-repeat left;}
#bookmark, #userjs{ border:1px solid orange; padding:2px 18px; background:#eee; border-radius:4px; }
</style>
""" % locals()
    return head


def getNavigation():
    url = 'http://baidu.com/'
    nav = """
<nav id=nav role="navigation">
  <ul>
  <li><a href="/run/accessify-wiki/">Home</a>
  <li><a href="/run/accessify-user/" title="Browser extensions &amp; bookmarklets for end-users">For users</a>
  <!--<li><a href="/run/accessify-bookmarklet/">For users</a>-->
  <li><a href="/run/accessify-author-1/" title="Bookmarklets &amp; tools for people contributing fixes">For authors</a>
  <li><a href="/run/accessify-form/">Submit fixes</a>
  <li><a href="/run/accessify-site/?url=%(url)s">For site owners</a>
  </ul>
</nav>
""" % locals()
    return nav


def getFooter(feed_limit = 4):
    api_url = "https://api.scraperwiki.com/api/1.0/datastore/sqlite"
    query = "SELECT+name+AS+title%2Cname+AS+description%2C+url+AS+link%2C+updated+AS+date+FROM+fixes"
    footer = """
<p id=foot role=contentinfo >
 <a id=feed rel=alternate title="RSS feed of recent Accessibility fixes" href=
 "%(api_url)s?format=rss2&amp;name=accessify-form&amp;query=%(query)s+LIMIT+%(feed_limit)s">Feed</a>
 | <a id=api href="https://scraperwiki.com/docs/api?name=accessify-form&table_names=fixes,include_map#sqlite" title="Via the ScraperWiki API">API</a>
 | <a id=code href="https://github.com/nfreear/accessify-wiki" title="Fork me on Github">Get the code</a>
 | <a id=poweredby href="https://scraperwiki.com/views/accessify-wiki/" title="Powered by ScraperWiki - thank you ;)">Powered by ScraperWiki</a>
 | <a id=ftw href="http://fixtheweb.net/" title="Fixing web accessibility">Fix the Web</a>
 | <a id=twitter href="http://twitter.com/nfreear" title="Contact: Nick Freear">@nfreear</a>
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


def markdown(page = ""):
    import markdown
    wiki = 'http://en.wikipedia.org/wiki'
    references = """
[def-a11y]:   %(wiki)s/Web_accessibility
[def-usable]: %(wiki)s/Usability
[def-addon]:  %(wiki)s/Browser_extension
[def-userjs]: %(wiki)s/Greasemonkey
[def-aug]:   %(wiki)s/Augmented_browsing
[def-crowd]: %(wiki)s/Crowdsourcing
[def-yaml]:  %(wiki)s/YAML
[def-api]:   %(wiki)s/Application_programming_interface#Web_APIs
[def-opencontent]: %(wiki)s/Open_content
[def-critical]: %(wiki)s/Critical_friend
[def-jsonschema]: %(wiki)s/JSON#Schema

[code-accessify]: https://github.com/nfreear/accessify-wiki
[pr-accessify]: https://views.scraperwiki.com/run/accessify-form/
[accessifyhtml5]: https://github.com/yatil/accessifyhtml5.js "by Eric Egert @yatil"
[closure-compiler]: http://closure-compiler.appspot.com/home
[pg]: http://www.gutenberg.org/
[fixtheweb]: http://www.fixtheweb.net/
[scriptingenabled]: http://scriptingenabled.org/

""" % locals()
    return markdown.markdown(page + references, extensions = [
        "headerid", "toc(title=Contents)", "wikilinks", 'fenced_code', 'codehilite', 'attr_list'
        ])


# End.
