import scraperwiki
'''
  Accessify-wiki - tool(s) for site owners.

  Copyright Nick Freear, 28 April 2013.

  Usage: https://views.scraperwiki.com/run/accessify-site/?url=http://baidu.com/
'''
my = scraperwiki.utils.swimport("accessify_library_v1")


url = my.get_option('url', my.re_https_url())

if not url:
    url = 'http://baidu.com/'
    my.error("expecting the url of a page for which we have fixes, eg. <a href='?url=%(url)s'>?url=%(url)s</a>" % locals())


# TODO: check the URL!



markdown_page = """
<!-- -*- markdown -*- -->

<style>.code pre{ border:2px dashed #aaa; border-radius:8px; background:#eee; padding:1em; margin:1em; }</style>
<link rel=EX-stylsheet href="/run/style/?url=github:trevorturk/pygments/master/default.css" />

## For site owners

A work in progress!

 1. Copy the code below and paste it in the [Closure Compiler][closure-compiler]. Run the compiler and save your site-specific Javascript.

```
#!javascript
// ==ClosureCompiler==
// @compilation_level SIMPLE_OPTIMIZATIONS
// @output_file_name accessifyhtml5-site-x-min.js
// @code_url https://raw.github.com/nfreear/accessifyhtml5.js/master/accessifyhtml5.js
// @code_url https://views.scraperwiki.com/run/accessify_utils_v1/?url=%(url)s&callback=__accessifyhtml5_inpage_CB
// ==/ClosureCompiler==



/*
  Callback for AccessifyHTML5.js
*/

/*global document, console, AccessifyHTML5 */

function __accessifyhtml5_inpage_CB(fixes) {
    "use strict";

    var res,
        pat = /debug/,
        L = document.location;

    function alog(s) {
        if (typeof console !== "undefined" && (L.search.match(pat) || L.hash.match(pat))) {
            console.log(arguments.length > 1 ? arguments : s);
        }
    }

    alog("AccessifyHTML5");

    res = AccessifyHTML5(false, fixes);

    alog(res);
    //return res;
}
```


 2. Upload the compiled Javascript file to your site.
 3. Copy the following to the bottom of your site's HTML page template, just before the closing `</body>` tag. Edit `/path/to/your/..`:

```
#!html
<script src="/path/to/your/accessifyhtml5-site-x-min.js"></script>
```

 4. View [your site's test page][test-url] in a browser such as Chrome - with the debug flag.
{: start=4}


[test-url]: %(url)s?debug=1
""" % locals()


page = my.markdown(markdown_page)

print my.render( page )


# End.
