/*!
 Bookmarklet to apply AccessifyHTML5.js (WAI-ARIA fixes) to various web sites.

 Copyright Nick Freear, 28 March 2013.

 https://github.com/nfreear/accessify-wiki
*/

/*global clearTimeout, AccessifyHTML5, log */
/*jslint browser:true, devel:true, indent:2 */

(function () {

  "use strict";

  var
    D = document,
    DL = D.location,
    script = "//accessifywiki--1.appspot.com/browser/js/accessifyhtml5.js",
    callback = "__accessifyhtml5_bookmarklet_CB",
    fixes_url = "//accessifywiki--1.appspot.com/fix?min=1&callback=",
    home_url = "http://accessify.wikia.com",
    home = home_url.replace(/https?:\/\//, ''),
    query_timeout = 15 * 1000, // Milli-seconds
    store_max_age = 15 * 60, // Seconds
    store_type = 'sessionStorage', //Or 'local'
    store_prefix = 'acfy.',
    s_fixes,
    th,
    b_exit = browserFeatures(),
    logi,
    logp;


  if (b_exit) {
    log(b_exit + ". Exiting");
    return;
  }

  // ======================================================

  logInit();

  attachCallback();

  s_fixes = getStorage();
  if (s_fixes) {

    log("Getting cached fixes.");

    addScript(script, function () {
      __accessifyhtml5_bookmarklet_CB(s_fixes);
    });

  } else {
    fixes_url += callback + "&url=" + encodeURIComponent(DL.href);

    log("Querying for fixes..", DL.host, fixes_url);

    th = setTimeout(function () {
      log("Unknown problem/ too slow/ fixes not allowed (security)");
      setIcon("unknown");
    }, query_timeout);

    addScript(script);
    addScript(fixes_url);
  }


  // ======================================================

  function attachCallback() {
    // Callback is global. (window["callback"])
    window.__accessifyhtml5_bookmarklet_CB = function (rsp) {
      var res,
        fixes = rsp;

      clearTimeout(th);

      if (typeof rsp.stat !== "undefined" && rsp.stat === "fail") {
        log(rsp.message, rsp.code);
        setIcon("fail");

        if (404 !== parseInt(rsp.code)) {
          return;
        }

        setIcon("not_found");
        //log("Sorry, no domain matched.\n", host);
        log("To add some fixes please visit our site   \n\n  ›› " + home + "\n");

      } else {

        log("Fixes found.", fixes);

        res = AccessifyHTML5(false, fixes);

        if (res.fail.length > 0) {
          setIcon("fail");
        } else {
          setIcon("ok");
        }

        log("OK. " + res.ok.length + " fixes applied, " + res.fail.length + " errors. \n", res);
        log("To help improve the fixes please visit   \n\n  ›› " + home + "\n");
      }

      if (!s_fixes) {
        setStorage(rsp);  // Fixes or 404 Not Found response.
      }
    };
  }

  // http://stackoverflow.com/questions/4845762/onload-handler-for-script-tag-in-IE
  function addScript(src, onload) {
    var s = D.createElement("script");
    s.src = src;
    s.type = "text/javascript";
    s.charset = "utf-8";
    //s.setAttribute("async", "");
    if (onload) {
      //for nonIE browsers.
      s.onload = onload;

      //for IE browsers.
      ieLoadBugFix(s, onload);
    }
    D.body.appendChild(s);
    //D.getElementsByTagName("body")[0].appendChild(s);
  }

  function ieLoadBugFix(scriptEl, callback) {
    var ua = navigator.userAgent;
    if (!ua.match(/MSIE [78].0/)) return;

    if (scriptEl.readyState === 'loaded' || scriptEl.readyState === 'completed') {
      callback();
    } else {
      setTimeout(function () {
        ieLoadBugFix(scriptEl, callback);
      }, 100);
    }
  }

  function log(s) {
    var ua = navigator.userAgent;

    if (logp && !s.match(/Storage/)) {
      // Maybe we use a multi-line title attribute ?!
      // Was: logp.innerHTML += "&bull; " + s + "<br>\n"; //&rsaquo; //\203A
      logp.title += "  › " + s + " \n";
      logi.innerText += "› " + s + "\n";
    }

    if (typeof console === "object") {
      //console.log(arguments.length > 1 ? arguments : s);
      if (ua.match(/MSIE/)) {
        console.log(s);
      } else {
        console.log("AccessifyHTML5", arguments);
      }
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
"display:block;position:fixed;bottom:0;right:0;width:15.5em;height:1.5em;z-index:999;"
+ "font:medium Arial,sans-serif;text-align:left;border-radius:2px;background:#fafafa;"
+ "color:#111;opacity:.9;border:3px solid gray;padding:6px;overflow-y:auto;cursor:help;");
      D.body.appendChild(logp);
      logp.innerHTML +=
    '<a href="' + home_url + '" style="color:navy;text-decoration:underline;">'
        + 'Accessify Wiki</a> .. <span class="ico">*</span>'
        + '<pre style="position:absolute;top:-9999px"></pre>';
      logi = logp.querySelector("pre");
    }
    setIcon("loading");
  }


  function setIcon(key) {
    //http://commons.wikimedia.org/wiki/Category:Silk_icons
    //http://commons.wikimedia.org/wiki/File:Throbber_allbackgrounds_monochrome.gif
    var res_url = "https://upload.wikimedia.org/wikipedia/commons/",
      icons = {
        loading: "7/7f/Throbber_allbackgrounds_monochrome.gif",
        not_found: "8/89/Error_add.png", //"7/72/Pencil_add.png"
        unknown: "4/43/Question-icon-darker.png",
        fail: "c/c0/Exclamation.png", //"e/e9/Silk_cross.png"
        ok: "3/3f/Silk_tick.png"
      },
      //http://quackit.com/css/css_color_codes.cfm
      bdr = {
        loading: "#eed700", //"gold"
        not_found: "#ee8c00", //"darkorange"
        unknown: "#d22",
        fail: "#d22",
        ok: "#181"
      },
      texts = {
        loading: "Loading",
        not_found: "Not found",
        unknown: "Unknown error",
        fail: "Error woops",
        ok: "Success"
      },
      icon_url = res_url + icons[key],
      el = document.querySelector("#AC5-log .ico"),
      cs = el.style;

    cs.background = "transparent url(" + icon_url + ") no-repeat right";
    cs.display = "inline-block";
    cs.paddingRight = "24px";
    cs.minWidth = "4em";

    el.innerHTML = texts[key];
    logp.style.borderColor = bdr[key];
  }


  // ======================================================

  function browserFeatures() {
    var W = window,
      b_exit = false;

    if (W.parent !== W && W.top !== W.self) {  // MSIE 8 needs the "top" test.
      b_exit = "We do not support frames at present";
    }
    else if (!DL.protocol.match(/^https?:/)) {
      b_exit = "We only support HTTP/S urls";
    }
    else if (DL.href.match(/(run\/accessify-|accessify\.wikia\.com|\/localhost)/)) {
    //(/(run\/accessify-|accessify.wikia.com|accessifyw[^\.]+.appspot.com|\/localhost)/)
      b_exit = "Not fixing Accessify Wiki or localhost";
    }

    // Feature detection.
    else if (typeof D.querySelector === "undefined") { //http://w3.org/TR/selectors-api2
      b_exit = "Not supported by browser, w3c:selectors-api2";
    }
    else if (!W['sessionStorage']) {
      b_exit = "Not supported by browser, w3c:webstorage"; //http://w3.org/TR/webstorage
    }
    else if (typeof JSON !== "object" || typeof JSON.parse !== "function") {
      //https://github.com/phiggins42/has.js | http://es5.github.io/#x15.12
      b_exit = "Not supported by browser: JSON.parse";
    }
    else if (isPlainText()) {
      b_exit = "Ignoring plain-text file";
    }

    return b_exit;
  }

  function isPlainText() {
    // Chrome plain-text test.
    // ajax.get( self ) - stackoverflow?
    //https://github.com/rsdoiel/mimetype-js
    var
      ch = D.querySelectorAll("body > *"),
      pre = D.querySelectorAll("body pre[style]");

    return ch.length === 1 && pre.length === 1;
  }


  // ======================================================

  // Storage: http://html5demos.com/storage | http://diveintohtml5.info/storage.html
  function getStorage() {
    var
      dt = new Date(),
      value,
      storage = window[store_type],
      delta = 0;

    if (!store_type || !window[store_type]) return;

    value = storage.getItem(store_prefix + 'fixes');

    if (value) {
      delta = (dt.getTime() - dt.setTime(storage.getItem(store_prefix + 'timestamp'))) / 1000;
      if (store_max_age && store_max_age > 0 && delta > store_max_age) {
        log(store_type + ': stale, delta: ' + delta, store_max_age);
        value = false;
      } else {
        log(store_type + ': read fixes, last update: ' + delta + 's ago', value);
      }
    } else {
      log(store_type + ': empty');
    }

    return value ? JSON.parse(value) : false;
  }


  function setStorage(data) {
    var
      dt = new Date(),
      storage = window[store_type];

    if (!store_type || !window[store_type]) return;

    storage.setItem(store_prefix + 'fixes', JSON.stringify(data));
    storage.setItem(store_prefix + 'timestamp', dt.getTime());
    storage.setItem(store_prefix + 'time', dt.toString());

    log(store_type + ': save fixes', data);
  }

})();
