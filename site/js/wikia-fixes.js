
(function () {
  //Was: function wikia_accessibility_fixes()

  'use strict';

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

})();
