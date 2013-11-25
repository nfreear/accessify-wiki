
(function () {

  'use strict';

  var
    lang = 'en', //'fr', //'zh-CN',
    twitter_ac = 'AccessifyWiki',
    tags = 'usability',
    ref = encodeURIComponent(document.location.href),
    url = document.location.href,
    //url = 'http://accessify.wikia.com/wiki/Fix:Google_search#Fixes',
    //IF (is fix page())...
    //  title = $("meta[property = 'og:title']").attr("content").replace("Fix:", ""),
    title = $(".WikiaPageHeader h1").text().replace("Fix:", ""),
    //title = 'Google search',
    msg = ('Check out these accessibility fixes for %s').replace("%s", title),
    url_enc = encodeURIComponent(url),
    msg_enc = encodeURIComponent(msg);


  //TODO: Not for 'Special:' or '?..action=edit' pages.


  //$("#share").after(
  $("#WikiaSearch").after(
    '<div class="acfy-social-wdg module"><h3 id="acfy-social-wdg-hd">Sharing buttons</h3>' +
    '<ul aria-labelledby="acfy-social-wdg-hd" role="navigation">' +
    //Twitter-ALT + Twitter.
    '<li class="Twitter"><a class="twitter-alt" href="https://twitter.com/intent/tweet?lang=' +
    lang + '&hashtags='+ tags +'&original_referer='+ ref +'&text='+ msg_enc +'&tw_p=twitter-alt&url='+ url_enc +'&via='+ twitter_ac +'"' +
    '>Tweet</a>' +
    '<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + url + '"' +
    ' data-text="'+ msg +'" data-via="'+ twitter_ac +'" data-hashtags="'+ tags +'" data-lang="'+ lang +'" data-dnt="true">Tweet</a></li>' +
    //Facebook. Added: "http:"
    '<li class="Facebook"><iframe src="http://www.facebook.com/plugins/like.php?href=' + url_enc +
    '&width=450&height=21&colorscheme=light&layout=button_count&action=like&show_faces=false&send=false"' +
    ' scrolling="no" frameborder="0" allowTransparency="true" ></iframe></li>' +
    //LinkedIn.
    '<li class="LinkedIn"><scr' + 'ipt src="//platform.linkedin.com/in.js">lang: en_US</scr' + 'ipt>' +
    '<scr' + 'ipt type="IN/Share" data-url="' + url +'" data-counter="right"></scr' + 'ipt></li>' +

    '</ul></div>'
  );


  $(".social-btn-nav li").each(function (idx, el) {
    var cls = el.className;

    $(el).attr({
      role: "link",
      //tabindex: 0,
      title: ("Share via %s. Opens in new window").replace("%s", cls)
    });
  });

})();



!function (d, s, id) {
  var js,
  fjs = d.getElementsByTagName(s)[0],
  p = /^http:/.test(d.location) ? 'http' : 'https';
  if (!d.getElementById(id)) {
    js = d.createElement(s);
	js.id = id;
	js.src = p + '://platform.twitter.com/widgets.js';
	fjs.parentNode.insertBefore(js, fjs);
  }
}(document, 'script', 'twitter-wjs');
