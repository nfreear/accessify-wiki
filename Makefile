# GNU Make file for Accessify-wiki.

# Environment: Mac OS X.
PYTHON=/usr/local/bin/python2.7
GAE_BASE=/Applications/Utilities/GoogleAppEngineLauncher.app/Contents/Resources/GoogleAppEngine-default.bundle/Contents/Resources/
APPCFG=$(GAE_BASE)google_appengine/appcfg.py
OPTS_CFG=--no_cookies --email=n.d.freear@gmail.com --passin --verbose
APPSERVER=$(GAE_BASE)google_appengine/dev_appserver.py
OPTS_SRV=--skip_sdk_update_check=yes --port=8081 --admin_port=8002 app.yaml

# Requires Gettext 0.18.3 or higher.
XGETTEXT=/usr/local/bin/xgettext
META=--copyright-holder="Copyright 2013 Nick Freear/Accessify Wiki." \
 --package-name=Accessify-wiki-user-JS --msgid-bugs-address=nfreear+@+yahoo.co.uk


help:
	@echo Accessify-wiki make-deployer.
	@echo
	@echo Available commands:
	@echo "		make cfg-help"
	@echo "		make srv-help"
	@echo "		make update"
	@echo "		make gettext-userjs

# Was 'app-help'.
cfg-help:
	$(PYTHON) $(APPCFG) --help

# Was 'app-update'.
update:
	$(PYTHON) $(APPCFG) $(OPTS_CFG) update app.yaml

srv-help:
	$(PYTHON) $(APPSERVER) --help

gettext-userjs:
	$(XGETTEXT) --language=JavaScript -kt:1 \
	--from-code=utf-8 --add-comments=/ $(META) \
	-o accessify-wiki-userjs.pot \
	browser/js/accessifyhtml5-marklet.js


# End.
