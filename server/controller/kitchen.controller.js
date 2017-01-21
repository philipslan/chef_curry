var mongoose = require("mongoose");
var Kitchen = require("../models/kitchen");

module.exports.addKitchen = function (req, res) {
    var key = createKey();
    checkKey(key, function(validKey) {
        var kitchen = new Kitchen({
        	kitchenKey: validKey,
        	name: req.user.name,
        	fbid: req.user.facebookId
        });
        kitchen.
            save().
            then(function (kitchen) {
                res.json(kitchen);
            }).
            catch(function (err) {
                res.sendStatus(err);
            });
    });
}

module.exports.joinKitchen = function (req, res) {
    var kitchen = new Kitchen({
            kitchenKey: req.body.key,
            name: req.user.name,
            fbid: req.user.facebookId
    });
    kitchen.
        save().
        then(function (kitchen) {
            res.json(200);
        }).
        catch(function (err) {
            res.sendStatus(404);
        });
}

module.exports.findKey = function (req, res) {
    Kitchen.
        find({ kitchenKey: req.params.key }).
        exec().
        then(function (kitchens) {
            if (kitchens.length) {
                res.send(200);
            } else {
                res.send(402);
            }
        }).
        catch(function (err) {
            res.sendStatus(500);
        });
    
}

module.exports.getKitchens = function (req, res) {
    Kitchen.
        find({}).
        exec().
        then(function(kitchens) {
            res.json(kitchens);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.getKitchenByKey = function (req, res) {
    Kitchen.
        find({kitchenKey: req.params.kitchenKey}).
        exec().
        then(function(kitchens) {
            res.json(kitchens);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.getKitchenByFBID = function (req, res) {
    Kitchen.
        find({ 
        	fbid: req.user.facebookId
        }).
        exec().
        then(function(kitchens) {
            if (kitchens.length) {
            	res.json(kitchens[0]);
            } else {
            	res.json(req.user);
            }
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.editKitchen = function (req, res) {
    Kitchen. 
        findOneAndUpdate({key: req.body.key}, req.body).
        exec().
        then((kitchen) => {
            res.json(kitchen);
        }).
        catch((err) => {
            res.sendStatus(err);
        });
}

const choose = function (choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

const createKey = function () {
    var adjectives = ['creamy', 'spicy', 'sour', 'sweet', 'salty', 'moldy', 'bland', 'tasty', 'succulent', 'tender', 'rotten', 'disgusting', 'crunchy', 'chewy', 'pungent', 'tangy', 'hot'];
    var foods = ['spaghetti', 'sandwich', 'rice', 'corn', 'pasta', 'steak', 'cheese', 'tomato', 'banana', 'vegetable', 'potato', 'mushroom', 'peppers', 'goat', 'chicken', 'bread', 'pork', 'lamb', 'beef'];
    var kitchenKey = choose(adjectives) + "-" + choose(foods) + "-" + Math.round(Math.random() * 100);
    return kitchenKey;
}

const checkKey = function(kitchenKey, func) {
    Kitchen.
        find({"kitchenKey": kitchenKey}).
        exec().
        then(function(kitchens) {
            if (kitchens.length > 0) {
                var newKey = createKey();
                checkKey(newKey, func);
            } else {
                func(kitchenKey);
            }
        })

}