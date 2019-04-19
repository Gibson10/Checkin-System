var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    MessageId : String,
    message: {
        type: [String]
    },
    name: {
        type: [String]
    },
    email: {
        type: [String]
    },
    

});

module.exports = mongoose.model('Message', MessageSchema);


