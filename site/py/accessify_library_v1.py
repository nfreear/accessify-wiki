#import scraperwiki
'''


  Copyright Nick Freear, 11 April 2013.
'''
import os, cgi, re, json, urllib, urllib2, yaml

#class accessify_library_v1:


def accessifyForm():
    page = """

<h2>Submit your fixes in YAML format</h2>

<form method="get" data-method="post" action="">

<!--{% csrf_token %}-->
<!--<input type="hidden" name="form_name" value="accessify-submit" />-->

<p><label for="u">URL of YAML file</label>
  <input id="u" name="url" type="url" pattern="^https?://.+\.ya?ml$" required
  placeholder="http://example.org/site-fixes.yaml" />

<p><label for="e">Email <small>we'll keep it private</small></label>
  <input id="e" name="email" type="email" />

<p><input id="i" name="intouch" type="checkbox" />
  <label for="i">I'd like to stay in touch
  <small>occasional newsletters and announcements<small>.</label>

<!--
 Text CAPTCHA?
-->
<p><input type="submit" />
</form>

"""
    return page


def render(page):
    template = """
<!doctype html><html lang="en"><meta charset="utf-8" /><title>Accessify Wiki prototype</title>
<!--<link rel="stylesheet" href="/run/accessify-css" />-->
<h1 role="banner"><span>Accessify Wiki</span></h1>
<ul role="navigation">
  <li><a href="/run/accessify-wiki">Home</a>
</ul>
<div role="main">

%s

</div>
</html>
""" % (page)

    return template


def error(message = "unknown error", status = 400):
    print "Error, ", message, status
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
                error("invalid '%s' parameter" % key)
        else:
            error("'%s' parameter is missing." % key)

    except:
        error("missing parameters (exception).")

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

def re_any():
    return re.compile(".*")


# End.
