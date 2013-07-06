accessify-wiki
==============

Working together to fix accessibility on the Web, one site at a time.

Using Accessify Wiki, person A who has no affiliation to or control over site B, can independently (co-)author **[accessibility][def-a11y] fixes** for site B, so that they are delivered to person C during their normal browsing experience -- via a [browser extension][def-addon], [user Javascript][def-userjs] or similar.


 * `/browser/` contains browser plugins, bookmarklet Javascript and user Javascript (Greasemonkey).
 * `/data/` contains sample site-fixes in [YAML][def-yaml] format.
 * `/lib/` contains Python libraries for the `webapp2` based service.
 * `/schema/` contains a [JSON Schema][json-schema] for site-fix files.
 * `/site/` contains a prototype site and web-service, currently mostly written in Python to be hosted on [ScraperWiki][scraper-py].


## Links

 * Home page/ proposal - [Scraperwiki: run/accessify-wiki][pr-home]
 * Prototype Accessify bookmarklet - [Scraperwiki: run/accessify-bookmarklet][pr-marklet]
 * Prototype Accessify submit form - [Scraperwiki: run/accessify-form][pr-form]
 * Discussion document - [Google Docs..][accessify-rfc]
 * Schema draft/ discussion - [Google Docs..][schema-rfc]


## Dependencies

Python Standard Library:

 * sys, os, cgi, url, urllib2, hashlib, datetime, re, mimetypes, json.

Python third-party:

 * virtualenv
 * **scraperwiki
 * lxml.html `cssselect`
 * yaml `safe_load/ dump*`
 * httplib2
 * markdown (* ScraperWiki classic/ Beta)
 * BeautifulSoup `from bs4 import BeautifulSoup`
 * jsonschema (* ScraperWiki beta!!)
 * requests (* ScraperWiki beta)


## Credits

 * ScraperWiki for prototype hosting - [www.scraperwiki.com][scraperwiki]
 * Eric Eggert @yatil for [accessifyhtml5.js][accessifyhtml5]


[Accessify-wiki][scraper-acfy]: Copyright 2013 Nick Freear & contributors. License: [MIT][mit] & [GPLv2][gpl].


[scraperwiki]: https://scraperwiki.com/
[scraper-py]: https://scraperwiki.com/docs/python/
[scraper-acfy]: https://scraperwiki.com/tags/accessify-wiki
[accessifyhtml5]: https://github.com/yatil/accessifyhtml5.js
[accessify-rfc]: https://docs.google.com/document/d/1V0oTZ0m5A1iQfmftiM8VUg2N-Sm_-syXCQxzQQcD-qU/edit
[schema-rfc]: https://docs.google.com/document/d/1ZDyCdy1jclqeqDoV6_-1_GTjakbzCzUaPOr_Pk-GHKU/edit
[pr-home]: https://views.scraperwiki.com/run/accessify-wiki
[pr-marklet]: https://views.scraperwiki.com/run/accessify-bookmarklet
[pr-form]: https://views.scraperwiki.com/run/accessify-form
[pr-author]: https://views.scraperwiki.com/run/accessify-author-1
[json-schema]: http://json-schema.org/
[def-yaml]: http://en.wikipedia.org/wiki/YAML
[def-a11y]: http://en.wikipedia.org/wiki/Web_accessibility
[def-addon]: http://en.wikipedia.org/wiki/Browser_extension
[def-userjs]: http://en.wikipedia.org/wiki/Greasemonkey
[gpl]: http://gnu.org/licenses/gpl-2.0.html
[mit]: http://nfreear.mit-license.org/
