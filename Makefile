# GNU Make file for Accessify-wiki.

# Environment: Mac OS X.
PYTHON=/usr/local/bin/python2.7
APPCFG=/Applications/Utilities/GoogleAppEngineLauncher.app/Contents/Resources/GoogleAppEngine-default.bundle/Contents/Resources/google_appengine/appcfg.py
OPTS=--no_cookies --email=n.d.freear@gmail.com --passin --verbose

#.
app-help:
	$(PYTHON) $(APPCFG) --help

app-update:
	$(PYTHON) $(APPCFG) $(OPTS) update app.yaml

