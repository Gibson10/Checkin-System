var User    = require('../models/user'),
    nodemailer = require('nodemailer'),
    passport   = require('passport'),
    middlesaf = require('../middlesaf'),
    express    = require("express"),
    router     = express.Router();




router.post("/register1", function(req, res) {
	var newUser = new User({
		username: req.body.username,
		name: req.body.name
	});

	if(req.body.code != "10807") {
       
		req.flash("error","Your Unique code is wrong");
		res.redirect("back");
		return;
}
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			var emailErr = "E11000 duplicate key error"
			if (err.message.substring(0, emailErr.length) === emailErr) {
				return res.render("login", {
					"error": "A user with that email address or username already exists"
				});
			} else {
				return res.render("login", {
					"error": err.message
				});
			}
		} 
		  //  else if (req.body.username!= "safcorp@alastudents.org") {
      //   req.flash("error", "Please use your safcorp email ");
      //   res.redirect("back");
      //  }
		
		
		else {
			passport.authenticate("local")(req, res, function() {

			user.hasConfirmed = "false";
            user.save();
						user.hall=req.body.hall;
						user.status='RA';
						user.roomno=req.body.roomno;
						user.phoneno=req.body.phoneno;
						user.save();
					

            console.log(req.body.password);
            console.log(user.status);
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
						html: '<p>Welcome to campus job application.</p>' +
							'<p>Please copy the link below to access your account :</p>' +
							'<p> http://' + req.headers.host + '/user/confirm/' + user._id + '/' + user.randomUid + '</p>'
					};

					// send mail with defined transport object
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							return console.log(error);
						}

					
					});
					req.flash("success", "Activation link has been sent to your Safcorp email address");
					res.redirect("/login");
				});
			});
		}
	});
});





// Auth form route
router.get("/login2", function(req, res) {
   res.render("login2");
});



// Update form route
router.post("/update1", function(req, res) {
  
      email=req.body.username;
      passwordold =req.body.passwordold;
      passwordnew =req.body.passwordnew;
      name= req.body.name;


      if(req.user.password == passwordold){

        req.user.username=email;
        req.user.password=passwordnew;
        req.user.name=name;
        req.user.save();
  
        res.redirect("back");
      } else{
          req.flash('error',"Your old password is incorrect, try again");
          res.redirect("back");
      }
     

 });



// Logout route
router.get("/logout1", function(req, res) {
   req.logout();
   res.redirect("/login2");
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