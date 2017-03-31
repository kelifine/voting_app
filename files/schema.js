var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
   githubId: String,
   username: String,
   displayName: String
});

module.exports = mongoose.model('User', User);