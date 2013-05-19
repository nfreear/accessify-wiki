#!/usr/bin/env python
'''
  Accessify-wiki home page - "Proposal".

  Copyright Nick Freear, 27 April 2013.

'''
import scraperwiki
my = scraperwiki.utils.swimport("accessify_library_v1")


markdown_page = """
<!-- -*- markdown -*- -->

## Proposal

[TOC]

Tag line:

 * Working together to fix accessibility on the Web, one site at a time. Working with those of all abilities.

In a nutshell - various versions:

 * What is Accessify Wiki? Accessify Wiki is a way of authoring **[accessibility][def-a11y] fixes** for a site, without having control of that site, then delivering the fixes to a user during their normal browsing experience. It is not intended as a long-term accessibility solution for a site.
 * Using Accessify Wiki, person A who has no affiliation to or control over site B, can independently (co-)author **[accessibility][def-a11y] and usability fixes** for site B, so that they are delivered to person C during their normal browsing experience -- via a [browser extension][def-addon], [user Javascript][def-userjs] or similar.
 * Using Accessify Wiki, person A can during their normal browsing experience experience site B with **[accessibility][def-a11y] and usability fixes** -- via a [browser extension][def-addon], [user Javascript][def-userjs] or similar. The fixes can be (co-)authored by person C, even though that person has no affiliation to or control over site B.
 * So, for example it allows anyone to author accessibility fixes for popular and busy sites like Facebook, Google and Baidu.
 * Accessify Wiki is also a way of describing accessibility fixes to a non-specialist human (eg. a Wed developer or designer) in a clear, un-ambiguous format.


### Components

 1. End-user browser extensions/addons, user Javascripts (bookmarklets) and similar -- to deliver fixes in-browser (and to allow users to give feedback on sites and fixes);
 2. A repository/database and [query API][def-api] to allow the end-user extension to request fixes;
 3. Authoring/ development tools -- which may include a Wiki for collaborative authoring, a fix-checker/validation service, bookmarklet Javascripts, fix-submission form and so on;
 4. Site-owner tools to allow owner-developers to understand and package up/ integrate the accessibility fixes;
 5. A standardized way to author and store the fixes for editing, validation and re-use ([YAML][def-yaml]).


### Notes

 * Components 2 and 3 may be combined - different views of the same repository/ Wiki.
 * It is hoped that through careful choice/ development of tools and documentation, the author of fixes need not be a skilled Web developer, but can instead be someone with a passion for accessibility, a willingness to explore and learn, and the desire to help.
 * [All code to be open-source][code-accessify]; **accessibility fixes** to be open-source/open-data/[open content][def-opencontent], eg. GPL, MIT, Creative Commons [CC-by/CC-by-sa] (are fixes data or code?)
 * To date (April 2013), we have [prototyped][pr-accessify] components 1, 2, 3 and 5.


### How are fixes created?

The idea is:

 * To design usable authoring tools,
 * To create a low barrier of entry to authoring accessibility fixes,
 * And, to use [crowd-sourcing][def-crowd],
 * You/ we/ the community as a whole authors and maintains the fixes.

So, this project follows in the footsteps of Wikipedia, [Project Gutenberg][pg], [Fix the Web][fixtheweb], [Scripting Enabled][scriptingenabled] and others.


### How are fixes used?

It is envisioned that accessibility fixes will be used in at least three ways -- a typical **life-cycle** for fixes might be:

 1. Immediately after the fixes are authored they are applied by the user Javascripts or browser extensions. This is considered a short term, stop-gap solution;
 2. Later the fixes are packaged up as Javascript to be included in the site by the site-owner-developer. This can be considered a medium term solution;
 3. Eventually, when the site is undergoing maintenance or a re-design, most accessibility fixes are hard-coded in HTML templates or 'view' files. The developer uses the human-readable YAML file as a precise specification or recipe.

Note, in between the steps the fixes are likely to need editing as they are broken by small or large changes to the site in question.


### Limitations

There are naturally limitations to the accessibility fixes that a system like *Accessify Wiki* can apply. For example:

 * It cannot be used for the whole-sale simplification or clarification of the language of textual content,
 * It cannot re-order content to make pages more usable -- it may be possible to pre-pend or append text/HTML to parts of a page (proposal),
 * Currently it can't make widespread fixes to CSS stylesheets -- this may change (proposal),
 * Fixes will tend to break over time as third-party sites are edited and re-designed,
 * ...?

Notwithstanding these and other limitations, I suggest that **Accessify Wiki** will be a useful tool to improve the Web for all.


### Legal and author guidelines

We don't have any terms of service or formal guidelines yet. So for now:

 * Remember that the fixes that you write can directly affect an end-users' online experience,
 * Respect the end-users' privacy and security,
 * Specifically, don't write fixes for the secure areas of online banking services, online shops or other areas where private and credit card details are entered or displayed (guidance for the moment, may be relaxed),
 * No bad/ inappropriate/ offensive language or harassment please. We do not approve user submissions, but reserve the right to take down unsuitable content,
 * Accessify Wiki and AccessifyHTML5.js are designed to limit what accessibility fixes can do. Technically, they use a white-list of allowed HTML5 attributes, so that arbitrary Javascript etc. cannot be injected. However...
 * ...DISCLAIMER: "<small>There is no warranty for the program, to the extent permitted by applicable law. Except when otherwise stated in writing the copyright holders and/or other parties provide the program &ldquo;as is&rdquo; without warranty of any kind, either expressed or implied, including, but not limited to, the implied warranties of merchantability and fitness for a particular purpose.</small>" (Source: GPL)
 * You keep your copyright and right of attribution for any accessibility fixes or software code you contribute -- specific free/open source/open-content licenses to be decided.


### Next steps

 * Get feedback from the community,
 * Choose a domain-name,
 * Develop a Greasemonkey/user Javascript,
 * Author more fixes
 * ...?

### ScraperWiki

What is ScraperWiki?

[ScraperWiki][scraperwiki] is a set of online tools for data manipulation and analysis. We're using it to prototype the _Accessify Wiki_ idea. It may not be the long-term home for the project. Thank you to the team at ScraperWiki for creating a great set of tools. Check out the [ScraperWiki Beta][scraperwiki-beta].


### How can you help?

 * Provide moral support, be a critical friend, leave comments, show some love <em style="color:#b11;font-size:x-large">&hearts;</em> ...
 * Install and use the end-user [user-Javascript and bookmarklet](/run/accessify-user/). Give feedback,
 * Try authoring some fixes -- and pester Nick to provide examples and write a tutorial when you get stuck,
 * Help write tutorials(!)
 * Help with specifications including the JSON Schema,
 * Help write code -- server-side and/or Greasemonkey/ user-Javascript,
 * Provide web-hosting
 * ...?


### Contact

Contact Nick Freear via [email][mail-nfreear] or [Twitter][twitter-nfreear].

<!--<iframe src="https://docs.google.com/spreadsheet/pub?key=0AgJMkdi3MO4HdG9wdVVDMGpJUW8zZ1VVWVFiTWt3aEE&single=true&gid=0&output=html&widget=true" width="90%" height="300"></iframe>-->

"""

page = my.markdown(markdown_page)

print my.render( page )


# End.
