var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GameSchema = new Schema({
    red:            Object,
    blue:           Object,
    name:           String,
    startTime:      Date,
    endTime:        Date,
    key:            String,
    winner: 		String
});

module.exports = mongoose.model('game', GameSchema);