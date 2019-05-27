var express = require('express');
var jwt = require('jsonwebtoken');
var DButilsAzure = require('./DButils');
var UserManagement = require('./UserManagment');
var POIGeneralManagement = require('./POIGeneralManagement');
var UserPOIManagement = require('./UserPOIManagement');
var bodyParser = require('body-parser').json();

var app = express();
const secret = "Hila1705";
var port = 3000;

app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

/**
 * Token authentication
 * MIDDLEWARE
 */
app.use('/private', function(req,res,next){
    const token = req.header("x-auth-token");
    // no token
    if (!token)
        res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, secret);
        req.decoded = decoded;
        next(); //move on to the actual function
    } catch (exception) {
        res.status(400).send("Invalid token.");
    }
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
app.post('/private/rankPOI', bodyParser ,function(req, res) {
    UserPOIManagement.rankPOI(req,res);
});

app.post('/private/saveFavPOI', bodyParser ,function(req, res) {
    UserPOIManagement.saveFavPOI(req,res);
});

app.delete('/private/removeFavPOI', bodyParser ,function(req, res) {
    UserPOIManagement.removeFavPOI(req,res);
});


/**
 * General
 */
app.get('/listCategories', function(req, res){
    var query = "SELECT name FROM Categories";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
});
