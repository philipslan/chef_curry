var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
	name: 		    String,
    friends:        Array,
    email:          String,
    facebookId:     String
});

module.exports = mongoose.model('User', UserSchema);