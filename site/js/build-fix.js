
//var AcfyWiki = AcfyWiki || {};

(function () {
  //Was: function setup_build_fix_js()

  'use strict';

  var DL = document.location,
    re = /([?&]q=)(Fix[^&]+)/,
    q = DL.search.match(re),
    p = $('.page-Build_fix_js');

  if (p.length > 0) {

    AcfyWiki.log("?q=", q, p);

    if (q) {
    $('.source-javascript .co1').each(function (idx, el) {
      var txt = $(el).text(),
      m = txt.match(re);
 
      AcfyWiki.log(el, m);
 
      if (m && m[1]) {
      $(el).text(txt.replace(re, m[1] + q[2]));
      //break;
      }
    });
    }
 
    var js = $('.source-javascript:first'),
    btn = js.before('<button id="acfy-copy">Copy</button>');
    $('#acfy-copy').click(function (e) {
    AcfyWiki.log(js.text());
    window.prompt("Copy to clipboard: Ctrl+C, Enter", js.text());
    });
  }

  $(".page-Build_fix_js #mw-content-text ol:nth-of-type(2)").attr("start", 2);
  $(".page-Build_fix_js #mw-content-text ol:nth-of-type(3)").attr("start", 3);

})();
