var DButilsAzure = require('./DButils');
var jwt = require('jsonwebtoken');
const secret = "Hila1705";

function registerUser(req, res) {
    try{
        validateUserRegister(req);
    }
    catch(error){
        res.status(400).send(error);
        return;
    }

    var query = "BEGIN TRY" +
        " BEGIN TRANSACTION; ";
    query += "INSERT INTO Users (username, password, firstname, lastname, city, country, email) " +
        "Values " +
        "('" + req.body.username+ "'" +
        ",'" + req.body.password+ "'" +
        ",'" + req.body.firstname+ "'" +
        ",'" + req.body.lastname+ "'" +
        ",'" + req.body.city+ "'" +
        ",'" + req.body.country+ "'" +
        ",'" + req.body.email + "'" +
        "); ";
    for (let i = 0; i < req.body.interests.length; i++) {
        query+= "INSERT INTO UserInterests (username, interest) " +
            "Values " +
            "('" + req.body.username+ "'" +
            ",'" + req.body.interests[i].interest+ "'" +
            "); ";
    }
    for (let i = 0; i < req.body.authQuestion.length; i++) {
        query += "INSERT INTO Questions (username, question, answer) " +
            "Values " +
            "('" + req.body.username+ "'" +
            ",'" + req.body.authQuestion[i].question+ "'" +
            ",'" + req.body.authQuestion[i].answer+ "'" +
            "); ";
    }
    query+= "COMMIT; " +
        "END TRY " +
        "BEGIN CATCH " +
        "ROLLBACK; " +
        "THROW; " +
        "END CATCH ";
    DButilsAzure.execQuery(query)
        .then(function(){
            res.status(201).send("Successfully registered");
        })
        .catch(function(err){
            res.status(400).send(err);
        });
}

function validateUserRegister(req){
    const usernameRegex = /^[a-zA-Z]+$/;
    if(!usernameRegex.test(req.body.username))
        throw("Username illegal");

    const passwordRegex = /^[a-zA-Z0-9]+$/;
    if(!passwordRegex.test(req.body.password))
        throw("Password illegal");

    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if( !emailRegex.test(req.body.email) )
        throw("Email illegal");

    if(req.body.interests.length<2)
        throw("Interests illegal");

    const countryQuery = "SELECT * FROM Countries WHERE name = '" + req.body.country + "'";
    DButilsAzure.execQuery(countryQuery)
        .then(function (result) {
            if(result.length!=1)
                throw "Country Illegal";
        })
        .catch(function (err){
            throw err;
        });

    const interestsQuery = "SELECT name FROM Categories";
    DButilsAzure.execQuery(interestsQuery)
        .then(function (result) {
            var interestsArr = req.body.interests;
            for (let i = 0; i < interestsArr.length; i++) {
                let found = false;
                for (let j = 0; j < result.length; j++) {
                    if(interestsArr[i].interest==result[j].name)
                        found = true;
                }
                if(!found)
                    throw("Interests illegal")
            }
        })
        .catch(function (err){
            throw err;
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