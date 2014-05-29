/**
 * Accessify Wiki site Javascript, v2.
 * Nick Freear, 16 October 2013.

http://accessify.wikia.com/wiki/MediaWiki:Common.js
http://position-absolute.com/articles/simple-build-script-to-minify-and-concatenate-files-using-node-js
 */

var AcfyWiki = AcfyWiki || {};


(function () {

  'use strict';

  var
    G = AcfyWiki,
    DL = document.location;

  G.tools_url = G.tools_url
      || "https://accessifywiki.appspot.com/";  //WAS: '--1'
  G.iframe_re = "[^\\/]+.ac.uk|accessifywiki(--\\d)?.appspot.com"
      + "|[a-z]{2,3}\\d\\.googleusercontent\\.com"
      + "|docs.google.com|www.youtube.com|www.slideshare.net|upload.wikimedia.org";
  G.editor = true;  //Crashing Chrome? 30 July.

  // Utility functions.
  G.log = function (s) {
    window.console && console.log(arguments.length > 1 ? arguments : s);
  };

  // Tests.
  G.is_fix_page = function () {
    return DL.href.match(/(title=|\/)Fix(\:|%3A)/);
  };
  G.is_fix_editor = function () {
    return DL.href.match(/Fix(\:|%3A)/) && DL.search.match(/action=edit/);
  };
//http://stackoverflow.com/questions/16755655/simplest-way-to-detect-if-mobile-device-with-j..
  G.is_mobile = function () {
    return (/iPad|iPhone|iPod|Android|Blackberry|Opera Mini|IEMobile/i)
        .test(navigator.userAgent) || DL.search.match(/[&\?]mobile=1/);
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
	"site/bookmarklet.html",
	"site/build.html"
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
    //"site/js/build-fix.js", (28 May 2014)
    "site/js/accessify-analytics.js"
  ];

  //configs.templates.prod = ["build/dist/templates.html"];
  configs.app.prod = ["site/build/app.min.js"];

  /*try {
    if (exports) exports.filesArray = filesArray;
  } catch (e) {

  }*/

  G.log("config.js", configs, G);

  cfg = configs.app[configs.env];
  //AcfyWiki.log(cfg);

  for (idx = 0; idx < cfg.length; idx++) {
    G.addScript(cfg[idx]);
  }

})();
