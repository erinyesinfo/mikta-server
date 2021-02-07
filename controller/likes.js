const Likes = require("../models/Likes");

exports.UpdateLikesDataController = function(req, res) {
    const likes = new Likes(req.body);
    const { _id } = req.session.user;
    likes.UpdateLikesData(_id).then(() => {
        res.send("successfully");
    }).catch(() => {
        res.send("failure");
    });
};

exports.ReadUserLikesDataController = function(req, res) {
    const likes = new Likes(req.body);
    const { _id } = req.session.user;
    likes.ReadUserLikesData(_id).then(function(data) {
        return res.send(data);
    }).catch(() => res.send("failure"));
};
