var mongoose = require("mongoose");
var User = require("../models/user");

module.exports.addUser = function (req, res) {
    var user = new User(req.body);
    user.
        save().
        then(function (user) {
            res.json(user);
        }).
        catch(function (err) {
            res.sendStatus(404);
        });
}

module.exports.findUser = function (req, res) {
    User.
        findOne(req.body).
        exec().
        then(function (user) {
            res.send(user._id);
        }).
        catch(function (err) {
            res.sendStatus(404);
        });
}

module.exports.getUsers = function (req, res) {
    User.
        find({}).
        exec().
        then(function (users) {
            res.json(users);
        });
}