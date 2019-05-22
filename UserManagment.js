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

}

function login(req, res){

}

exports.registerUser = registerUser;
exports.restorePassword = restorePassword;
exports.login = login;