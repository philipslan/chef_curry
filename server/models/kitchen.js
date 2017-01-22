var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var KitchenSchema = new Schema({
	name: 		    String,
	nickname: 		String,
    kitchenKey:     String,
});

module.exports = mongoose.model('Kitchen', KitchenSchema);