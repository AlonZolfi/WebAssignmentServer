var express = require('express');
var app = express();
var DButilsAzure = require('./DButils');

var port = 3000;
app.listen(port, function () {
    console.log('Example app listening on port ' + port);
});

app.get('/listCategories', function(req, res){
    DButilsAzure.execQuery("SELECT * FROM Categories")
        .then(function(result){
            res.send(result)
        })
        .catch(function(err){
            console.log(err);
            res.send(err)
        })
});