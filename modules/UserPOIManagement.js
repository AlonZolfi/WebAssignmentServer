var DButilsAzure = require('./DButils');

function recommendedPOI(req, res) {
    var query = "SELECT interest " +
        "FROM UserInterests " +
        "WHERE username = '" + req.decoded.username + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            var categorySet = new Set();
            query = "SELECT id,name,image,category " +
                "FROM PointOfInterest " +
                "WHERE ";
            for (let i = 0; i < result.length-1; i++) {
                categorySet.add(result[i].interest);
                query += "category = '" + result[i].interest + "' ";
                query += "OR ";
            }
            categorySet.add(result[result.length-1].interest);
            query += "category = '" + result[result.length-1].interest + "'" + " ORDER BY rank DESC";
            DButilsAzure.execQuery(query)
                .then(function(result){
                    var recommendedPOIs = [];
                    let i = 0;
                    while(categorySet.size > 0 && recommendedPOIs.length < 2){
                        if(categorySet.has(result[i].category)) {
                            recommendedPOIs.push(result[i]);
                            categorySet.delete(result[i].category);
                        }
                        i++;
                    }
                    res.send(recommendedPOIs);
                })
                .catch(function(err){
                    res.status(400).send("False");
                });
        })
        .catch(function(err){
            res.send(err);
        });
}

function validateRank(req) {
    if(req.body.poi_id === undefined || isNaN(req.body.poi_id) || req.body.rank === undefined|| isNaN(req.body.rank) || req.body.review ===undefined)
        throw "Illegal Parameters";
    const num = parseInt(req.body.rank);
    if(num < 0 || num > 100)
        throw "Illegal Rank";
}

function rankPOI(req, res){
    try{
        validateRank(req);
    }
    catch(error){
        res.status(400).send(error);
        return;
    }
    var query = "SELECT * FROM PointOfInterest WHERE id = '" + req.body.poi_id + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            if(result.length==1) {
                var query = "INSERT INTO PointOfInterestReviews (poi_id, username, rank, review, tm_created) " +
                    "Values " +
                    "(" + req.body.poi_id +
                    ",'" + req.decoded.username + "'" +
                    "," + req.body.rank +
                    ",'" + req.body.review + "'" +
                    ",CONVERT(smalldatetime, CURRENT_TIMESTAMP)" +
                    "); ";
                DButilsAzure.execQuery(query)
                    .then(function() {
                        query = "SELECT AVG(rank) as rank FROM PointOfInterestReviews WHERE poi_id = " + req.body.poi_id;
                        DButilsAzure.execQuery(query)
                            .then(function (result) {
                                query = "UPDATE PointOfInterest SET rank =" + result[0].rank + " " +
                                    "WHERE id = " + req.body.poi_id;
                                DButilsAzure.execQuery(query)
                                    .then(function (result) {
                                        res.send("Added Successfully");
                                    })
                                    .catch(function (err) {
                                        res.status(400).send("False");
                                    });
                            })
                            .catch(function (err) {
                                res.send(err);
                            })
                    }).catch(function(err){
                        res.status(400).send(err);
                })
            }
        })
        .catch(function(err){
            res.send(err);
        });
}


function saveFavPOI(req, res){
    try{
        validateFavPOI(req);
    }
    catch(error){
        res.status(400).send(error);
        return;
    }
    var query = "SELECT * FROM PointOfInterest WHERE id = '" + req.body.poi_id + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            if(result.length==1){
                query = "INSERT INTO SavedPointOfInterest (poi_id, username, time) " +
                    "Values " +
                    "(" + req.body.poi_id +
                    ",'" + req.decoded.username+ "'" +
                    ",GETDATE()" +
                    ");";
                DButilsAzure.execQuery(query)
                    .then(function (result) {
                        res.status(201).send("Saved Successfully");
                    })
                    .catch(function (err) {
                        throw "False";
                    });
            }
        })
        .catch(function(err){
            res.send(err);
        });
}

function validateFavPOI(req) {
    if(req.body.poi_id === undefined || isNaN(req.body.poi_id))
        throw("Illegal Parameters")
}


function removeFavPOI(req, res){
    try{
        validateFavPOI(req);
    }
    catch(error){
        res.status(400).send(error);
        return;
    }
    var query = "DELETE FROM SavedPointOfInterest " +
        "WHERE " +
        "username = '" + req.decoded.username+ "'" +
        "AND " +
        "poi_id = " + req.body.poi_id + "";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send("Deleted Successfully");
        })
        .catch(function(err){
            res.status(400).send("False");
        });
}

function lastPOIsSaved(req, res){
    var query = "SELECT TOP 2 id,name,image,category " +
        "FROM SavedPointOfInterest " +
        "JOIN PointOfInterest " +
        "ON SavedPointOfInterest.poi_id = PointOfInterest.id " +
        "WHERE username = '" + req.decoded.username + "' " +
        "ORDER BY time DESC";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            res.status(400).send("False");
        });
}

function saveFavOrderOfPOI(req, res){
    var query = "SELECT * " +
        "FROM UserFavoriteOrder " +
        "WHERE username = '" + req.decoded.username + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            query = "";
            if(result.length > 0){
                query = "DELETE FROM UserFavoriteOrder " +
                    "WHERE username = '" + req.decoded.username + "'; ";
            }
            for (let i = 0; i < req.body.order.length; i++) {
                query += "INSERT INTO UserFavoriteOrder Values " +
                    "('" + req.decoded.username + "'" +
                    "," + req.body.order[i].poi_id +
                    "," + (i+1) +
                    "); ";
            }
            DButilsAzure.execQuery(query)
                .then(function(result){
                    res.status(201).send("Added Successfully")
                })
                .catch(function(err){
                    res.status(400).send("False");
                });
        })
        .catch(function(err){
            res.send(err);
        });
}

function listFavPOI(req, res){
    var query = "SELECT id,name,image,category,rank " +
        "FROM SavedPointOfInterest " +
        "JOIN PointOfInterest " +
        "ON SavedPointOfInterest.poi_id=PointOfInterest.id " +
        "WHERE username = '" + req.decoded.username + "'";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            res.status(400).send(err);
        });
}

function FavPOIOrder(req, res){
    var query = "SELECT id,name,image,category " +
        "FROM UserFavoriteOrder " +
        "JOIN PointOfInterest " +
        "ON UserFavoriteOrder.poi_id=PointOfInterest.id " +
        "WHERE username = '" + req.decoded.username + "' " +
        "ORDER BY UserFavoriteOrder.place ASC";
    DButilsAzure.execQuery(query)
        .then(function(result){
            res.send(result);
        })
        .catch(function(err){
            res.status(400).send(err);
        });
}

exports.rankPOI = rankPOI;
exports.saveFavPOI = saveFavPOI;
exports.removeFavPOI = removeFavPOI;
exports.recommendedPOI = recommendedPOI;
exports.lastPOIsSaved = lastPOIsSaved;
exports.saveFavOrderOfPOI = saveFavOrderOfPOI;
exports.listFavPOI = listFavPOI;
exports.FavPOIOrder = FavPOIOrder;
