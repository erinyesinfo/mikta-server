const Followings = require("../models/Followings");

exports.UpdateFollowingsDataController = function(req, res) {
    const followings = new Followings(req.body);
    const { _id } = req.session.user;
    followings.UpdateFollowingsData(_id).then(() => {
        res.send("successfully");
    }).catch(() => {
        res.send("failure");
    });
};

exports.ReadUserFollowingsDataController = function(req, res) {
    const followings = new Followings(req.body);
    const { _id } = req.session.user;
    followings.ReadUserFollowingsData(_id).then(function(data) {
        return res.send(data);
    }).catch(() => res.send("failure"));
};
