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
/*global $, jQuery, setTimeout, console, alert, navigator */

$(function () {

  'use strict';

  var tools_url = "https://accessifywiki--1.appspot.com/";

  //setTimeout(function () {

    wikia_accessibility_fixes();
    setup_create_fix_widget();
    setup_accessify_editor();
    setup_bookmarklet_js();
    setup_iframes();

    setup_build_fix_js();

    log("Accessify Wikia: Common.js - accessiblity fixes applied ?");

  //}, 3000); //milliseconds.


  // ---------------------------------------------------

  function wikia_accessibility_fixes() {

    $("#WikiaFooter").attr({  //".SPOTLIGHT_FOOTER"
      role: "complementary",
      "aria-label": "Around Wikia's network" //"Spotlight on different wikis"
    });

    setTimeout(function () {
      $(".SPOTLIGHT_FOOTER a").attr("title", "Spotlight on a different Wiki"); //- opens in a new window.");
    }, 6000);


    $(".wikia-ad, iframe").attr({
      role: "complementary",  //"presentation",
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

    $("footer.CorporateFooter").attr({
      role: "contentinfo",
      "aria-label": "Corporate footer"
    });


    $("#WikiaRecentActivity").attr({
      role: "complementary",
      "aria-label": "Accessify Wiki recent activity"
    });

    $("#LatestPhotosModule").attr({
      role: "complementary",
      "aria-label": "Latest photos"
    });

    $("#WikiaArticle, #EditPageMain").attr("role", "main");

    $("#WikiaArticle #toc").attr({
      role: "navigation",
      //"aria-labelledby": "toctitle"
      "aria-label": "Page contents"
    });

    $("#WikiaSearch").attr("role", "search");
    $("#WikiaSearch input[name = search]").attr("title", "Search this wiki");
    $("#WikiaSearch button").attr("title", "Search");


    $(".wikia-bar").attr({
      role: "toolbar",
      "aria-label": "Wikia toolbar"
    });
    $(".wikia-bar a[href = '#']").attr("role", "button");
    $(".wikia-bar > a.arrow").attr("aria-label", "Collapse/ expand toolbar");
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
    var DL = document.location,
      pg = DL.pathname.replace("/wiki/", ""),
      build = "/wiki/Build_fix_js?q=" + pg,
      write = "/wiki/Write_fixes";

    if (DL.href.match(/Fix(\:|%3A)/) && DL.search.match(/action=edit/)) {

      setTimeout(function () {
        $("a.cke_button_ModeSource").trigger("click");
      }, 2000);
      //$("body").removeClass("rte");

      $("body").addClass("acfy-fix-editor");

      $("#editform").before("<div class='acfy-fix-editor-msg'>"
        + "<span>Accessibility fixes editor:</span> "
        + "<a href='" + write + "'>Find out how to write fixes</a> | "
        + "<a href='" + build + "'>Site owners</a>."
        + "</div>");
    }
    else if (DL.toString().match(/Fix\:/)) {

      $("body").addClass("acfy-fix-viewer");

      $("#WikiaArticle").before("<div class='acfy-fix-editor-msg'>"
        + "<span>Accessibility fixes viewer:</span> "
        + "<a href='" + write + "'>Start writing fixes</a> | "
        + "<a href='" + build + "'>Site owners</a>."
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
      role : "button",
      "aria-label": "Accessify bookmarklet",
      title: "Accessify",
      href : js,
      id : "bookmark"
    })
    .click(function (e) {
      e.preventDefault();

      var ua = navigator.userAgent,
        msg = "'Bookmark This Link' in your 'Bookmarks Toolbar'. (Firefox)";
      if (ua.match(/WebKit/)) {
        msg = "'Copy link address' or drag me to your 'Bookmarks bar'. (Chrome/Safari)";
      }
      else if (ua.match(/MSIE/)) {
        msg = "'Add to Favorites...', then 'Create in' the 'Favorites bar'. (Internet Explorer)";
      }
      alert("Bookmarklet. To add me to your browser:\n\nRight-click and " + msg);
    });


    $("a[href $= '.user.js']").attr({
      role : "button",
      title: "User Javascript",
      id: "userjs"
    });
  }


  function setup_iframes() {
    $("a[href *= 'EMBED_ME']").each(function (i, el) {
      var url = $(el).attr("href"),
        mw = url.match(/width=(\d+)/),
        mh = url.match(/height=(\d+)/),
        width  = mw ? mw[1] : "98%",
        height = mh ? mh[1] : 250;

      if (! url.match(
        /^https?:\/\/([^\\]+\.ac\.uk|accessifywiki(--\d)?\.appspot\.com)\//)) {
        return;
      }

      $(el).replaceWith("<iframe class='acfy-ifr' width='"
        + width + "' height='" + height + "' src='" + url + "'></iframe>");
    });
  }


  function setup_build_fix_js() {
    var DL = document.location,
      re = /([?&]q=)(Fix[^&]+)/,
      q = DL.search.match(re),
      p = $('.page-Build_fix_js');

    log("?q=", q, p);

    if (p.length > 0) {
      if (q) {
        $('.source-javascript .co1').each(function (idx, el) {
          var txt = $(el).text(),
            m = txt.match(re);

          log(el, m);

          if (m && m[1]) {
            $(el).text(txt.replace(re, m[1] + q[2]));
            //break;
          }
        });
      }

      var js = $('.source-javascript:first'),
        btn = js.before('<button id="acfy-copy">Copy</button>');
      $('#acfy-copy').click(function (e) {
        log(js.text());
        window.prompt("Copy to clipboard: Ctrl+C, Enter", js.text());
      });
    }

    $(".page-Build_fix_js #mw-content-text ol:nth-of-type(2)").attr("start", 2);
    $(".page-Build_fix_js #mw-content-text ol:nth-of-type(3)").attr("start", 3);
  }


  function log(s) {
    if (typeof console !== "undefined") {
      console.log(arguments > 1 ? arguments : s);
    }
  }

});

/*End. */
