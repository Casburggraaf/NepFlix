var express = require('express')
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;


express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', index)
  .get('/index.html', index)
  .listen(3003)


function index(req, res) {
  api.requestPopular().then(function() {
    console.log();
    res.render('index.ejs', {data: api.data.results});
  });

}

const api = {
  apiBasisUrl: "https://api.themoviedb.org/3/tv/popular",
  apiKey: "d9a167a57e748b4a804b41f0186b2339",
  data: null,
  requestPopular() {
    const _this = this;
    // Makes a promise for the XMLHttpRequest request
    const promise = new Promise(function (resolve, reject) {
      const request = new XMLHttpRequest();

      // Making the url and creating a GET request
      const url = `${_this.apiBasisUrl}?api_key=${_this.apiKey}`;

      request.open('GET', url, true);

      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          _this.data = JSON.parse(request.responseText);

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
  }
}
