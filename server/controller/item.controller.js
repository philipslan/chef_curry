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
	Item.
		findOneAndUpdate({
				kitchenKey: req.body.kitchenKey,
				ingredientName: req.body.ingredientName,
				nickName: req.body.nickName
			}, {
				$inc: {
					quantity: req.body.quantity
				}
			}).
			exec().
			then(function(item) {
				if (!item.length) {
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
			}).
			catch(function (err) {
				res.send(400);
			});
}

module.exports.decrementItem = function (req, res) {
    Item.
        findOneAndUpdate({
            ingredientName: req.body.ingredientName,
            kitchenKey: req.body.kitchenKey,
            nickName: req.body.nickName
        }, { 
            $inc: { 
                quantity: -req.body.quantity
            }
        }).
        exec().
        then(function (item) {
            res.send(200);
        }).
        catch(function (err) {
            res.send(400);
        });
}