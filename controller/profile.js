const Profile = require("../models/Profile");

exports.ReadUserProfileController = function(req, res) {
    const profile = new Profile(req.body);
    const { _id } = req.session.user;
    profile.ReadUserProfile(_id).then(function(data) {
        return res.send(data);
    }).catch(function(e) {
        return res.send(e);
    });
};

exports.UpdateUserProfileController = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const profile = new Profile(req.body);
        return profile.UpdateUserProfile(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send(JSON.stringify(e));
        });
    } else {
        return res.send("failure")
    }
};

exports.UpdateUserProfilePhotoController = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const profile = new Profile(req.body);
        return profile.UpdateUserProfilePhoto(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send("failure");
        });
    } else {
        return res.send("failure")
    }
};

exports.UpdateUserProfilePasswordController = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const profile = new Profile(req.body);
        return profile.UpdateUserProfilePassword(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send(e);
        });
    } else {
        return res.send("failure")
    }
};

exports.CloseAccountController = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const profile = new Profile(req.body);
        return profile.CloseAccount(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send("failure");
        });
    } else {
        return res.send("failure")
    }
};
