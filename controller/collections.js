const Collections = require("../models/Collections");

exports.UpdateCollectionsDataController = function(req, res) {
    const collections = new Collections(req.body);
    const { _id } = req.session.user;
    collections.UpdateCollectionsData(_id).then(() => {
        res.send("successfully");
    }).catch(() => {
        res.send("failure");
    });
};

exports.ReadUserCollectionsDataController = function(req, res) {
    const collections = new Collections(req.body);
    const { _id } = req.session.user;
    collections.ReadUserCollectionsData(_id).then(function(data) {
        return res.send(data);
    }).catch(() => res.send("failure"));
};
