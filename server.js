'use strict';

var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;
var origurl, newurl, doc;
var port = process.env.PORT || 8080;
var key = 0;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
require('dotenv').config({
   silent: true
 });

var urlschema = mongoose.Schema ({
  origurl: String,
  newurl: String
});

mongoose.connect(url);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/new/:origurl', function(req, res) {
      origurl = req.params.origurl;
    newurl = "https://sturlshortener.herokuapp.com/" + key;
    key = key + 1;
    doc = {'origurl': origurl, 'newurl': newurl};
    res.write(JSON.stringify(doc));
    var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //we're connected!
});
  /*MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);
}*/
    // do some work here with the database.
    var urls = db.collection('urls');
    urls.insert(doc, function(err, data){
        if(err) console.log(err);
    });
    console.log(JSON.stringify(doc));
    //Close connection
    db.close();
});
	res.end();
});






app.listen(port, function () {
  console.log('App listening on port ' + port + '!');
});