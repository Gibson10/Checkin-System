var User       = require('../models/user'),
    nodemailer = require('nodemailer'),
    passport   = require('passport'),
    express    = require("express"),
    router     = express.Router();

// Register post route
router.post("/register23", function(req, res) {
   var newUser = new User({username: req.body.username, name: req.body.name});
   User.register(newUser, req.body.password, function(err, user) {
      if(err) {
          var emailErr = "E11000 duplicate key error"
          if(err.message.substring(0, emailErr.length) === emailErr) {
              return res.render("login", {"error": "A user with that email address or username already exists"});``
          } else {
              return res.render("login", {"error": err.message});
          }
      } else if (req.body.username.split('@').pop() != "alastudents.org") {
        req.flash("error", "Please use your ALA email");
        res.redirect("back");
      } else {
        passport.authenticate("local") (req, res, function() {
            user.hasVoted = false;
            user.hasConfirmed = "false";
            user.save();
            
            user.manager=req.body.manager;
            user.save();

            user.job=req.body.job;
            user.save();
            // Create user random id
            var randomUserId = makeid();
            user.randomUid = randomUserId;
            user.save();
            
              // Send user verification email
              nodemailer.createTestAccount((err, account) => {
  
                  // create reusable transporter object using the default SMTP transport
                  let transporter = nodemailer.createTransport({
                     service: "Gmail",
                     auth: {
                         user: "africanblockchaininitiative@gmail.com",
                         pass: "@Africa60"  
                     }
                  });
  
                  // setup email data with unicode symbols
                  let mailOptions = {
                      from: '"Campus Job" <africanblockchaininitiative@gmail.com>', // sender address
                      to: req.body.username, // list of receivers
                      subject: 'Email Verification', // Subject line
                      html: '<p>Welccome to Safcorp Campus Jobs</p>' + 
                            '<p>Please copy the link below to access your account :</p>' + 
                            '<p> http://' + req.headers.host + '/user/confirm/' + user._id + '/' + user.randomUid + '</p>'
                  };
  
                  // send mail with defined transport object
                  transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      
                     
                  });
                  req.flash("success", "Activation link has been sent to your ALA email address");
                  res.redirect("/login"); 
              });
        });
      }
   });
});


// Auth form route
router.get("/login3", function(req, res) {
   res.render("login3");
});







// Logout route
router.get("/logout3", function(req, res) {
   req.logout();
   res.redirect("/");
});

// Function to create random user id
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

module.exports = router;