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
    style = "//accessifywiki--1.appspot.com/browser/pix/marklet.css",
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

  function addStyle() {
    var s = D.createElement("link");
    s.href = style;
    s.rel = "stylesheet";
    D.body.appendChild(s);
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
      addStyle();

      logp = D.createElement('div');
      logp.id = "AC5-log";
      logp.title = "\n Accessify HTML5 log: \n\n";
      logp.setAttribute("aria-live", "polite");
      logp.setAttribute("role", "log");
      logp.innerHTML +=
        '<a href="' + home_url + '">Accessify Wiki</a> .. '
        + '<span class="ico">*</span> <pre></pre>';
      D.body.appendChild(logp);

      logi = logp.querySelector("pre");
    }
    setIcon("loading");
  }


  function setIcon(key) {
    var
      texts = {
        loading: "Loading",
        not_found: "Not found",
        unknown: "Unknown error",
        fail: "Error woops",
        ok: "Success"
      },
      el = document.querySelector("#AC5-log .ico");

    el.innerHTML = texts[key];
    logp.className = key;
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
    else if (isPluginFile()) {
      b_exit = "Ignoring PDF or multimedia file";
    }

    return b_exit;
  }

  function isPlainText() {
    // Chrome plain-text test (inc. Javascript/ CSS file views)
    // ajax.get( self ) - stackoverflow?
    //https://github.com/rsdoiel/mimetype-js
    var
      ch = D.querySelectorAll("body > *"),
      pre = D.querySelectorAll("body > pre[style]");

    return ch.length < 4 && pre.length === 1;
  }

  /*
   OU pod: feeds/Alan-Turing/turing01.mp3 | http://podcast.open.ac.uk/pod/Alan-Turing
   OU pod: feeds/2284_60secondadventuresinastronomy/22898_1__the_big_bang.m4v
   OU pod: feeds/2284_60secondadventuresinastronomy/transcript/22898_1__the_big_bang.pdf
  */
  function isPluginFile() {
    var
      ch = D.querySelectorAll("body > *"),
      plugin = D.querySelectorAll(
        "body > embed[height='100%'], body > video[name='media']");

    return ch.length < 4 && plugin.length === 1;
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
