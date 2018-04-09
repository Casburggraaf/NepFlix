var express = require('express')

express()
  .use(express.static('static'))
  .set('view engine', 'ejs')
  .set('views', 'view')
  .get('/', index)
  .get('/index.html', index)
  .listen(3003)


function index(req, res) {
  res.render('index.ejs');
}
