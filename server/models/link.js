var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var LinkSchema = new Schema({
    url:           String,
    kitchenKey:     String
});

module.exports = mongoose.model('Link', LinkSchema);