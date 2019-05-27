var DButilsAzure = require('./DButils');
var jwt = require('jsonwebtoken');
const secret = "Hila1705";

function registerUser(req, res) {
    const usernameRegex = /^[a-zA-Z]+$/;
    const passwordRegex = /^[a-zA-Z0-9]+$/;
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!usernameRegex.test(req.body.username) || !passwordRegex.test(req.body.password) || !emailRegex.test(req.body.email) || req.body.intrests.length<2) {
        res.status(400).send("Invalid Input");
        return;
    }
    const countryQuery = "SELECT * FROM Countries WHERE name = '" + req.body.country + "'";
    //const interestsQuery = "SELECT * FROM Categories";
    DButilsAzure.execQuery(countryQuery)

        .then(function (result) {
            if(result.length!=1)
                throw "Country Illegal";
        })
        .catch(function (err){
            res.status(400).send(err);
        });
    var query = "INSERT INTO Users (username, password, firstname, lastname, city, country, email) " +
        "Values " +
        "('" + req.body.username+ "'" +
        ",'" + req.body.password+ "'" +
        ",'" + req.body.firstname+ "'" +
        ",'" + req.body.lastname+ "'" +
        ",'" + req.body.city+ "'" +
        ",'" + req.body.country+ "'" +
        ",'" + req.body.email + "'" +
        ");";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.status(201).send("true");
        })
        .catch(function(err){
            console.log(err);
            res.status(400).send(err);
        });
}

function restorePassword(req, res){
    var query = "SELECT * FROM Questions " +
        "WHERE " +
        "username = " + "'" + req.body.username + "'" +
        " AND " +
        "question = " + "'" + req.body.question + "'" +
        " AND " +
        "question = " + "'" + req.body.answer + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            if(result.length == 1) {
                const passwordQuery = "SELECT password FROM Users WHERE username = '" + req.body.username + "'";
                DButilsAzure.execQuery(passwordQuery)
                    .then(function(result){
                        res.send(result);
                    })
                    .catch(function(err){
                        res.status(400).send(err);
                    });
            }
            else
                throw "False";
        })
        .catch(function(err){
            res.status(400).send(err);
        });
}

function login(req, res){
    var query = "SELECT * FROM Users " +
        "WHERE " +
        "username = " + "'" + req.body.username + "'" +
        " AND " +
        "password = " + "'" + req.body.password + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            if(result.length == 1) {
                payload = {username: req.body.username};
                options = {expiresIn: "1d"};
                const token = jwt.sign(payload, secret, options);
                res.send(token);
            }
        else
                throw "False";
        })
        .catch(function(err){
            console.log(err);
            res.status(400).send(err);
        });
}

exports.registerUser = registerUser;
exports.restorePassword = restorePassword;
exports.login = login;