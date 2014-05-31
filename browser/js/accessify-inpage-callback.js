
AC5U = window.AC5U || {};

function __accessify_IPG(fixes) {

  "use strict";

  var G = AC5U,
    L = document.location,
    pat = /debug/,
    debug = G.debug || L.search.match(pat) || L.hash.match(pat);

  function log(s) {
    window.console && debug &&
      console.log(arguments.length > 1 ? arguments : s);
  }

  if (G.result) {
    return log("AccessifyHTML5: already run");
  }

  log("AccessifyHTML5: running");

  G.result = AccessifyHTML5(false, fixes);

  log(G.result);
}
