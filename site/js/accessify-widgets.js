/*!
  Fix form-input widget, bookmarklets, iframe-embeds.
*/

var AcfyWiki = AcfyWiki || {};

(function () {

  'use strict';

  var G = AcfyWiki,
    DL = document.location;

  // Alternative to: https://github.com/allmarkedup/purl
  String.prototype.url_get = function (key, pattern, def) {
    var
      str = decodeURIComponent(this),
      pattern = pattern || "[^&;=#]+",
      re = new RegExp(":\/\/.+[\?&#!]" + key + "=(" + pattern + ")#?"),  //+ ")(&.*)?$"
      m = str.match(re);
    //G.log(">> url_get() ", this, m);
    return m && m[1] ? m[1] : def;
  }


  setup_create_fix_widget();
  setup_bookmarklet_js();
  setup_bookmarklet_dev_js();
  setup_iframes();


  function setup_create_fix_widget() {

    $("#mw-content-text .createboxInput").attr({
      "aria-labelledby": "createbox-label-1",
      "aria-label": "Start creating fixes for a site or part of a site. Site short name",
      title: "Site short name",
      required: true,
      maxlength: 24, //16,
      id: "createboxInput-fix-1"
    });
  }


  function setup_bookmarklet_js() {
    $("a[href = '#_ACFY_BOOKMARKLET']").attr({
      role : "button",
      "aria-label": "Accessify bookmarklet",
      title: "Accessify",
      href : get_bookmarklet_js(),
      "class": "acfy-marklet"
    })
    .click(function (e) {

      if (G.is_mobile()) {
        $("title").text("Accessify*");
      }
      else {
        e.preventDefault();

        alert(get_bookmarklet_message());
      }
    });

    /*if (DL.hash.match("javascript:")) {
      //$("title").text("*Accessify");
      G.log(">> Bookmarklet - set title.");
    }*/


    $("a[href $= '.user.js']").attr({
      role : "button",
      title: "User Javascript",
      id: "userjs"
    });
  }


  function setup_bookmarklet_dev_js() {
    var
      el = $("a[href = '#_ACFY_BOOKMARKLET_DEV']"),
	  href = document.location.href,
	  fx_url_re = "https?:\/\/.+\/.+\.ya?ml",
	  fx_url  = href.url_get("url", fx_url_re),
	  fx_glob = href.url_get("glob");

	G.log(">> Dev bookmarklet", el, fx_url);

	if (fx_url && fx_glob) {
	  // Success.
	  el.attr({
	    href: get_bookmarklet_js().replace(/AC5U=\{[^\}]*\}/,
	        'AC5U={url:"' + fx_url + '",glob:"' + fx_glob + '"}'),
	    "class": "acfy-marklet-dev"
	  });

	  G.log(">> Dev bookmarklet: OK");
	}
	else {
	  // Warning.
	  G.log(">> Dev bookmarklet: Warning: url and glob either missing or invalid.");
	  el.hide();
	}

	el.before(dev_bookmarklet_form(fx_url_re));

	$("input[name = url]").val(fx_url);
	$("input[name = glob]").val(fx_glob);
  }


  function dev_bookmarklet_form(url_re) {
    return "" +
	  "<form id='acfy-dev-bookmarklet-fm'>" +
	  "<p><label>Fixes URL <input name=url required type=url placeholder=" +
	  "'http://example/path/to/fixes.yaml' " +
	  "pattern='" + url_re + "' title='A URL starting `http` and ending `.yaml`'></label>" +
	  "<p><label>Pattern <input name=glob required placeholder='http://example.site/*' ></label>" +
	  " <input type=submit ></form>";
  }

  function get_bookmarklet_js() {
    return (G.is_mobile() ? "#" : "") +
      "javascript:(function(){" +
	  "AC5U={};" +
      "var D=document,s=D.createElement('script')/*T*/;s.src='" +
      G.tools_url +
      "browser/js/accessifyhtml5-marklet.js" +
      "?x='+(Math.random());D.body.appendChild(s)" +
      "})();";
  }

  function get_bookmarklet_message() {
      var ua = navigator.userAgent,
        msg = "'Bookmark This Link' in your 'Bookmarks Toolbar'. (Firefox)";
      if (ua.match(/WebKit/)) {
        msg = "'Copy link address' or drag me to your 'Bookmarks bar'. (Chrome/Safari)";
      }
      else if (ua.match(/MSIE/)) {
        msg = "'Add to Favorites...', then 'Create in' the 'Favorites bar'. (Internet Explorer)";
      }

      return "Bookmarklet. To add me to your browser:\n\nRight-click and " + msg;
  }


  function setup_iframes() {
    if (! G.iframe_re) return;

    $("a[href *= 'EMBED_ME']").each(function (i, el) {
      var url = $(el).attr("href"),
        text = $(el).text(),
        at = "allowfullscreen mozallowfullscreen webkitallowfullscreen",
        mid = DL.search.match(/q=(Fix[^&]+)/),  /* /q=(Fix:[\w\-_]+)/) */
        mq = url.match(/q=(Fix[^&]+)/),
        site_id = mid ? mid[1] : (mq ? mq[1] : ""),
        mth = $("body").attr("class").match(/(oasis-dark-theme)/),
        theme = mth ? mth[1] : "",
        mw = url.match(/width=(\d+)/),
        mh = url.match(/height=(\d+)/),
        width  = mw ? mw[1] : "99.5%",
        height = mh ? mh[1] : 250;

      if (! url.match(new RegExp("^https?:\\/\\/(" + G.iframe_re + ")\\/"))) {
        return;
      }

      if (url.match(/\.(gif|png|jpe?g)/)) {
        $(el).replaceWith("<img class='acfy-ifr' alt='" + text + "' src='" + url + "' />");
        return;
      }

      url += "&theme=" + theme + "&q=" + site_id;

      $(el).replaceWith("<iframe class='acfy-ifr' aria-label='" + text + "' width='"
        + width + "' height='" + height + "' src='" + url + "' " 
        + at +"></iframe>");
    });
  }

})();
