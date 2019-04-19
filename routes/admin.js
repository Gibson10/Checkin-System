var Article = require('../models/article'),
	Admin = require('../models/article'),
	nodemailer = require('nodemailer'),
	passport = require('passport'),
    express = require("express"),
    middleware = require('../middleware'),
	router = express.Router();

// Configure multer and cloudinary
var multer = require('multer');
var storage = multer.diskStorage({
	filename: function(req, file, callback) {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = function(req, file, cb) {
	// accept image file(s) only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({
	storage: storage,
	fileFilter: imageFilter
})

var cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: "drare428p",
	api_key: "866953249176446",
	api_secret: "FdP6-RScsdlbwErByHNGJDF3bg0"
});


/***************************************************************
// ADMIN AUTHENTICATION

// Route to register admin ()
****************************************************************/

// Route to add new article
router.get('/createjobs',middleware.isLoggedIn, function(req, res) {
	res.render('jobzz');
});


router.get('/applyjob', function(req, res) {
	res.render('applyjob');
});
router.get('/signup', function(req, res) {
	res.render('signup');
});

// News route
router.get("/newjobs", function(req, res) {
	Article.find({}).sort({
		date: -1
	}).exec(function(err, articles) {
		if (err) {
			req.flash("error", "An error has occurred");
			res.redirect("back");
		} else {
			console.log(articles);
			res.render("newjobs", {
				articles: articles
			});
		}
	});
});

// Post route to add new article
router.post('/admin/jobs/add', upload.single('image'), function(req, res) {
	var filepath = undefined;

	cloudinary.uploader.upload(req.file.path, function(result) {
		filepath = result.secure_url;
		var article = {
			name: req.body.name,
			subject: req.body.subject,
			article: req.body.article,
            url: req.body.url,
            hours:req.body.hours,
            pay: req.body.pay,
            status: "open",
			image: filepath
		};

		Article.create(article, function(err, book) {
			if (err) {
				req.flash('error', 'An error seems to have occurred');
				return res.redirect('/admin/news/add');
			} 
		
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
						to: req.body.subject, // list of receivers
						subject: 'Email Verification', // Subject line
						html: '<p>Welcome to our Campus Job application.</p>' + 
									'<p>Please copy the link below to access the new job  :</p>' + 
									'<p>https://safcorp3.herokuapp.com/newjobs</p>'
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

			req.flash('success', 'Your article has been successfuly added');
			res.redirect('/createjobs')
		});
	});
});


function makeid() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (var i = 0; i < 5; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
  }

module.exports = router;