#!/usr/local/bin/python2.7
#!/usr/bin/env python
#
# Convert Gettext PO translation catalogues to Javascript files.
#
# http://polib.readthedocs.org/en/latest/quickstart.html
#
#import gettext
import json, polib

#fp = open("translate/accessify.fr.mo")
#cat = gettext.GNUTranslations(fp)
#print cat.info()


codes = ["fr"]

for code in codes:

    po_file = "".join(["translate/accessify.", code, ".po"])
    js_file = "browser/locale/ac5u." + code + ".js"

    po = polib.pofile(po_file)
    #print po.metadata
    lang_name = po.metadata['Language']

    dict = {}
    for entry in po.translated_entries():
        #print entry.msgid, entry.msgstr
        dict[entry.msgid] = entry.msgstr


    print "/*",lang_name,"translation/ language pack for Accessify Wiki user-JS."
    print "*/"
    print "window.AC5U = window.AC5U || {};"
    print ""
    print "window.AC5U.texts_locale =", json.dumps(code), ";"
    print "window.AC5U.texts =", json.dumps(dict,
        sort_keys=True, indent=4, separators=(',', ': '))

