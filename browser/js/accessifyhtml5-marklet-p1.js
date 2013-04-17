/*!
 Bookmarklet to apply AccessifyHTML5.js (WAI-ARIA fixes) to various web sites.

 Copyright Nick Freear, 28 March 2013.

 Self: https://dl.dropbox.com/u/3203144/wai-aria/accessifyhtml5-marklet.js
 Gist: https://gist.github.com/nfreear/5263216#file-accessifyhtml5-marklet-js


 Bookmarklet:

javascript:(function(){var D=document,s=D.createElement('script');s.type='text/javascript';s.src='https://dl.dropbox.com/u/3203144/wai-aria/accessifyhtml5-marklet.js?x='+(Math.random());D.body.appendChild(s)})();

..;document.ac5_srvurl='http://example.org'
*/

(function () {

  "use strict";

  // Domains to be fixed and fixes would be provided by a web-service.
  var url = {
      ouice:  "https://gist.github.com/nfreear/5253410/raw/ouice-wai-aria.yaml",
      google: "http://dl.dropbox.com/u/3203144/wai-aria/google-search-wai-aria.yaml",
      baidu:  "http://dl.dropbox.com/u/3203144/wai-aria/baidu-search-wai-aria.yaml",

      example: "http://example.org/my/fixes.yaml"
    },
    map = { // Converted to glob syntax.
      "http://*.open.ac.uk/*": url.ouice,
      "https://*.open.ac.uk/*": url.ouice,
      "http://*.open.edu/*":   url.ouice,
      "http://*.google.de/*":  url.google,
      "https://*.google.de/*":  url.google,
      "http://*.google.co.uk/*": url.google,
      "https://*.google.co.uk/*":  url.google,
      "http://*.google.com/*": url.google,
      "https://*.google.com/*": url.google,
      ".google.com": url.google,
      "http://*.baidu.com/*": url.baidu,
      "http://baidu.com/*": url.baidu,

      // Facebook, YouTube, Yahoo, Baidu...!
      // (See, http://www.alexa.com/topsites)
      ".example.": url.example
    },
    D = document,
    href = D.location.href,
    host = D.location.host,
    script = "https://raw.github.com/nfreear/accessifyhtml5.js/master/accessifyhtml5.js",
    callback = "__accessifyhtml5_bookmarklet_CB",
    fixes_url = "https://views.scraperwiki.com/run/yaml_2_jsonp/?callback=" + callback + "&url=",
    pat, re, logp,
    go = false;


  logInit();

  for (pat in map) {
    //Was: re = new RegExp(pat.replace(/\./g, '\\.'));
    re = globToRegex(pat);
    if (re.exec(href)) { //Was: re.exec(host)
      go = true;
      fixes_url += encodeURIComponent(map[pat]);

      log("Domain matched: " + pat, host, re, fixes_url);

      attachCallback();
      addScript(script);
      addScript(fixes_url);
    }
  }


  if (!go) {
    log("Sorry, no domain matched.\n", host);
    log("› To add some fixes please visit our site. *");
  }


  // ======================================================

  function attachCallback() {
    // Callback is global. (window["callback"])
    window.__accessifyhtml5_bookmarklet_CB = function (fixes) {
      log("Fixes found.", fixes);
 
      var res = AccessifyHTML5(false, fixes);

      log("OK. "+ res.ok.length +" fixes applied, "+ res.fail.length +" errors. \n", res);
      log("› To help improve the fixes please visit   \n  ››› www.Example.org ");
    }
  }

  function addScript(src) {
    var s = D.createElement("script");
    s.src = src;
    s.type = "text/javascript";
    s.charset = "utf-8";
    //s.setAttribute("async", "");
    //D.body.appendChild(s);
    D.getElementsByTagName('body')[0].appendChild(s);
  }


  function log(s) {
    // Maybe we use a multi-line title attribute ?!
    // Was: logp.innerHTML += "&bull; " + s + "<br>\n"; //&rsaquo; //\203A
    logp.title += "  › "+ s +" \n";

    if (typeof console === "object") {
      //console.log(arguments.length > 1 ? arguments : s);
      console.log("AccessifyHTML5", arguments);
    }
  }


  function logInit() {
    if (!logp) {
      logp = D.createElement('div');
      logp.id = "AC5-log";
      logp.title = "\n Accessify HTML5 log: \n\n";
      logp.setAttribute("aria-live", "polite");
      logp.setAttribute("role", "log");
      logp.setAttribute("style",
"display:block;position:fixed;bottom:0;right:0;width:15em;height:1.5em;"
+"font:medium sans-serif;text-align:left;background:#fcfcfc "
+"url(https://upload.wikimedia.org/wikipedia/commons/7/7f/Throbber_allbackgrounds_monochrome.gif) no-repeat right;"
+"color:#111;opacity:.8;border:3px solid #181;padding:6px;overflow-y:auto;cursor:help;");
      //http://commons.wikimedia.org/wiki/File:Throbber_allbackgrounds_monochrome.gif
      D.body.appendChild(logp);
      logp.innerHTML += 
      '<a href="http://www.example.org" style="color:navy;text-decoration:underline;">Accessify HTML5</a> ...Loading... <br>\n';
    }
  }


  // http://stackoverflow.com/questions/5575609/javascript-regexp-to-match-strings-using-wildcards-and
  function globToRegex (glob) {
    var specialChars = "\\^$*+?.()|{}[]";
    var regexChars = ["^"];
    for (var i = 0; i < glob.length; ++i) {
        var c = glob.charAt(i);
        switch (c) {
            case '?':
                regexChars.push(".");
                break;
            case '*':
                regexChars.push(".*");
                break;
            default:
                if (specialChars.indexOf(c) >= 0) {
                    regexChars.push("\\");
                }
                regexChars.push(c);
        }
    }
    regexChars.push("$");
    return new RegExp(regexChars.join(""), 'i');
  }

})();
