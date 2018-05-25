(function () {
  "use strict";

  const app = {
    init: function() {
      autocomplete.init();

      const serieItems = document.querySelectorAll("main label");
      const detailPage = document.querySelector("main > section > section:last-child");
      const checkBoxes = document.querySelectorAll("main input[type=checkbox]")

      document.querySelector("body > nav section img").addEventListener("click", function () {
        if(this.getAttribute("src") === "style/search.svg") {
          // document.querySelector(".search").style.display = "flex";
          this.src = "style/close.svg";
          // document.querySelector(".popular").classList.toggle("hidden");
          document.querySelector("body>nav input:first-of-type").checked = true;
        } else {
          document.querySelector("body>nav input:first-of-type").click();
          this.src = "style/search.svg";
          // document.querySelector(".popular").classList.toggle("hidden");
          document.querySelector("body>nav input:first-of-type").checked = false;
        }
        document.querySelector("body>nav").classList.toggle("active");
        document.querySelector("body>nav span").innerHTML = "";
        document.querySelector("body>nav input:last-of-type").focus();
      });

      document.querySelector("body>nav input:first-of-type").addEventListener("change", () => {
        if(!document.querySelector("body>nav").classList.contains("active")){
          document.querySelector("body > nav section img").click(); 
        }
      });

      serieItems.forEach(function(el) {
        el.addEventListener("mouseenter", function () {
          if (this.parentElement.classList.contains("popular")) {
            detailPage.querySelector("h2").innerHTML = "";
            detailPage.querySelector("h2").appendChild(document.createTextNode(window.data[this.dataset.id].original_name));
            detailPage.querySelector(".vote").innerHTML = "";
            detailPage.querySelector(".vote").appendChild(document.createTextNode(window.data[this.dataset.id].overview));
            detailPage.querySelector("img").src = `https://image.tmdb.org/t/p/w342${window.data[this.dataset.id].poster_path}`;
            detailPage.querySelector(".overview").innerHTML = "";
            detailPage.querySelector(".overview").appendChild(document.createTextNode(`A avrage score of ${window.data[this.dataset.id].vote_average} of votes ${window.data[this.dataset.id].vote_count}`));
          }
        });
      });

      checkBoxes.forEach(function(el) {
        el.addEventListener("change", function () {
         if(this.checked){
           this.focus();
          if (this.parentElement.classList.contains("popular")) {
            detailPage.querySelector("h2").innerHTML = "";
            detailPage.querySelector("h2").appendChild(document.createTextNode(window.data[this.dataset.id].original_name));
            detailPage.querySelector(".vote").innerHTML = "";
            detailPage.querySelector(".vote").appendChild(document.createTextNode(window.data[this.dataset.id].overview));
            detailPage.querySelector("img").src = `https://image.tmdb.org/t/p/w342${window.data[this.dataset.id].poster_path}`;
            detailPage.querySelector(".overview").innerHTML = "";
            detailPage.querySelector(".overview").appendChild(document.createTextNode(`A avrage score of ${window.data[this.dataset.id].vote_average} of votes ${window.data[this.dataset.id].vote_count}`));
          }
        }
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
    inputField: document.querySelector("body>nav input:last-of-type"),
    autoCompleteElement: document.querySelector("body>nav span"),
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
        } else if (key === 27) {
          document.querySelector("body > nav section img").click(); 
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
    target: document.querySelector(".search"),
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
