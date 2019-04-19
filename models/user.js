var passportLocalMongoose = require('passport-local-mongoose'),
    mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
   hasConfirmed: String,
   confirmUrl: String,
   username: {
       type: String,
       unique: true
   },
   name: {
       type: String,
       unique: true
   },


   password: String,
   randomUid: String,
   
   date : {
      type: Date,
      default: Date.now
   },
   
   status : String,
   roomno : String,
   hall: String,
   phoneno: String,
   resetPasswordToken: String,
   hash_id : String,
   resetPasswordExpires: Date
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);