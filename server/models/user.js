var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema = new Schema({
	name: 		    String,
	fbid: 			String,
    kitchenKey:     String,
});

module.exports = mongoose.model('User', UserSchema);