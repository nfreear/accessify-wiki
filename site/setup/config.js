/**
 * Accessify Wiki site Javascript, v2.
 * Nick Freear, 16 October 2013.
 *
http://position-absolute.com/articles/simple-build-script-to-minify-and-concatenate-files-using-node-js
 */

var AcfyWiki = AcfyWiki || {};


(function () {

  'use strict';

  var
    G = AcfyWiki,
    DL = document.location;

  G.tools_url = G.tools_url
      || "https://accessifywiki--1.appspot.com/";
  G.iframe_re = "[^\\/]+.ac.uk|accessifywiki(--\\d)?.appspot.com"
      + "|docs.google.com|www.youtube.com|www.slideshare.net|upload.wikimedia.org";
  G.editor = true;  //Crashing Chrome? 30 July.

  // Utility functions.
  G.log = function (s) {
    if (typeof console !== "undefined") {
      console.log(arguments > 1 ? arguments : s);
    }
  };
  // Tests.
  G.is_fix_page = function () {
    return DL.href.match(/Fix(\:|%3A)/);
  };
  G.is_fix_editor = function () {
    return DL.href.match(/Fix(\:|%3A)/) && DL.search.match(/action=edit/);
  };


  var configs = {
    // Default environnment
    env : "dev",
    templates : {},
    app : {}
  },
  cfg, idx;

  configs.templates.dev = [
	"app/templates/dasboard.html",
	"app/templates/listing.html"
  ];
  configs.app.dev = [
	// Dependencies
	//"assets/js/jquery.js",

	// App files
	"site/js/wikia-fixes.js",
    "site/js/accessify-editor.js",
    //create_fix_widget, bookmarklet_js, iframes.
    "site/js/accessify-widgets.js",
    "site/js/accessify-social.js",
    "site/js/build-fix.js",
    "site/js/accessify-analytics.js"
  ];

  //configs.templates.prod = ["build/dist/templates.html"];
  configs.app.prod = ["site/build/app.min.js"];

  /*try {
    if (exports) exports.filesArray = filesArray;
  } catch (e) {

  }*/

  G.log(configs);

  cfg = configs.app[configs.env];
  //AcfyWiki.log(cfg);

  for (idx = 0; idx < cfg.length; idx++) {
    G.addScript(cfg[idx]);
  }

})();
