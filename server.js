var express = require('express')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var sizeof = require('object-sizeof');

express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', index)
  .get('/index.html', index)
  .listen(3006)

function index(req, res) {
  res.render('index.ejs', {data: api.dataFul});

  // res.render('index.ejs', {data: api.data.results});
}

const api = {
  apiBasisUrl: "https://api.themoviedb.org/3/tv/",
  apiKey: "d9a167a57e748b4a804b41f0186b2339",
  data: null,
  dataFul: [],
  iCounter: 0,
  requestPopular(pageNum) {
    const _this = this;
    // Makes a promise for the XMLHttpRequest request
    const promise = new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      // Making the url and creating a GET request
      const url = `${_this.apiBasisUrl}popular?api_key=${_this.apiKey}&page=${pageNum}`;

      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          //console.log(JSON.parserequest.responseText);
          console.log(pageNum);
          if (pageNum === 1) {
            _this.data = JSON.parse(request.responseText).results;
          } else {
            let temp = JSON.parse(request.responseText).results;
            temp.forEach((el) => {
              _this.data.push(el)
            })
            console.log(_this.data);
          }
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
  requestDetail(id){
    const _this = this;
    // Makes a promise for the XMLHttpRequest request
    const promise = new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      // Making the url and creating a GET request
      const url = `${_this.apiBasisUrl}${id}?api_key=${_this.apiKey}`;

      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          _this.dataFul.push(JSON.parse(request.responseText));

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
  enrichData() {
    if(this.iCounter < api.data.length){
      api.requestDetail(api.data[this.iCounter].id).then(() => {
        this.iCounter++;
        console.log(this);
        console.log(this.iCounter);
        this.enrichData();
      });
    } else {
      console.log(api.dataFul);
      console.log(sizeof(api.dataFul));
    }
  }
}

api.requestPopular(1).then(function() {
    api.requestPopular(2).then(function() {
      api.requestPopular(3).then(function() {
        api.requestPopular(4).then(function() {
          console.log(api.data);
          console.log(api.data.length);
          api.enrichData();

        });
      });
    });
});
