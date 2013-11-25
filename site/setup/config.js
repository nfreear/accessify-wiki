/**
 * Accessify Wiki site Javascript, v2.
 * Nick Freear, 16 October 2013.
 *
http://position-absolute.com/articles/simple-build-script-to-minify-and-concatenate-files-using-node-js
 */

var AcfyWiki = AcfyWiki || {};


(function () {

  'use strict';

  AcfyWiki.tools_url = AcfyWiki.tools_url
      || "https://accessifywiki--1.appspot.com/";
  AcfyWiki.iframe_re = "[^\\/]+.ac.uk|accessifywiki(--\\d)?.appspot.com"
      + "|docs.google.com|www.youtube.com|www.slideshare.net|upload.wikimedia.org";
  AcfyWiki.editor = true;  //Crashing Chrome? 30 July.

  AcfyWiki.log = function (s) {
    if (typeof console !== "undefined") {
      console.log(arguments > 1 ? arguments : s);
    }
  };

  var configs = {
    // Default environnment
    env : "dev",
    templates : {},
    app : {}
  },
  cfg, idx, script;

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

  AcfyWiki.log(configs);

  cfg = configs.app[configs.env];
  //AcfyWiki.log(cfg);

  for (idx = 0; idx < cfg.length; idx++) {
    AcfyWiki.addScript(cfg[idx]);
  }

})();