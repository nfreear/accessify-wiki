/*!

  NDF, 28 October 2013.

https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/modifying-web-pages-tab.html
https://addons.mozilla.org/en-US/developers/docs/sdk/latest/dev-guide/tutorials/modifying-web-pages-url.html
https://developer.mozilla.org/en-US/Add-ons/SDK/Tutorials/Modifying_Web_Pages_Based_on_URL
*/

var widgets = require("sdk/widget");
var tabs = require("sdk/tabs");
var self = require("sdk/self");

var widget = widgets.Widget({
  id: "acfy-widget",
  label: "Accessify*",
  contentURL: "http://www.mozilla.org/favicon.ico",
  onClick: function() {
    tabs.activeTab.attach({
      //contentScriptFile: self.data.url("my-script.js")
      contentScriptFile: self.data.url("accessifyhtml5-marklet.js")
    });
    
    console.log("Attached JS.");
  }
});


var pageMod = require("sdk/page-mod").PageMod({
  include: "*",
  //contentScriptWhen: "end",
  attachTo: ["existing", "top"],
  onAttach: function (worker) {
  
  },
  contentStyle: "body {" +
    "  border: 3px solid green;" +
    "}"
});

