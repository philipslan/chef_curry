module.exports = function (app) {
	app.get("/whoami", function(req, res) {
        res.json(req.user);
    })
}