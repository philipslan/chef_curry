var User = require("../models/user");
var Strategy = require('passport-facebook').Strategy;

module.exports = function (passport) {
    passport.use(new Strategy({
        clientID:       process.env.FACEBOOK_APP_ID,
        clientSecret:   process.env.FACEBOOK_APP_SECRET,
        callbackURL:    "http://localhost:8080/auth/facebook/callback",
        scope: ['user_friends'],
        profileFields: ['friends', 'email', 'displayName']
    }, function(accessToken, refreshToken, profile, cb){
        User.
            findOne({ facebookId: profile.id }).
            exec().
            then(function (user) {
                if (!user) {
                    var user = new User({
                        facebookId: profile.id,
                        name: profile.displayName,
                        email: profile._json.email,
                        friends: profile._json.friends.data
                    });
                    // Add your profile 
                    profile._json.friends.data.forEach(function (friend) {
                        User.findOneAndUpdate(
                            { facebookId: friend.id },
                            {
                                $push: { 
                                    "friends": { id: profile.id, name: profile.displayName }
                                }
                            }).exec();
                    });
                    user.
                        save().
                        then(function (user) {
                            return cb(null, user);
                        }).
                        catch(function (err) {
                            return cb(err);
                        });
                } else {
                    User.findOneAndUpdate({ facebookId: profile.id }, { friends: profile._json.friends.data }).exec();
                    return cb(null, user);
                }
            });
    }));
    passport.serializeUser(function(user, cb) {
        cb(null, user);
    });

    passport.deserializeUser(function(obj, cb) {
        cb(null, obj);
    });
}