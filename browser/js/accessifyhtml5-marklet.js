/*!
 Bookmarklet to apply AccessifyHTML5.js (WAI-ARIA fixes) to various web sites.

 Copyright Nick Freear, 28 March 2013.

 https://github.com/nfreear/accessify-wiki
*/

(function () {

  "use strict";

  var
    D = document,
    href = D.location.href,
    host = D.location.host,
    script = "https://raw.github.com/nfreear/accessifyhtml5.js/master/accessifyhtml5.js",
    callback = "__accessifyhtml5_bookmarklet_CB",
    fixes_url = "https://views.scraperwiki.com/run/accessify_utils_v1/?callback=",
    logp;

  logInit();

  fixes_url += callback + "&url=" + encodeURIComponent(href);

  log("Querying for fixes..", host, fixes_url);

  attachCallback();
  addScript(script);
  addScript(fixes_url);


  // ======================================================

  function attachCallback() {
    // Callback is global. (window["callback"])
    window.__accessifyhtml5_bookmarklet_CB = function (rsp) {

      if (typeof rsp.stat !== "undefined" && rsp.stat == "fail") {
        log(rsp.message, rsp.code);
        setIcon("fail");
        if (404 == rsp.code) {
          setIcon("not_found");
          //log("Sorry, no domain matched.\n", host);
          log("› To add some fixes please visit our site. *");

        }
        return false;
      }

      var fixes = rsp;

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
"display:block;position:fixed;bottom:0;right:0;width:15.5em;height:1.5em;"
+"font:medium sans-serif;text-align:left;background:#fcfcfc;"
+"color:#111;opacity:.9;border:3px solid gray;padding:6px;overflow-y:auto;cursor:help;");
      D.body.appendChild(logp);
      logp.innerHTML += 
    '<a href="http://www.example.org" style="color:navy;text-decoration:underline;">Accessify HTML5</a> .. <span class="ico">*</span> <br>\n';
    }
    setIcon("loading");
  }


  function setIcon(key) {
    //http://commons.wikimedia.org/wiki/Category:Silk_icons
    //http://commons.wikimedia.org/wiki/File:Throbber_allbackgrounds_monochrome.gif
    var res_url = "https://upload.wikimedia.org/wikipedia/commons/",
      icons = {
        loading: "7/7f/Throbber_allbackgrounds_monochrome.gif",
        not_found: "e/e9/Silk_cross.png",
        fail: "e/e9/Silk_cross.png",
        ok: "3/3f/Silk_tick.png"
      },
      bgs = {
        loading: "orange",
        not_found: "#d22",
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
      el = document.querySelector("#AC5-log .ico"),
      cs = el.style;

    cs.background = "transparent url("+ icon_url +") no-repeat right";
    cs.display = "inline-block";
    cs.paddingRight = "24px";
    cs.minWidth = "4em";

    el.innerHTML = texts[key];
    logp.style.borderColor = bgs[key];
  }

})();
