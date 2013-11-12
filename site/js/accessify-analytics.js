
/*global AcfyWiki, $, ga */

var AcfyWiki = AcfyWiki || {};


//Was: function google_analytics(){};

(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-40194374-3', 'wikia.com');
ga('send', 'pageview');



(function () {

  'use strict';

  $("a[href $= '.user.js']").on("click", ["User.JS", false, 5], function (ev) {
    return ga_track_download(ev);
  });

  $("a[href ^= 'javascript:'], a[href = '#_ACFY_BOOKMARKLET']").on("click dragstart contextmenu", ["Bookmarklet.JS"], function (ev) {
    return ga_track_download(ev);
  });


  function ga_track_download(event, label, category, value) {
    var
      href = event.target.href,
      file = href.match(/([^\/]+\.(js|pdf))/i),
      is_bookmarklet = href.match(/^javascript:/i);

    if (!value) {
      try {
        value = event.data[2];
      } catch (ex) {}
    }

    if (!category) {
      try {
        category = event.data[1];
      } catch (ex) {}
    }
    if (!category) {
      category = 'Download';
    }

    if (!label) {
      try {
        label = event.data[0];
      } catch (ex) {}
    }
    label = false;  //TEST!

    if (!label && is_bookmarklet) {
      label = '*Bookmarklet.JS';
    }
    if (!label && file) {
      label = file[1];
    }


    //_gaq.push(['_trackEvent', 'Downloads', 'User.JS', 'Download/ installed accessify.user.js']);
    ga('send', 'event', category, event.type, label, value);
    AcfyWiki.log(category, 'event:', event.type, label, value, event);

    if ('click' === event.type) {
      event.preventDefault();
      return false;
    }
    return true;
  }

})();
