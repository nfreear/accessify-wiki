
var AcfyWiki = AcfyWiki || {};

(function () {

  'use strict';

  setup_create_fix_widget();
  setup_bookmarklet_js();
  setup_iframes();


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


  function setup_bookmarklet_js() {
    var js = "javascript:(function(){"
      + "var D=document,s=D.createElement('script');s.src='"
      + AcfyWiki.tools_url
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
    if (! AcfyWiki.iframe_re) return;

    $("a[href *= 'EMBED_ME']").each(function (i, el) {
      var url = $(el).attr("href"),
        at = "allowfullscreen mozallowfullscreen webkitallowfullscreen",
        mw = url.match(/width=(\d+)/),
        mh = url.match(/height=(\d+)/),
        width  = mw ? mw[1] : "98%",
        height = mh ? mh[1] : 250;

      if (! url.match(new RegExp("^https?:\\/\\/(" + AcfyWiki.iframe_re + ")\\/"))) {
        return;
      }

      $(el).replaceWith("<iframe class='acfy-ifr' width='"
        + width + "' height='" + height + "' src='" + url + "' " 
        + at +"></iframe>");
    });
  }

})();
