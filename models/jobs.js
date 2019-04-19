

var mongoose = require('mongoose');

var JobSchema = new mongoose.Schema({
   name: String,
   job:  String,
   start : String,
   end : String,
   total :String,
    

});

module.exports = mongoose.model('Job',JobSchema);