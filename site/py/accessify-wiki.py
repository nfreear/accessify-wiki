import scraperwiki
'''
  Accessify-wiki home page - "Proposal".

  Copyright Nick Freear, 27 April 2013.

'''
my = scraperwiki.utils.swimport("accessify_library_v1")


markdown_page = """
<!-- -*- markdown -*- -->

## Proposal

[TOC]

Tag line:

 * Working together to fix accessibility on the Web, one site at a time.

In a nutshell:

 * What is Accessify Wiki? Accessify Wiki is a way of authoring accessibility fixes for a site, without having control of that site, then delivering the fixes to a user during their normal browsing experience. It is not intended as a long-term accessibility solution for a site.
 * Using Accessify Wiki, person A who has no affiliation to or control over site B, can independently (co-)author **[accessibility][def-a11y] and usability fixes** for site B, so that they are delivered to person C during their normal browsing experience -- via a [browser extension][def-addon], [user Javascript][def-userjs] or similar.
 * Using Accessify Wiki, person A can during their normal browsing experience experience site B with **[accessibility][def-a11y] and usability fixes** -- via a [browser extension][def-addon], [user Javascript][def-userjs] or similar. The fixes can be (co-)authored by person C, even though that person has no affiliation to or control over site B.
 * So, for example it allows anyone to author accessibility fixes for Facebook or a Google site.


### Components

 1. End-user browser extensions/addons, user Javascripts (bookmarklets) and similar -- to deliver fixes in-browser (and to allow users to give feedback on sites and fixes);
 2. A repository/database and [query API][def-api] to allow the end-user extension to request fixes;
 3. Authoring/ development tools -- which may include a Wiki for collaborative authoring, a fix-checker/validation service, bookmarklet Javascripts, fix-submission form and so on;
 4. Site-owner tools to allow owner-developers to understand and package up/ integrate the accessibility fixes;
 5. A standardized way to author and store the fixes for editing, validation and re-use ([YAML][def-yaml]).

#### Notes

 * Note, 2 and 3 may be combined - different views of the same repository/ Wiki.
 * It is hoped that through careful choice/ development of tools and documentation, the author of fixes need not be a skilled Web developer, but can instead be someone with a passion for accessibility, a willingness to explore and learn, and the desire to help.
 * [All code to be open-source][code-accessify]; **fixes** to be open-source/open-data/[open content][def-opencontent], eg. GPL, MIT, Creative Commons [CC-by/CC-by-sa] (are fixes data or code?)
 * To date (April 2013), we have [prototyped][pr-accessify] components 1, 2, 3 and 5.


### How are fixes used?

It is envisioned that accessibility fixes will be used in three ways -- a typical **life-cycle** for fixes might be:

 1. Immediately after the fixes are authored they are applied by the user Javascripts or browser extensions. This is considered a short term, stop-gap solution;
 2. Later the fixes are packaged up as Javascript to be included in the site by the site-owner-developer. This can be considered a medium term solution;
 3. Eventually, when the site is undergoing maintenance or a re-design, most accessibility fixes are hard-coded in HTML templates or 'view' files. The developer uses the human-readable YAML file as a precise specification or recipe.

Note, in between the steps the fixes are likely to need editing as they are broken by small or large changes to the site in question.


### Limitations

There are naturally limitations to the accessibility fixes that a system like *Accessify Wiki* can apply. For example:

 * It cannot be used to simplify or clarify the language of textual content,
 * It cannot re-order content to make pages more usable,
 * Currently it can't make widespread fixes to CSS stylesheets -- this may change (see proposal),
 * Fixes will tend to break over time as third-party sites are edited and re-designed,
 ...?

Notwithstanding these and other limitations, I think that Accessify Wiki will be a useful tool to improve the Web for all.


### How can you help?

 * Provide moral support, be a critical friend, leave comments, show some love &hearts; ...
 * Try authoring some fixes -- and pester Nick to provide examples and write a tutorial when you get stuck,
 * Help write tutorials(!)
 * Help with specifications including the JSON Schema,
 * Help write code -- server-side and/or Greasemonkey/ user-Javascript,
 * Provide web-hosting
 ...?

"""

page = my.markdown(markdown_page)

print my.render( page )


# End.
