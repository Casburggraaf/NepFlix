(function () {
  "use strict";

  var app = {
    init: function() {
      const serieItems = document.querySelectorAll(".serieGrid > a");
      const detailPage = document.querySelector("#detailPage");
      const detailPageBack = document.querySelector(".detailPageBack");

      document.querySelector(".search img").addEventListener("click", function () {
        document.querySelector(".search input").classList.toggle("active");
      });

      document.querySelector("#detailPage .close").addEventListener("click", function () {
        detailPage.classList.remove("active");
        detailPageBack.classList.remove("active");
      });

      detailPageBack.addEventListener("click", function () {
        detailPage.classList.remove("active");
        detailPageBack.classList.remove("active");
      });

      window.onkeyup = function(e) {
        var key = e.keyCode ? e.keyCode : e.which;
        if (key === 27) {
          detailPage.classList.remove("active");
          detailPageBack.classList.remove("active");
        }
      };

      serieItems.forEach(function(el) {
        el.addEventListener("mouseenter", function () {
          detailPage.classList.add("hover");
          this.querySelector(".showMore").classList.add("hover");
          document.querySelector("#detailPage h2").innerHTML = "";
          document.querySelector("#detailPage h2").appendChild(document.createTextNode(window.data[this.dataset.id].original_name));
          document.querySelector("#detailPage .vote").innerHTML = "";
          document.querySelector("#detailPage .vote").appendChild(document.createTextNode(window.data[this.dataset.id].overview));
          document.querySelector("#detailPage img").src = `https://image.tmdb.org/t/p/w342${window.data[this.dataset.id].poster_path}`;
          document.querySelector("#detailPage .overview").innerHTML = "";
          document.querySelector("#detailPage .overview").appendChild(document.createTextNode(`A avrage score of ${window.data[this.dataset.id].vote_average} of votes ${window.data[this.dataset.id].vote_count}`));
          console.log(window.data[this.dataset.id]);
        });
        el.addEventListener("mouseleave", function () {
          detailPage.classList.remove("hover");
          this.querySelector(".showMore").classList.remove("hover");
        });
        el.addEventListener("click", function () {
          detailPage.classList.add("active");
          detailPageBack.classList.add("active");
        });
      });

    }
  }

  app.init()
})();
