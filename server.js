var express = require('express');
var path = require('path');
var mongo = require('mongodb').MongoClient;
var searchapi = require('./search.js');
var historyapi = require('./history.js');

var app = express();

app.set('port', (process.env.PORT || 8080));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

mongo.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/rimagesearch', function(err, db) {

  if (err) {
    throw new Error('Connection error!');
  } else {
    console.log('Connected to MongoDB');
  }

  db.createCollection("sHistory", {
    capped: true,
    size: 5242880,
    max: 1000
  });
  
  app.route('/').get(function(req, res) {res.render('index');});

  searchapi(app, db);
  historyapi(app, db);

  app.get("*", function(request, response) {
     response.end("404!");
  });

  var port = app.get('port');
  
  app.listen(port, function() {
    console.log('imagesearch-api app listening on port ' + port);
  });

});