import scraperwiki
'''
  Accessify-wiki user page - user-JS/ Greasemonkey/ bookmarklet.

  Copyright Nick Freear, 2 May 2013.

'''
my = scraperwiki.utils.swimport("accessify_library_v1")

project_url = 'https://raw.github.com/nfreear/accessify-wiki/'
marklet_url = project_url + 'master/browser/js/accessifyhtml5-marklet.js'
userjs_url  = project_url + 'master/browser/userjs/accessify.user.js'

markdown_page = """
<!-- -*- markdown -*- -->

## For users

[TOC]

Below are two prototype tools to apply accessibility fixes to third-party sites. The first, a user Javascript will attempt to find fixes for every page you visit without your intervention. On the other hand, if you install the bookmarklet (favelet) you will need to press it for every page.

Both tools are built on AccessifyHTML5.js.


### User Javascript

Currently only works in Firefox (other browsers to follow).

Instructions for use with Firefox and Greasemonkey:

 1. Download and install the [Firefox web browser][firefox],
 2. Install the [Greasemonkey] add-on for Firefox,
 3. Install the [user Javascript][userjs]{#userjs}.

Other [installation instructions][gm-install-2] and user Javascripts.


### Bookmarklet

The bookmarklet works in all browsers.

<a id=bookmark rel=bookmark title="Accessify" href="javascript:(function(){var D=document,s=D.createElement('script');s.src='%(marklet_url)s?x='+(Math.random());s.type='text/javascript';D.body.appendChild(s)})();">Accessify</a>
 (*) bookmarklet &ndash; right-click and add or save me to your browser's bookmarks or favourites bar (Chrome and Safari users will wish to start by copying the link).


[firefox]: http://www.mozilla.com/firefox/
[greasemonkey]: https://addons.mozilla.org/en-US/firefox/addon/greasemonkey/
[gm-install-2]: http://userscripts.org/about/installing

[userjs]: %(userjs_url)s
[userjs-src]: view-source:%(userjs_url)s?src=1
[marklet-src]: view-source:%(marklet_url)s?src=1

""" % locals()

page = my.markdown(markdown_page)

print my.render( page )


# End.