/*
  SOURCE: http://accessify.wikia.com/wiki/MediaWiki:Common.js
  Test:   http://accessify.wikia.com/wiki/User:NickFreear/common.js
*/
/* Any JavaScript here will be loaded for all users on every page load. */



/*!
  Accessify-Wiki : MediaWiki Javascript.

  Initially we'll try setting a crude timeout, then try some accessibility fixes using JQuery.
  Eventually, we'll probably want to use the Accessify Wiki API/service!

  @link http://community.wikia.com/wiki/Help:JavaScript_and_CSS_Cheatsheet
  @link https://github.com/nfreear/accessify-wiki
  @copyright Nick Freear, 3 June, 2 November 2013.
*/

/*jslint indent: 2 */
/*global $, jQuery, setTimeout, console, alert, navigator */

var AcfyWiki = AcfyWiki || {};


$(function () {

  'use strict';

  /*
  log("wgUserName", wgUserName);

  if ("NickFreear" === wgUserName) {
    log("MediaWiki:Common.js - early return;");
    return;
  }
  */

  var G = AcfyWiki;

  G.tools_url = G.local ? "http://localhost:8081/"
      : "https://accessifywiki--1.appspot.com/";

  G.addScript = function (src) {
    var D = document,
      s = D.createElement("script");
    s.src = src.match("://") ? src : G.tools_url + src;
    s.charset = "utf-8";
    //s.type = "text/javascript";
    //s.setAttribute("async", "");

    D.body.appendChild(s);
  }


  G.addScript("site/setup/config.js");

}); //();

