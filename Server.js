var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var UserManagement = require('./UserManagment');
var POIManagement = require('./POIManagement');
var bodyParser = require('body-parser').json();

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

app.get('/listCategories', function(req, res){
    var query = "SELECT * FROM Categories";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
});

app.post('/registerUser', bodyParser ,function(req, res) {
    UserManagement.registerUser(req,res);
});

app.get('/randomPOI/:minimalRank', function(req, res){
    var query = "SELECT TOP 3 id,name,image,category FROM PointOfIntrest " +
        "ORDER BY NEWID()";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
});

app.get('/randomPOI', function(req, res){
    var query = "SELECT TOP 2 id,name,image,category FROM PointOfIntrest " +
        "ORDER BY rank" +
        "WHERE ";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
});

