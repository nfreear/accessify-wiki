/*!
 Bookmarklet to apply AccessifyHTML5.js to various web sites.

 Nick Freear, 28 March 2013.

 Self: https://dl.dropbox.com/u/3203144/wai-aria/accessifyhtml5-marklet.js
 Also: https://gist.github.com/nfreear/5254266#file-ouice-wai-aria-html

 Bookmarklet:

javascript:(function(){var sc=document.createElement('SCRIPT');sc.type='text/javascript';sc.src='https://dl.dropbox.com/u/3203144/wai-aria/accessifyhtml5-marklet.js?x='+(Math.random());document.getElementsByTagName('body')[0].appendChild(sc);document.ac5_srvurl='http://example.org'})();
*/

(function () {

  "use strict";

  var map = {
      "open.ac.uk": "https://gist.github.com/nfreear/5253410/raw/ouice-wai-aria.yaml",
      "open.edu": "https://gist.github.com/nfreear/5253410/raw/ouice-wai-aria.yaml"

      // Facebook, YouTube, Yahoo, Baidu...!
      // "facebook.com": "https://example.org/my/facebook/fixes.yaml",
      // ...
      // (See, http://www.alexa.com/topsites)
    },
    host = document.location.host,
    script = "https://raw.github.com/nfreear/accessifyhtml5.js/master/accessifyhtml5.js",
    callback = "__accessifyhtml5_bookmarklet_CB",
    fixes_url = "https://views.scraperwiki.com/run/yaml_2_jsonp/?callback=" + callback  "&url=",
    x,
    re,
    run = false;


  function attachCallback() {
    // Callback is global. (window["callback"])
    window.__accessifyhtml5_bookmarklet_CB = function (fixes) {
      log("Callback. Fixes to apply: ", fixes);
 
      var res = AccessifyHTML5(false, fixes);

      log("OK. Applied: ", res);
    }
  }

  function addScript(src) {
    var s = document.createElement("script");
    s.src = src;
    s.type = "text/javascript";
    //s.setAttribute("async", "");
    document.body.appendChild(s);
  }

  function log(s) {
    if (typeof console === "object") {
      //console.log(arguments.length > 1 ? arguments : s);
      console.log("AccessifyHTML5", arguments);
    }
  }


  for (x in map) {
    re = new RegExp(x);
    if (re.exec(host)) {
      run = true;
      fixes_url += map[x];

      log("Host matched", host, fixes_url);

      attachCallback();
      addScript(script);
      addScript(fixes_url);
    }
  }

  if (!run) {
    log("No host matched", host);
  }
  
})();