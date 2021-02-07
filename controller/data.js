const Data = require("../models/Data");

exports.ReadHomeDataLengthController = function(req, res) {
    const data = new Data(req.body);
    const { _id } = req.session.user;
    data.ReadHomeDataLength(_id).then(function(data) {
        return res.send(data);
    }).catch(() => res.send("failure"));
};