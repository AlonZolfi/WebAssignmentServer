var DButilsAzure = require('./DButils');

function rankPOI(req, res){
    var query = "INSERT INTO PointOfInterestReviews (poi_id, username, rank, review) " +
        "Values " +
        "('" + req.body.poi_id+ "'" +
        ",'" + req.decoded.username+ "'" +
        ",'" + req.body.rank+ "'" +
        ",'" + req.body.review+ "'" +
        ");";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
}

function saveFavPOI(req, res){
    var query = "INSERT INTO SavedPointOfInterest (poi_id, username, time) " +
        "Values " +
        "('" + req.body.poi_id+ "'" +
        ",'" + req.decoded.username+ "'" +
        ",'" + Date.now() + "'" +
        ");";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
}

function removeFavPOI(req, res){
    var query = "DELETE FROM SavedPointOfInterest " +
        "WHERE " +
        "username = '" + req.decoded.username+ "'" +
        "AND " +
        "poi_id = '" + req.body.poi_id + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            console.log(err);
            res.send(err);
        })
}

exports.rankPOI = rankPOI;
exports.saveFavPOI = saveFavPOI;
exports.removeFavPOI = removeFavPOI;
