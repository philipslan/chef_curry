var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
    facebookId:     String,
    name:           String,
    email:          String,
    friends:        Array
});

module.exports = mongoose.model('User', UserSchema);