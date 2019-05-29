var DButilsAzure = require('./DButils');

function RandomPOI(req, res){
    var query = "SELECT TOP 3 id,name,image,category FROM PointOfInterest " +
        "WHERE rank >= '" + req.params.minimalRank +"' " +
        "ORDER BY RAND()";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
}

function listAllPOIs(res){
    var query = "SELECT id,name,image,category FROM PointOfInterest";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
}

function POIdata(req, res){
    var query = "SELECT * FROM PointOfInterest " +
        "WHERE id = '" +req.params.POI_id + "'; " +
        "SELECT TOP 2 review, rank, CONVERT(VARCHAR(10),tm_created,111) as date FROM PointOfInterestReviews " +
        "WHERE poi_id = '" +req.params.POI_id + "' " +
        "ORDER BY tm_created ASC;";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
}

function increaseViews(req, res){
    var query = "Update PointOfInterest SET views = views + 1 WHERE id = '" + req.body.poi_id + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send("True");
        })
        .catch(function(err){
            res.send(err);
        })
}

exports.RandomPOI = RandomPOI;
exports.listAllPOIs = listAllPOIs;
exports.POIdata = POIdata;
exports.increaseViews = increaseViews;
