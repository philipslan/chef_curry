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

module.exports.addItem = function (req, res) {
    var item = new Item(req.body);
    item.
        save().
        then(function (item) {
            res.send(200);
        }).
        catch(function (err) {
            res.send(400);
        });
}

module.exports.editItem = function (req, res) {
    Item.
        findOneAndUpdate({
            ingredientName: req.body.ingredientName,
            kitchenKey: req.body.kitchenKey,
            nickName: req.body.nickName
        }, { 
            $dec: { 
                "quantity": 1
            }
        }).
        then(function (item) {
            res.send(200);
        }).
        catch(function (err) {
            res.send(400);
        });
}