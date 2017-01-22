var kitchenController = require('../controller/kitchen.controller');
var itemController = require('../controller/item.controller');
var Kitchen = require('../models/kitchen');


module.exports = function (app) {
    cookies = {};
    kitchenController.createCookie();
    var getUserInfo = function (req, res, next) {
        req.user = cookies[req.cookies.chef_curry];
        next();
    }
    app.get('/', getUserInfo, function(req, res) {
        if (req.cookies.chef_curry && req.cookies.chef_curry in cookies) {
            res.render('index.html');
        } else {
            res.render('login.html');
        }
    });
    app.get("/create", function(req, res) {
        res.render('create.html');
    });
    app.post("/create", function(req, res) {
        Kitchen.
            find({
                name: req.body.name
            }).
            exec().
            then(function (user) {
                if (user.length) {
                    res.send(400);
                } else {
                    var kitchen = new Kitchen(req.body);
                    kitchen.
                        save().
                        then(function (kitchen) {
                            var cookie = kitchenController.createCookie();
                            cookies[cookie] = req.body;
                            res.json({
                                'chef_curry': cookie
                            });
                        }).
                        catch(function (err) {
                            res.send(400);
                        });
                }
            });
    });
    app.post("/login", function(req, res) {
        var uQuery = {
            kitchenKey: req.body.kitchenKey || "",
            name:       req.body.name
        }
        Kitchen.
            find(uQuery).
            exec().
            then(function (user) {
                if (user.length) {
                    var cookie = kitchenController.createCookie();
                    cookies[cookie] = uQuery;
                    res.json({
                        'chef_curry': cookie
                    });
                } else {
                    res.send(400);
                }
            });
    });

    app.post("/kitchen/alexa", kitchenController.addAlexa);
	app.get("/kitchen", getUserInfo, kitchenController.getKitchen);
	app.post("/kitchen", getUserInfo, kitchenController.addKitchen);
    app.post("/kitchen/auth", kitchenController.findKitchen);
    app.put("/kitchen", getUserInfo, kitchenController.joinKitchen);
    app.get("/kitchen/key/:key", getUserInfo, kitchenController.findKey);
    app.get("/items/:kitchenKey", itemController.getItemsByKitchenKey);
    app.get("/items/alexa/:alexaId", itemController.getItemsByAlexaId);
    app.post("/item", itemController.addItem);
    app.put("/item", itemController.decrementItem);
}