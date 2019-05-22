var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');
var UserManagement = require('./UserManagment');
var POIGeneralManagement = require('./POIGeneralManagement');
var UserPOIManagement = require('./UserPOIManagement');
var bodyParser = require('body-parser').json();

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

/**
 * User Management Section
 */
app.post('/registerUser', bodyParser ,function(req, res) {
    UserManagement.registerUser(req,res);
});

app.post('/login', bodyParser ,function(req, res) {
    UserManagement.login(req,res);
});

app.post('/restorePassword', bodyParser ,function(req, res) {
    UserManagement.restorePassword(req,res);
});


/**
 * General POI management
 */
app.get('/randomPOI/:minimalRank', function(req, res){
    POIGeneralManagement.RandomPOI(req,res);
});

app.get('/listAllPOIs', function(req, res){
    POIGeneralManagement.listAllPOIs(req,res);
});

app.get('/POIdata', function(req, res){
    POIGeneralManagement.POIdata(req,res);
});

/**
 * User-POI Management
 */

app.post('/rankPOI', bodyParser ,function(req, res) {
    UserPOIManagement.rankPOI(req,res);
});

app.post('/saveFavPOI', bodyParser ,function(req, res) {
    UserPOIManagement.saveFavPOI(req,res);
});

app.post('/removeFavPOI', bodyParser ,function(req, res) {
    UserPOIManagement.removeFavPOI(req,res);
});

/**
 * General
 */
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
