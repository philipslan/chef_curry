module.exports = function (app, passport) {
    // Root
    app.get('/', function(req, res) {
        if (req.user) {
            res.render('index.html', {
                user: req.user
            });
        } else {
            res.render('login.html', {
                messages: null || req.flash('error')
            });
        }
    });
    // FB Auth
    app.get('/auth/facebook',
        passport.authenticate('facebook'));
    // Callback
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash: true
        }),
        function(req, res) {
            res.send({status: 'ok'});
        });
    // Logout
    app.post("/auth/logout", function(req, res) {
        req.session.destroy();
        req.logout();
        res.redirect('/');
    });
}