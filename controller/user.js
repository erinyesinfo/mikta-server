const User = require("../models/User");

exports.login = function(req, res) {
    const user = new User(req.body);
    user.login().then(function(id) {
        let day = 1000 * 3600 * 24;
        req.session.cookie.expires = new Date(Date.now() + day);
        req.session.cookie.maxAge = day;
        req.session.cookie.httpOnly = true;
        req.session.user = { _id: id, username: user.data.username };
        req.session.save(() => res.send("success"));
    }).catch(function(e) {
        res.send(e);
    });
};

exports.logout = function(req, res) {
    req.session.destroy(() => res.send("success"));
};

exports.register = function(req, res) {
    const user = new User(req.body);
    user.register().then((id) => {
        let day = 1000 * 3600 * 24;
        req.session.cookie.expires = new Date(Date.now() + day);
        req.session.cookie.maxAge = day;
        req.session.cookie.httpOnly = true;
        req.session.user = { _id: id, username: user.data.username };
        req.session.save(() => res.send("success"));
    }).catch(regErrors => {
        res.send(JSON.stringify(regErrors));
    });
};

exports.home = function(req, res) {
    if (req.session.user) {
        res.render("home", { user: req.session.user });
    } else {
        res.render("home", { user: null });
    }
};

exports.userLogedIn = function(req, res) {
    if (req.session.user) {
        return res.send("success");
    } else {
        return res.send("failure");
    }
};

exports.readUserData = function(req, res) {
    const user = new User(req.body);
    if (req.session.user) {
        const { _id } = req.session.user;
        return user.getData(_id).then(function(data) {
            res.send(JSON.stringify(data));
        }).catch(function(e) {
            res.send("failure");
        });
    } else {
        return res.send("failure");
    }
};
