var mongoose = require("mongoose");
var Game = require("../models/game");

module.exports.addGame = function (req, res) {
    var key = createKey();
    checkKey(key, function(validKey) {
        req.body.key = validKey;
        var game = new Game(req.body);
        game.
            save().
            then(function (game) {
                res.json(game);
            }).
            catch(function (err) {
                res.sendStatus(err);
            });
    });
}

module.exports.getGames = function (req, res) {
    Game.
        find({}).
        exec().
        then(function(games) {
            res.json(games);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.getGameByKey = function (req, res) {
    Game.
        find({key: req.params.gameKey}).
        exec().
        then(function(games) {
            res.json(games);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.getGameById = function (req, res) {
    Game.
        find({_id: req.params.id}).
        exec().
        then(function(games) {
            res.json(games);
        }).
        catch(function(err) {
            res.sendStatus(err);
        });
}

module.exports.editGame = function (req, res) {
    Game. 
        findOneAndUpdate({key: req.body.key}, req.body).
        exec().
        then((game) => {
            res.json(game);
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
    var sumName = ['lux', 'teemo', 'missfortune', 'nautilius', 'ivern', 'gragas', 'fizz', 'annie', 'ashe', 'garen', 'varus', 'ryze', 'wukong', 'kennen', 'rumble', 'vi', 'caitlyn', 'ezreal', 'twitch', 'akali', 'katarina'];
    var adjectives = ['happy', 'sad', 'funny', 'able', 'active', 'any', 'cool', 'corny', 'cold', 'hot', 'icy', 'dead', 'nick', 'dry', 'dull', 'fresh', 'full', 'fast', 'far', 'flat', 'glass', 'half', 'hard', 'moral', 'male', 'meek', 'moist', 'nice', 'old', 'oily'];
    var gameKey = choose(adjectives) + "-" + choose(sumName);
    return gameKey;
}

const checkKey = function(gameKey, func) {
    Game.
        find({key: gameKey}).
        exec().
        then(function(games) {
            if (games.length > 0) {
                var newKey = createKey();
                checkKey(newKey, func);
            } else {
                func(gameKey);
            }
        })

}