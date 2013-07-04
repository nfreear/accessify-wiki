/* SOURCE: http://accessify.wikia.com/wiki/MediaWiki:Common.js */


/* Any JavaScript here will be loaded for all users on every page load. */


/*!
  Accessify-Wiki : MediaWiki Javascript.

  Initially we'll try setting a crude timeout, then try some accessibility fixes using JQuery.
  Eventually, we'll probably want to use the Accessify Wiki API/service!

  @link http://community.wikia.com/wiki/Help:JavaScript_and_CSS_Cheatsheet
  @link https://github.com/nfreear/accessify-wiki
  @copyright Nick Freear, 3 June 2013.
*/

/*jslint indent: 2 */
/*global $, jQuery, setTimeout, console */

(function () {

  'use strict';

  var tools_url = "https://accessifywiki--1.appspot.com/";


  setTimeout(function () {

    wikia_accessibility_fixes();
    setup_create_fix_widget();
    setup_accessify_editor();
    setup_bookmarklet_js();

    if (typeof console !== "undefined") {
      console.log("Accessify Wikia: Common.js - accessiblity fixes applied ?");
    }

  }, 4000); //milliseconds.


  // ---------------------------------------------------

  function wikia_accessibility_fixes() {

    $(".SPOTLIGHT_FOOTER a").attr("title", "Spotlight item - opens in a new window.");

    $("iframe").attr({
      role: "presentation",
      title: "Probably an advert (iframe)",
      "aria-label": "Probably an advert (iframe)"
    });

    $(".page-width-container > nav").attr({
      role: "navigation",
      "aria-label": "Wikia dot com main menu"
    });

    $("nav.WikiNav").attr({
      role: "navigation",
      "aria-label": "Accessify Wiki navigation menu"
    });

    $("footer").attr({
      role: "contentinfo"
    });

    $("#WikiaSearch input[name = search]").attr("title", "Search this wiki");
    $("#WikiaSearch button").attr("title", "Search");
  }


  function setup_create_fix_widget() {

    $("#mw-content-text .createboxInput").attr({
      "aria-labelledby": "createbox-label-1",
      "aria-label": "Start creating fixes for a site or part of a site. Site short name",
      title: "Site short name",
      required: true,
      maxlength: 16,
      id: "createboxInput-fix-1"
    });
  }


  function setup_accessify_editor() {
    var DL = document.location;

    if (DL.toString().match(/Fix(\:|%3A)/) && DL.search.match(/action=edit/)) {

      $("a.cke_button_ModeSource").trigger("click");

      $("body").addClass("acfy-fix-editor");

      $("#editform").before("<div class='acfy-fix-editor-msg'>"
        + "<span>Accessibility fixes editor:</span> "
        + "<a href='/wiki/Write_fixes'>Find out how to write fixes</a>."
        + "</div>");
    }
    else if (DL.toString().match(/Fix\:/)) {

      $("body").addClass("acfy-fix-viewer");

      $("#WikiaArticle").before("<div class='acfy-fix-editor-msg'>"
        + "<span>Accessibility fixes viewer:</span> "
        + "<a href='/wiki/Write_fixes'>Start writing fixes</a>."
        + "</div>");
    }
  }


  function setup_bookmarklet_js() {
    var js = "javascript:(function(){"
      + "var D=document,s=D.createElement('script');s.src='"
      + tools_url
      + "browser/js/accessifyhtml5-marklet.js"
      + "?x='+(Math.random());D.body.appendChild(s)"
      + "})();";


    $("a[href = '#_ACFY_BOOKMARKLET']").attr({
      title: "Accessify",
      href : js,
      class: "big inline js",
      id : "bookmark"
    })
    .click(function (e) {
      e.preventDefault();
    });


    $("a[href $= '.user.js']").attr({
      title: "User Javascript",
      class: "big inline js",
      id: "userjs"
    });
  }

})();

/*End. */
