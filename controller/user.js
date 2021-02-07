const User = require("../models/User");

exports.login = function(req, res) {
    const user = new User(req.body);
    user.login().then(function(filterData) {
        let day = 1000 * 3600 * 24;
        req.session.cookie.expires = new Date(Date.now() + day);
        req.session.cookie.maxAge = day;
        req.session.cookie.httpOnly = true;
        req.session.user = JSON.parse(filterData);
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
    user.register().then(filterData => {
        let day = 1000 * 3600 * 24;
        req.session.cookie.expires = new Date(Date.now() + day);
        req.session.cookie.maxAge = day;
        req.session.cookie.httpOnly = true;
        req.session.user = JSON.parse(filterData);
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
        return res.send(JSON.stringify(req.session.user));
    } else {
        return res.send("failure");
    }
};
