var mongoose = require("mongoose");
var Kitchen = require("../models/kitchen");

module.exports.addKitchen = function (req, res) {
    var key = createKey();
    checkKey(key, function(validKey) {
        Kitchen.
            findOneAndUpdate({name: req.user.name}, {
                kitchenKey: validKey
            }).
            exec().
            then(function (kitchen) {
                cookies[req.cookies.chef_curry].kitchenKey = validKey;
                res.json(kitchen);
            }).
            catch(function (err) {
                res.sendStatus(err);
            });
    });
}

module.exports.joinKitchen = function (req, res) {
    Kitchen.
        findOneAndUpdate({name: req.user.name}, {
            kitchenKey: req.body.key
        }).
        exec().
        then(function (kitchen) {
            cookies[req.cookies.chef_curry].kitchenKey = req.body.key;
            res.send(200);
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

module.exports.getKitchen = function (req, res) {
    res.json(req.user);
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