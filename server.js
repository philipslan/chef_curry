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
var options = { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },  
                replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS : 30000 } }};
mongoose.connect(dbURI, options);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname + '/app');
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(cookieParser(process.env.BEACON_SECRET));
app.use(session({
    secret: process.env.BEACON_SECRET,
    name: 'beacon',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ 
        mongooseConnection: mongoose.connection,
        ttl: 14 * 24 * 60 * 60
    })
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Using Facebook Passport
require('./server/config/passport')(passport);
require('./server/config/passport-routes')(app, passport);

// routes
require('./server/config/routes')(app);

// Setup Application Port and Open Views.
app.set('port',(process.env.PORT || 8080));
app.use('/app',express.static(__dirname + "/app"));

app.listen(app.get('port'), function(){
    console.log("Listening on port", app.get('port'));
});
