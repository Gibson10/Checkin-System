var User       = require('../models/user'),
    nodemailer = require('nodemailer'),
    passport   = require('passport'),
    express    = require("express"),
    router     = express.Router();

// Register post route
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username, name: req.body.name});
    User.register(newUser, req.body.password, function(err, user) {
       if(err) {
           var emailErr = "E11000 duplicate key error";
           if(err.message.substring(0, emailErr.length) === emailErr) {
               return res.render("login", {"error": "A user with that email address or username already exists"});
           } else {
               return res.render("login", {"error": err.message});
           }
        
       }
       else if (req.body.username.split('@').pop() != "alastudents.org") {
        req.flash("error", "Please use your ALA email");
        res.redirect("back");
       }
       else {
          
         passport.authenticate("local") (req, res, function() {
             user.hasVoted = false;
             user.hasConfirmed = "false";
             user.roomno=req.body.roomno;
             user.checkin="Not Checked In"
             user.hall=req.body.hall;
             user.phoneno=req.body.phoneno;
             user.status='user';
            
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
                       html: '<p>Welcome to our Campus Job application.</p>' + 
                             '<p>Please copy the link below to access your account :</p>' + 
                             '<p> http://' + req.headers.host + '/user/confirm/' + user._id + '/' + user.randomUid + '</p>'
                   };
   
                   // send mail with defined transport object
                   transporter.sendMail(mailOptions, (error, info) => {
                       if (error) {
                           return console.log(error);
                       } else {
                        req.flash("success", "Activation link has been sent to your ALA email address");
                        res.redirect("/login"); 
                       }
                       
                       
                   });
                   
               });
         });
       }
    });
 });

// Account Confirmation Route
router.get("/user/confirm/:id/:randomUid", function(req, res) {
    User.findById(req.params.id, function(err,  user) {
       if(err) {
           console.log(err);
           req.flash("error", "An error has occurred");
           res.redirect("/login2");
       } else {
           if(req.params.randomUid == user.randomUid) {
            user.hasConfirmed = "true";
            user.save();
            if (user.status == "RA"){
                console.log(user.status);
          req.flash("success", "You have been successfuly registered");
               res.redirect("/rapage");
            } else if(user.status == "user"){
                res.redirect("/checkin");
            } 
            else{
                res.redirect("/");
            }
           } else {
               req.flash("error", "Your activation link has an error");
               res.redirect("/login2");
           }
       }
    });
});

// Auth form route
router.get("/login", function(req, res) {
   res.render("login");
});

router.get("/login3", function(req, res) {
    res.render("login3");
 });



// Update form route
router.post("/update", function(req, res) {
  
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

// Login post route
router.post('/login', function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.render('login', {"error": "t  Username or password is incorrect"}); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      
      if(req.user.status == 'RA')
      {
          console.log(req.body.status);

         res.redirect("/rapage");

       }
       else if(req.user.status == 'tod'){

        res.redirect("/tod"); 
        console.log(req.body.status);
      }
      else {
        // redirectTo = req.session.redirectTo ? req.session.redirectTo : '/login'; 
        res.redirect("/checkin"); 
      };
      console.log(req.body.username);
      console.log(req.body.password);
      console.log(user.password);
      delete req.session.redirectTo;
      if(user.hasConfirmed == "false") {
        req.flash("error", "Please confirm the email");
        res.redirect("/login");
      }

    //    res.redirect(redirectTo);    
    });
  })(req, res, next);
});

// Logout route
router.get("/logout", function(req, res) {
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