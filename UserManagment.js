var DButilsAzure = require('./DButils');

function registerUser(req, res){
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
    var query = "SELECT password FROM Users " +
        "WHERE " +
        "username = " + "'" + req.body.username + "'" +
        " AND " +
        "question = " + "'" + req.body.question + "'" +
        " AND " +
        "question = " + "'" + req.body.answer + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            if(result.length == 1)
                res.status(200).send(result);
            else
                throw "False";
        })
        .catch(function(err){
            console.log(err);
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
            if(result.length == 1)
                res.status(200).send("true"); //need to send token
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