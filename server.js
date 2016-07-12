'use strict';

var express = require('express');
var app = express();
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI;
var origurl, newurl, doc;
var port = process.env.PORT || 8080;
var key = 0;

app.get('/new/:origurl', function(req, res) {
    var origurl = req.params.origurl;
    var newurl = "https://sturlshortener.herokuapp.com/" + key;
    key = key + 1;
    doc = {'origurl': origurl, 'newurl': newurl}
    res.write(JSON.stringify(doc));
	res.end();
})



MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connection established to', url);

    // do some work here with the database.
    var urls = db.collection('urls');
    urls.insert(doc, function(err, data){
        if(err) console.log(err);
    })

    //Close connection
    db.close();
  }
});

app.listen(port, function () {
  console.log('App listening on port 8080!');
});