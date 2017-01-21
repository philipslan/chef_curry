var mongoose = require("mongoose");
var User = require("../models/user");

module.exports.addUser = function (req, res) {
    var key = createKey();
    checkKey(key, function(validKey) {
        var user = new User({
        	kitchenKey: validKey,
        	name: req.user.name,
        	fbid: req.user.facebookId
        });
        user.
            save().
            then(function (user) {
                res.json(user);
            }).
            catch(function (err) {
                res.sendStatus(err);
            });
    });
}

module.exports.getUsers = function (req, res) {
    User.
        find({}).
        exec().
        then(function(users) {
            res.json(users);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.getUserByKey = function (req, res) {
    User.
        find({key: req.params.userKey}).
        exec().
        then(function(users) {
            res.json(users);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.getUserByFBID = function (req, res) {
    User.
        find({ 
        	fbid: req.user.facebookId
        }).
        exec().
        then(function(users) {
            if (users.length) {
            	res.json(users[0]);
            } else {
            	res.json(req.user);
            }
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.editUser = function (req, res) {
    User. 
        findOneAndUpdate({key: req.body.key}, req.body).
        exec().
        then((user) => {
            res.json(user);
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

const checkKey = function(userKey, func) {
    User.
        find({"kitchenKey": userKey}).
        exec().
        then(function(users) {
            if (users.length > 0) {
                var newKey = createKey();
                checkKey(newKey, func);
            } else {
                func(userKey);
            }
        })

}