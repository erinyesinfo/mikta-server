const Shared = require("../models/Shared");

exports.UpdateSharedDataController = function(req, res) {
    const shared = new Shared(req.body);
    const { _id } = req.session.user;
    shared.UpdateSharedData(_id).then(() => {
        res.send("successfully");
    }).catch(() => {
        res.send("failure");
    });
};

exports.ReadUserSharedDataController = function(req, res) {
    const shared = new Shared(req.body);
    const { _id } = req.session.user;
    shared.ReadUserSharedData(_id).then(function(data) {
        return res.send(data);
    }).catch(() => res.send("failure"));
};
