#!/usr/local/bin/python2.7
#!/usr/bin/env python
#
# Convert Gettext PO translation catalogues to Javascript files.
#
# http://polib.readthedocs.org/en/latest/quickstart.html
#
#import gettext
import glob, re, datetime, json
import polib

#fp = open("translate/accessify.fr.mo")
#cat = gettext.GNUTranslations(fp)
#print cat.info()

#http://stackoverflow.com/questions/2225564/python-get-a-filtered-list-of-files-in-directory
po_files = glob.glob('translate/*.po')
print po_files

dt_now = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")


for po_file in po_files:

    m = re.match(r'.*\.([^\.]+)\.po', po_file)
    lang_code = m.group(1)

    js_file = "browser/locale/ac5u." + lang_code + ".js"

    po = polib.pofile(po_file)
    #print po.metadata
    lang_name = po.metadata['Language']

    dict = {}
    for entry in po.translated_entries():
        #print entry.msgid, entry.msgstr
        try:
            where = entry.occurrences[0][0]
        except:
            where = ""

        if re.match(r'^browser\/.*\.js', where):
            dict[entry.msgid] = entry.msgstr
        else:
            print "Not a 'browser' Javascript", where

    f = open(js_file, "w")
    f.write("/* DO NOT EDIT - Auto-generated. $" + dt_now + "$\n")
    f.write("*/\n")
    f.write("window.AC5U = window.AC5U || {};\n")
    #f.write("")
    f.write("window.AC5U.texts_locale = " + json.dumps(lang_name) + ";\n")
    f.write("window.AC5U.texts = " + json.dumps(dict,
        sort_keys=True, indent=2, separators=(',', ': '))
    )
    f.close()

#End.
