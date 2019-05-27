var DButilsAzure = require('./DButils');

function RandomPOI(req, res){
    var query = "SELECT TOP 3 id,name,image,category FROM PointOfInterest " +
        "ORDER BY NEWID()" +
        "WHERE rank >= '" + req.params.minimalRank +"'";
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
    var query = "SELECT * FROM PointOfInterest" +
        "WHERE id = '" +req.params.POI_id + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
}



exports.RandomPOI = RandomPOI;
exports.listAllPOIs = listAllPOIs;
exports.POIdata = POIdata;
