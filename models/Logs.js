var mongoose = require("mongoose");

var logSchema = new mongoose.Schema({
    
          name: String,
           hall:  String,
           roomno : String,
            phoneno : String,
            email : String, 
            status :String,
            date :String,
        
        
        
});

module.exports = mongoose.model("Log", logSchema);