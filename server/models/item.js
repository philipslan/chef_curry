var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema = new Schema({
	ingredientName: String,
	kitchenKey:     String,
	userName:  		String,
	quantity: 		Number,
	date: 			Date,
});

module.exports = mongoose.model('Item', ItemSchema);