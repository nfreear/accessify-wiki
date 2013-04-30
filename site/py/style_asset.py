import scraperwiki, re, mimetypes
'''
  Scrape a CSS stylesheet or other asset file and output with correct MIME type.

  Copyright Nick Freear, 28 April 2013.

  Usage: https://views.scraperwiki.com/run/style/?url=github:trevorturk/pygments/master/default.css

'''
my = scraperwiki.utils.swimport("accessify_library_v1")


uri = my.get('url', my.re_any())
ctype = my.get_option('type', r'[a-z]+\/[a-z]+')


def myReplace(mo):
    if mo.group(1) == 'github': return 'https://raw.github.com/' + mo.group(2)
    if mo.group(1) == 'gist': return 'https://gist.github.com/' + mo.group(2)
    else: return mo.group(0)


url = re.sub(r'([a-z]+?):([^\/])', myReplace, uri)


if not ctype:
    mimetypes.init()
    ctype, encoding = mimetypes.guess_type(url, strict = False)

#print ctype, mimetypes.knownfiles, mimetypes.types_map['.html']

if not ctype:
    ctype = 'text/plain'

my.httpHeaders(ctype)

if ctype == 'text/css' or ctype == 'application/javascript':
    print "/*\n  %(url)s\n*/" % locals()

print my.scrape(url)


# End.
