/*!
 AUTHOR/DEVELOPER Bookmarklet to apply AccessifyHTML5.js (WAI-ARIA fixes) to various web sites.

 Copyright Nick Freear, 28 March-22 April 2013.

 Self: https://dl.dropbox.com/u/3203144/wai-aria/accessifyhtml5-marklet-p1.js
 Code: https://github.com/nfreear/accessify-wiki
*/

(function () {

  "use strict";

  // Domains to be fixed and fixes would be provided by a web-service.
  var url = {
      ouice:  "https://gist.github.com/nfreear/5253410/raw/ouice-wai-aria.yaml",
      google:"http://dl.dropbox.com/u/3203144/wai-aria/fix/google-search-wai-aria.yaml",
      baidu:  "http://dl.dropbox.com/u/3203144/wai-aria/fix/baidu-search-wai-aria.yaml",

      example: "http://example.org/my/fixes.yaml"
    },
    map = { // Converted to glob syntax.
      "http://*.open.ac.uk/*": url.ouice,
      "http://*.google.co.uk/*": url.google,
      "https://*.google.co.uk/*":  url.google,
      "http://*.google.com/*": url.google,

      // Facebook, YouTube, Yahoo, Baidu...!
      // (See, http://www.alexa.com/topsites)
      ".example.": url.example
    },
    D = document,
    href = D.location.href,
    host = D.location.host,
    script = "https://raw.github.com/nfreear/accessifyhtml5.js/master/accessifyhtml5.js",
    script_0 = "https://dl.dropboxusercontent.com/u/3203144/wai-aria/accessifyhtml5.js",
    callback = "__accessifyhtml5_bookmarklet_CB",
    fixes_url = "https://views.scraperwiki.com/run/yaml_2_jsonp/?callback=" + callback + "&url=",
    pat, re, logp,
    go = false;


  logInit();


  log("OK, found development URL & glob", D.AC5_dev_url, D.AC5_dev_glob);

  url.dev = D.AC5_dev_url;
  map[ D.AC5_dev_glob ] = url.dev;

  //log("URL map", map);

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

    setIcon("not_found");
  }


  // ======================================================

  function attachCallback() {
    // Callback is global. (window["callback"])
    window.__accessifyhtml5_bookmarklet_CB = function (fixes) {
      log("Fixes found.", fixes);

      var res = AccessifyHTML5(false, fixes);

      if (res.fail.length > 0) {
        setIcon("fail");
      } else {
        setIcon("ok");
      }

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
"display:block;position:fixed;bottom:0;right:0;width:15.5em;height:1.8em;"
+"font:medium sans-serif;text-align:left;background:#fcfcfc;color:#111;"
+"opacity:.9;border:3px solid gray;padding:6px;overflow-y:auto;cursor:help;");
      //15em x 1.5em
      D.body.appendChild(logp);
      logp.innerHTML += 
      '<a href="http://www.example.org" style="color:navy;text-decoration:underline;">Dev Accessify</a> ... <span class="ico">*</span> <br>\n';
    }
    setIcon('loading');
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


  function setIcon(key) {
    //http://commons.wikimedia.org/wiki/Category:Silk_icons
    //http://commons.wikimedia.org/wiki/Smiley
    //http://commons.wikimedia.org/wiki/File:Throbber_allbackgrounds_monochrome.gif
    var res_url = "https://upload.wikimedia.org/wikipedia/commons/",
      icons = {
        loading: "7/7f/Throbber_allbackgrounds_monochrome.gif",
        not_found: "8/89/Error_add.png", //"7/72/Pencil_add.png"
        fail: "c/c0/Exclamation.png", //"e/e9/Silk_cross.png"
        ok: "3/3f/Silk_tick.png"
      },
      /*tb = "thumb/",
      smileys = {
        loading: "7/7f/Throbber_allbackgrounds_monochrome.gif",
        not_found: tb + "9/91/Smiley_green_alien_sad.svg/28px-Smiley_green_alien_sad.svg.png",
        fail: tb + "8/84/Smiley_green_alien_hot_fever.svg/28px-Smiley_green_alien_hot_fever.svg.png",
        ok: tb + "3/39/Smiley_green_alien.svg/28px-Smiley_green_alien.svg.png"
      },*/
      //http://quackit.com/css/css_color_codes.cfm
      bdr = {
        loading: "#eed700", //"gold"
        not_found: "#ee8c00", //"darkorange"
        fail: "#d22",
        ok: "#181"
      },
      texts = {
        loading: "Loading",
        not_found: "Not found",
        fail: "Error woops",
        ok: "Success"
      },
      icon_url = res_url + icons[key],
      //icon_url = res_url + smileys[key],
      el = document.querySelector("#AC5-log .ico"),
      elcs = el.style;

    elcs.background = "transparent url("+ icon_url +") no-repeat right";
    elcs.display = "inline-block";
    elcs.paddingRight = "24px";
    elcs.minWidth = "4em";
    //elcs.height = "35px";

    el.innerHTML = texts[key];
    logp.style.borderColor = bdr[key];
  }

})();
