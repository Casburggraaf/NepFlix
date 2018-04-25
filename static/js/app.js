(function () {
  "use strict";

  const app = {
    init: function() {
      autocomplete.init();

      const serieItems = document.querySelectorAll(".serieGrid > a");
      const detailPage = document.querySelector("#detailPage");
      const detailPageBack = document.querySelector(".detailPageBack");

      document.querySelector(".search img").addEventListener("click", function () {
        console.log(this.getAttribute("src"));
        if(this.getAttribute("src") === "style/search.svg") {
          this.src = "style/close.svg";
          document.querySelector(".serieGrid.popular").classList.toggle("hidden");
        } else {
          this.src = "style/search.svg";
          document.querySelector(".serieGrid.popular").classList.toggle("hidden");
        }
        document.querySelector("nav").classList.toggle("active");
        document.querySelector(".autoComplete").innerHTML = "";
        document.querySelector(".search input").focus();
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
        if (document.querySelector("#detailPage").classList.contains("active")) {
          let key = e.keyCode ? e.keyCode : e.which;
          if (key === 27) {
            detailPage.classList.remove("active");
            detailPageBack.classList.remove("active");
          }
        }
      };



      serieItems.forEach(function(el) {
        el.addEventListener("mouseenter", function () {
          detailPage.classList.add("hover");
          this.querySelector(".showMore").classList.add("hover");
          if (this.parentElement.classList.contains("popular")) {
            document.querySelector("#detailPage h2").innerHTML = "";
            document.querySelector("#detailPage h2").appendChild(document.createTextNode(window.data[this.dataset.id].original_name));
            document.querySelector("#detailPage .vote").innerHTML = "";
            document.querySelector("#detailPage .vote").appendChild(document.createTextNode(window.data[this.dataset.id].overview));
            document.querySelector("#detailPage img").src = `https://image.tmdb.org/t/p/w342${window.data[this.dataset.id].poster_path}`;
            document.querySelector("#detailPage .overview").innerHTML = "";
            document.querySelector("#detailPage .overview").appendChild(document.createTextNode(`A avrage score of ${window.data[this.dataset.id].vote_average} of votes ${window.data[this.dataset.id].vote_count}`));
          } else if (this.parentElement.classList.contains("search")) {
            //
            // document.querySelector("#detailPage h2").innerHTML = "";
            // document.querySelector("#detailPage h2").appendChild(document.createTextNode(search.dataParse[this.dataset.id].original_name));
            // document.querySelector("#detailPage .vote").innerHTML = "";
            // document.querySelector("#detailPage .vote").appendChild(document.createTextNode(search.dataParse[this.dataset.id].overview));
            // document.querySelector("#detailPage img").src = `https://image.tmdb.org/t/p/w342${search.dataParse[this.dataset.id].poster_path}`;
            // document.querySelector("#detailPage .overview").innerHTML = "";
            // document.querySelector("#detailPage .overview").appendChild(document.createTextNode(`A avrage score of ${search.dataParse[this.dataset.id].vote_average} of votes ${search.dataParse[this.dataset.id].vote_count}`));
          }

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

  const api = {
    apiBasisUrl: "https://api.themoviedb.org/3/search/tv",
    apiKey: "d9a167a57e748b4a804b41f0186b2339",
    data: null,
    autoCompleteReq(query) {
      const _this = this;
      // Makes a promise for the XMLHttpRequest request
      const promise = new Promise(function (resolve, reject) {
        const request = new XMLHttpRequest();

        // Making the url and creating a GET request
        const url = `${_this.apiBasisUrl}?api_key=${_this.apiKey}&query=${query}`;

        request.open('GET', url, true);

        request.onload = function () {
          if (request.status >= 200 && request.status < 400) {
            api.data = JSON.parse(request.responseText).results;
            resolve();
          } else {
            reject(request.status); // Error handeling
          }
        };

        request.onerror = function () {
          reject("Failed to proform api req"); // Error handeling
        };

        request.send();
      });

      return promise;
    },
  }

  const autocomplete = {
    inputField: document.querySelector(".search input"),
    autoCompleteElement: document.querySelector(".search .autoComplete"),
    inputValue: null,
    data: null,
    init() {
      this.autoCompleteElement.addEventListener("click", () => {
        this.inputField.focus();
        this.autoComplete();
      });

      this.inputField.addEventListener("keydown", (e) => {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key === 9) {
          e.preventDefault();
          this.autoComplete();
        }
      });

      this.inputField.addEventListener("input", (evt) => {
        this.autoCompleteElement.innerHTML = "";
        this.inputValue = evt.target.value;
        if (this.inputValue !== "") {
          api.autoCompleteReq(this.inputValue).then(() => {
            search.data = Object.assign({}, this.data);
            search.transparency();
            this.data = api.data.filter((el) => {
              if (el.name.startsWith(this.inputValue) ) {
                return true;
              }
            });
            let tempSplit = [this.data[0].name.slice(0,(this.inputField.value.length)),
                            this.data[0].name.slice(this.inputField.value.length)];

            this.autoCompleteElement.innerHTML = `<span>${tempSplit[0]}</span>${tempSplit[1]}`;
          }).catch((error) => {
            this.autoCompleteElement.value = "";
          });
        }
      });
    },
    autoComplete() {
      if (this.data !== null && this.data.length !== 0) {
        this.inputField.value = this.data[0].name;

        let tempSplit = [this.data[0].name.slice(0,(this.inputField.value.length)),
                        this.data[0].name.slice(autocomplete.inputField.value.length)];
        this.autoCompleteElement.innerHTML = `<span>${tempSplit[0]}</span>${tempSplit[1]}`;
      }
    }
  }

  const search = {
    target: document.querySelector(".serieGrid.search"),
    data: null,
    dataParse: null,
    transparency() {

      const directives = {
        title: {
          text() {
            return `${this.name}`;
          }
        },
        poster_path: {
          src() {
            if(this.poster_path !== null){
              return `https://image.tmdb.org/t/p/w342/${this.poster_path}`;
            } else {
              return `style/unavailable.jpg`;
            }
          }
        },
        vote: {
          text() {
            if(this.vote_count !== 0){
              return `Vote average ${this.vote_average}`;
            } else {
              return `Vote score Unkown`;
            }

          }
        },
        link: {
          "data-id"() {
            return search.dataParse.indexOf(this);
          }
        }
      };
      console.log(this.data !== null && this.data.length !== 0);
      if (this.data !== null && this.data.length !== 0) {
        console.log(this.data);
        this.dataParse = Object.keys(this.data).map(item => this.data[item]);
        console.log(this.dataParse);
        Transparency.render(this.target, this.dataParse, directives);

        var elements = this.target.querySelectorAll("a");
        const detailPage = document.querySelector("#detailPage");
        const detailPageBack = document.querySelector(".detailPageBack");
        
        elements.forEach((el) => {
          el.addEventListener("mouseenter", function () {
            detailPage.classList.add("hover");
            this.querySelector(".showMore").classList.add("hover");
            if (this.parentElement.classList.contains("search")) {
              document.querySelector("#detailPage h2").innerHTML = "";
              document.querySelector("#detailPage h2").appendChild(document.createTextNode(search.dataParse[this.dataset.id].original_name));
              document.querySelector("#detailPage .vote").innerHTML = "";
              document.querySelector("#detailPage .vote").appendChild(document.createTextNode(search.dataParse[this.dataset.id].overview));
              document.querySelector("#detailPage img").src = `https://image.tmdb.org/t/p/w342${search.dataParse[this.dataset.id].poster_path}`;
              document.querySelector("#detailPage .overview").innerHTML = "";
              document.querySelector("#detailPage .overview").appendChild(document.createTextNode(`A avrage score of ${search.dataParse[this.dataset.id].vote_average} of votes ${search.dataParse[this.dataset.id].vote_count}`));
            }
          });

          el.addEventListener("mouseleave", function () {
            detailPage.classList.remove("hover");
            this.querySelector(".showMore").classList.remove("hover");
          });
          el.addEventListener("click", function () {
            detailPage.classList.add("active");
            detailPageBack.classList.add("active");
          });

        })


      }
    }
  }

  app.init()
})();
