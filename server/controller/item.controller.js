var mongoose = require("mongoose");
var Item = require("../models/item");

module.exports.getItemsByKitchenKey = function (req, res) {
    Item.
        find({kitchenKey: req.params.kitchenKey}).
        exec().
        then(function(items) {
            res.json(items);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
};