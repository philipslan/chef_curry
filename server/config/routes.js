var userController = require('../controller/user.controller');

module.exports = function (app) {
	app.get("/user", userController.getUserByFBID);
	app.post("/user", userController.addUser);
}