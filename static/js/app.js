(function () {
  "use strict";

  var app = {
    init: function() {
      document.querySelector(".search img").addEventListener("click", function () {
        document.querySelector(".search input").classList.toggle("active");
      })
    }
  }

  app.init()
})();
