var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var AlexaSchema = new Schema({
	alexaId: 	String,
	kitchenKey: String,
	cookie: 	String,
});

module.exports = mongoose.model('Alexa', AlexaSchema);