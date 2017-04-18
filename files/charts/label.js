var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Label = new Schema({
   owner: String,
   users: Array,
   type: {type: String, default: 'pie'},
    data: {
            labels: Array,
            data: Array
        },
   options: {
            title: String,
            },
});

module.exports = mongoose.model('Label', Label);
