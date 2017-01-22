var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();
var promise = require('bluebird');
mongoose.Promise = promise;

var dbURI = process.env.CHEF_CURRY_DB;
mongoose.connect(dbURI);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser("chef_curry"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/app');
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// routes
require('./server/config/routes')(app);

// Setup Application Port and Open Views.
app.set('port',(process.env.PORT || 8080));
app.use('/app',express.static(__dirname + "/app"));

app.listen(app.get('port'), function(){
    console.log("Listening on port", app.get('port'));
});
