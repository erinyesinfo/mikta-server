const Account = require("../models/Account");

exports.updateAccount = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const account = new Account(req.body);
        return account.updateUserAccount(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send(JSON.stringify(e));
        });
    } else {
        return res.send("failure")
    }
};

exports.updateAccountPhoto = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const account = new Account(req.body);
        return account.updatePhoto(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send("failure");
        });
    } else {
        return res.send("failure")
    }
};

exports.updateAccountPassword = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const account = new Account(req.body);
        return account.updateUserPassword(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send(e);
        });
    } else {
        return res.send("failure")
    }
};

exports.closeAccount = function(req, res) {
    if (req.session.user) {
        const { _id } = req.session.user;
        const account = new Account(req.body);
        return account.closeUserAccount(_id).then(function(data) {
            res.send(data);
        }).catch(function(e) {
            res.send("failure");
        });
    } else {
        return res.send("failure")
    }
};
