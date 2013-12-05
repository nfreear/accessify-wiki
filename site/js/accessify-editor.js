
var AcfyWiki = AcfyWiki || {};

(function () {
  //function setup_accessify_editor()
  
  'use strict';

  var
    G = AcfyWiki,
    DL = document.location,
    pg = DL.pathname.replace("/wiki/", ""),
    build = "/wiki/Build_fix_js?q=" + pg,
    write = "/wiki/Write_fixes";

  if (!G.editor) return;

  if (G.is_fix_editor()) {
/*
    setTimeout(function () {
    $("a.cke_button_ModeSource").trigger("click");
    }, 2000);
*/

    $("body").addClass("acfy-fix-editor");

    $("#editform").before("<div class='acfy-fix-editor-msg'>"
    + "<span>Accessibility fixes editor:</span> "
    + "<a href='" + write + "'>Find out how to write fixes</a> | "
    + "<a href='" + build + "'>Site owners</a>."
    + "</div>");
  }
  else if (G.is_fix_page()) {

    $("body").addClass("acfy-fix-viewer");

    $("#WikiaArticle").before("<div class='acfy-fix-editor-msg'>"
    + "<span>Accessibility fixes viewer:</span> "
    + "<a href='" + write + "'>Start writing fixes</a> | "
    + "<a href='" + build + "'>Site owners</a>."
    + "</div>");
  }

})();
