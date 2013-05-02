// ==UserScript==
// @name Accessify
// @namespace http://freear.org.uk/accessify
// @description Prototype for the Accessify-wiki user Javascript. Nick Freear.
// @match http://*/*
// @match https://*/*
// @grant none
// @version 0.5.0.20130502
// @downloadURL https://raw.github.com/nfreear/accessify-wiki/master/browser/userjs/accessify.user.js
// @updateURL https://raw.github.com/nfreear/accessify-wiki/master/browser/userjs/accessify.meta.js
// @require https://raw.github.com/nfreear/accessify-wiki/master/browser/js/accessifyhtml5-marklet.js
// ==/UserScript==

if (typeof console !== "undefined") {
  console.log("accessify.user.js");

  /*if (typeof GM_info !== "undefined") {
    console.log(GM_info.script.name);
  }*/
}


/*
 DONE: Setup redirect http://freear.org.uk/accessify >> https://views.scraperwiki.com/run/accessify-wiki
 TODO: replace @require -- Not cross-browser.
 TODO: bookmarklet JS -- Only on parent windows.
 TODO: @icon
 TODO: @include -- Cross-browser, replace @match ??
 
 Please unblock userscript installation!  https://groups.google.com/a/chromium.org/forum/?fromgroups=#!topic/chromium-discuss/oVc6JP-uI00
 http://userscripts.org/topics/113176
*/
