var mongoose = require("mongoose");
var Item = require("../models/item");
var Alexa = require("../models/alexa");
var Link = require("../models/link");
var request = require("request");

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

module.exports.getItemsByAlexaId = function (req, res) {
    Alexa.
        find({alexaId:  req.params.alexaId}).
        exec().
        then(function(items) {
            if (items.length) {
                Item.
                    find({kitchenKey: items[0].kitchenKey}).
                    exec().
                    then(function(items) {
                        res.json(items);
                    }).
                    catch(function(err) {
                        res.sendStatus(err);
                    });
            } else {
                res.sendStatus(400);
            }
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
};

module.exports.addItem = function (req, res) {
	var obj = {
		kitchenKey: req.body.kitchenKey,
		ingredientName: req.body.ingredientName,
		nickName: req.body.nickName
	};
	Item.
		find(obj).
			exec().
			then(function(item) {
				if (item.length) {
					Item.
						update(obj,{
							$inc: {
								quantity: req.body.quantity
							}
						}).
						exec().
						then(function(item) {
							res.send(200);
						})
				} else {
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

module.exports.getKitchenKeyFromAlexa = function (req, res) {
    Alexa
        .findOne({alexaId:  req.params.alexaId})
        .exec()
        .then(function (kitchen) {
            res.json(kitchen.kitchenKey);
        })
        .catch(function (err) {
            res.send(400);
        });
}

module.exports.addLink = function (req, res) {
    var link = new Link(req.body);
    link.
        save().
        then(function (item) {
            res.send(200);
        }).
        catch(function (err) {
            res.send(400);
        });
}

module.exports.getRecipe = function (req, res) {
    request(req.body.url, function(error, response, body) {
        res.json(JSON.parse(body).recipes);
    });
}