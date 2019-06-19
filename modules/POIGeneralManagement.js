var DButilsAzure = require('./DButils');

function RandomPOI(req, res){
    try{
        validateRandom(req);
    }
    catch(error){
        res.status(400).send(error);
        return;
    }
    var query = "SELECT TOP 3 id,name,image,category FROM PointOfInterest " +
        "WHERE rank >= '" + req.params.minimalRank +"' " +
        "ORDER BY newid()";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            res.status(400).send("False");
        })
}

function validateRandom(req) {
    if(req.params.minimalRank === undefined || isNaN(req.params.minimalRank))
        throw("Illegal Parameters")
}


function listAllPOIs(req, res){
    var query = "SELECT id,name,image,category,rank FROM PointOfInterest";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            res.status(400).send(err);
        })
}

function POIdata(req, res){
    var query = "SELECT * FROM PointOfInterest " +
        "WHERE id = '" +req.params.POI_id + "'; " +
        "SELECT TOP 2 review, rank, convert(varchar(10),tm_created,120)as date FROM PointOfInterestReviews " +
        "WHERE poi_id = '" +req.params.POI_id + "' " +
        "ORDER BY tm_created DESC;";
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
    try{
        validateIncrease(req);
    }
    catch(error){
        res.status(400).send(error);
        return;
    }
    var query = "Update PointOfInterest SET views = views + 1 WHERE id = '" + req.body.poi_id + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.status(200).send("Changed Successfully");
        })
        .catch(function(err){
            res.status(400).send("False");
        })
}

function validateIncrease(req){
    if(req.body.poi_id === undefined || isNaN(req.body.poi_id))
        throw "Illegal Parameters";
}

exports.RandomPOI = RandomPOI;
exports.listAllPOIs = listAllPOIs;
exports.POIdata = POIdata;
exports.increaseViews = increaseViews;
