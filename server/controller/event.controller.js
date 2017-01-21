var mongoose = require("mongoose");
var Event = require("../models/event");

module.exports.addEvent = function (req, res) {
    var event = new Event(req.body);
    event.
        save().
        then(function (event) {
            res.sendStatus(200);
        }).
        catch(function (err) {
            res.sendStatus(err);
        });
}

module.exports.getEvents = function (req, res) {
    Event.
        find({}).
        exec().
        then(function(event) {
            res.json(event);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.getEvents = function (req, res) {
    User.
        find({}).
        exec().
        then(function (events) {
            res.json(events);
        });
}