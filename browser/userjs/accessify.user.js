// ==UserScript==
// @name Accessify
// @namespace http://freear.org.uk/accessify
// @description Prototype for the Accessify-wiki user Javascript; Nick Freear.
// @match http://*/*
// @match https://*/*
// @grant none
// @version 0.5.0.20130722
// @copyright Nick Freear.
// @downloadURL https://accessifywiki--1.appspot.com/browser/userjs/accessify.user.js
// @updateURL https://accessifywiki--1.appspot.com/browser/userjs/accessify.meta.js
// ==/UserScript==

/*global GM_info, log */
/*jslint browser:true, devel:true, todo:true, indent:2 */

(function () {

  "use strict";

  var src = "//accessifywiki--1.appspot.com/browser/js/accessifyhtml5-marklet.js",
  //raw.github.com/nfreear/accessify-wiki/webapp2/browser/js/accessifyhtml5-marklet.js,
    nocache = false;

  // Do not support frames for the moment.
  if (window.parent !== window) {
    return;
  }

  if (typeof GM_info !== "undefined") {
    log(GM_info.script.name);
  }


  //if (typeof GM_info === "undefined") {
    // Not Greasemonkey - assume @require not used.
    log("No @require - accessify.user.js");

    var s = document.createElement("script");
    s.src = src + (nocache ? "?r=" + Math.random() : "");
    s.type = "text/javascript";
    s.charset = "utf-8";
    document.body.appendChild(s);
  //}


  function log() {if (typeof console === "object") {console.log(arguments); } }

})();



/*
 DONE: Setup redirect http://freear.org.uk/accessify >> https://views.scraperwiki.com/run/accessify-wiki
 ??: replace/supplement @require -- not cross-browser.
 TODO: bookmarklet JS -- use `window.__callback` - NO!
 TODO: bookmarklet JS -- only on parent windows.
 TODO: @icon
 TODO: @include -- Cross-browser, replace @match ??

 @require https://raw.github.com/nfreear/accessify-wiki/master/browser/js/accessifyhtml5-marklet.js
 @require https://dl.dropbox.com/u/3203144/wai-aria/accessifyhtml5-marklet.js

 Please unblock userscript installation!  https://groups.google.com/a/chromium.org/forum/?fromgroups=#!topic/chromium-discuss/oVc6JP-uI00
 http://userscripts.org/topics/113176
*/
