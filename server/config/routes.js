var kitchenController = require('../controller/kitchen.controller');

module.exports = function (app) {
	app.get("/kitchen", kitchenController.getKitchenByFBID);
	app.post("/kitchen", kitchenController.addKitchen);
    app.post("/kitchen/join", kitchenController.joinKitchen);
    app.get("/kitchen/key/:key", kitchenController.findKey);
}