var fetchUrl   = require("fetch").fetchUrl,
    User       = require('../models/user'),
    Vote       = require('../models/vote'),
    Jobs       = require('../models/jobs'),
    Logs       = require('../models/Logs'),
    middleware = require('../middleware'),
    cryptto    = require("crypto"),
    express    = require("express"),
    moment    = require('moment'),
    router     = express.Router();
     moment().format();

 

var base_hash = "fngreurh389u4e82h8e42q0s@";

// Landing page route
router.get("/", middleware.isLoggedIn, function(req, res) {
 console.log(req.user.status );
    if (req.user.status ==  "safcorp"){
        
        res.redirect("/displayjob");


    }
    else if (req.user.status ==  "managers")
    {
        res.redirect("/managers");  
    }
    else{

        var approved ='';
        var monthr= '';

       

        var name= req.user.name;
        //    var ovaralla=[];
        console.log(name);
          

           Logs.find({name:name},
           function(err,logs) {
              var studentlogs =logs;
               for(i=0;i<logs.length; i++){
                //    console.log("Kirima",logs[i]._doc);
               }

           var job =req.user.job;

           console.log("ndutu",job);
            User.find({job:job}, function(err, users)
            {
                // console.log("alvin",users);

             var job1=users;



                if (err){
                    console.log("error");
                }
                
               else {
                  for (i=0; i<logs.length; i++)
                  {
                      
                     var status = logs[i]._doc.status;
                     var month= logs[i]._doc.month;
 
                     approved=status;
 
                     monthr=month;
                     
                     
                     
         
                  }
                 
                 //  console.log(logs);
               }
               console.log('jeez',approved);
               console.log('jaaz',monthr); 
 
               res.render("landing",{
                 approved:approved,
                 month:monthr,
                 job:job1,
                 studentlogs:studentlogs,
             }); 

            }
            );
            
              
             
             
           });

           
    

        
    }
    
});

//reset
router.get('/reset', function(req, res) {
	res.render('reset');
});

//sort
router.get('/sort', middleware.isLoggedIn, function(req, res) {
	res.render('sort');
});
//sort name
router.get('/sortname', middleware.isLoggedIn, function(req, res) {
	res.render('sortname');
});
//sort page for RAs
router.get('/rasorted', middleware.isLoggedIn, function(req, res) {
	res.render('rasorted');
});

//sort name
router.get('/sortall', middleware.isLoggedIn, function(req, res) {
	res.render('sortall');
});

//sort hlal
router.get('/sorthall', middleware.isLoggedIn, function(req, res) {
	res.render('sorthall');
});
//teacher on duty
router.get('/tod',middleware.isLoggedIn, function(req, res) {



    Logs.find({},function(err,logs){

        if(err){
            console.log("no logs found")
        }
        var endTimeString=[];
        var endTimeString2=[];
       
        for(i=0;i<logs.length;i++){
            // console.log(logs[i]._doc);
            var newdoc=logs[i]._doc;

            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            
            today = mm + '/' + dd + '/' + yyyy;
           console.log("leo",today);

            if (logs[i]._doc.status=="absent" && logs[i]._doc.date== today )
                                                        { 
              var endString = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;


             endTimeString.push(endString); //
             }
             else if(logs[i]._doc.status=="late" && logs[i]._doc.date== today ) {
                var endString2 = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '    ' +  logs[i]._doc.roomno + '    ' + logs[i]._doc.phoneno+ '  '+ logs[i]._doc.date +'   '  ;


                endTimeString2.push(endString2); 
             }
           
            
        }
        res.render('tod',{
            newdoc :endTimeString,
            newdoc2 :endTimeString2,
        });
    })
	
});

//get by name

router.post('/name',middleware.isLoggedIn, function(req, res) {
  var name=req.body.name;


    Logs.find({name:name},function(err,logs){

        if(err){
            console.log("no logs found")
        }

        var endTimeString=[];
        var endTimeString2=[];
      
        for(i=0;i<logs.length;i++){
            // console.log(logs[i]._doc);
            var newdoc=logs[i]._doc;

            
            if (logs[i]._doc.name==name && logs[i]._doc.status== "absent")
                                                        { 
              var endString = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;


             endTimeString.push(endString); //
             }
             
             else if(logs[i]._doc.name==name && logs[i]._doc.status== "late")
             var endString2 = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;


             endTimeString2.push(endString2); //

             {
               
             }
            
           
            
        }
        console.log("ndutu",endTimeString)
        res.render('sortname',{
            newdoc :endTimeString,
            newdoc2 :endTimeString2,
           
        });
    })
	
});


//get by hall

router.post('/hall',middleware.isLoggedIn, function(req, res) {
    var name=req.body.name;

    console.log("gibson",name);
  
  
      Logs.find({hall:name},function(err,logs){
  
          if(err){
              console.log("no logs found")
          }
  
          var endTimeString=[];
          var endTimeString2=[];
        
          for(i=0;i<logs.length;i++){
              // console.log(logs[i]._doc);
              var newdoc=logs[i]._doc;
  
              
              if (logs[i]._doc.hall==name && logs[i]._doc.status== "absent")
                                                          { 
                var endString = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;
  
  
               endTimeString.push(endString); //
               }
               
               else if(logs[i]._doc.hall==name && logs[i]._doc.status== "late")
               var endString2 = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;
  
  
               endTimeString2.push(endString2); //
  
               {
                 
               }
              
             
              
          }
          console.log("ndutu",endTimeString)
          res.render('sortname',{
              newdoc :endTimeString,
              newdoc2 :endTimeString2,
             
          });
      })
      
  });
  
  //get all


  router.post('/all',middleware.isLoggedIn, function(req, res) {
     
        Logs.find({},function(err,logs){
    
            if(err){
                console.log("no logs found")
            }
    
            var endTimeString=[];
            var endTimeString2=[];
          
            for(i=0;i<logs.length;i++){
                // console.log(logs[i]._doc);
                var newdoc=logs[i]._doc;
    
                
                if (logs[i]._doc.status== "absent")
                                                            { 
                  var endString = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;
    
    
                 endTimeString.push(endString); //
                 }
                 
                 else if(logs[i]._doc.status== "late")
                 var endString2 = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;
    
    
                 endTimeString2.push(endString2); //
    
                 {
                   
                 }
                
               
                
            }
            console.log("ndutu",endTimeString)
            res.render('sortall',{
                newdoc :endTimeString,
                newdoc2 :endTimeString2,
               
            });
        })
        
    });





//reset
router.get('/rapage',middleware.isLoggedIn, function(req, res) {




   var hall= req.user.hall;
   User.find({hall:hall},
    function(err,hall) {
     for(i=0; i<hall.length; i++)
     {
         console.log(hall[i]._doc.hall);
     } 

     res.render('rapage',{
      hall:hall,   
     });
    });
    
    
    
});

   
//resetpass
router.post('/resetpass', function(req, res) {

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
                to: req.body.email, // list of receivers
                subject: 'Email Verification', // Subject line
                html: '<p>Welcome to our Campus Job application.</p>' + 
                            '<p>Please copy the link below to reset your password  :</p>' + 
                            '<p>https://safcorp3.herokuapp.com/passwordreset</p>'
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                        return console.log(error);
                } else {
                 req.flash("success", "You will receive a link to your email with reset instructions");
                 res.redirect("/login"); 
                }
                
                
        });
        
});

});

//reset the password
router.get('/resetpassword', function(req, res) {
	res.render('resetpassword');
});


//reset the password post route
router.post('/resetpassword', function(req, res) {
    var email=req.body.email;
    var password=request.body.password;

    User.find({email:email},
        function() {
            
           
            if (err){
                console.log("error");
            }
            
           else {
              user.password=email;
              user.save();
              console.log("success","Your password has been updated");
           }
            
        });

	
});




//this route is for the safcorp SE admin side
router.get("/checkin",middleware.isLoggedIn,function(req, res) {
    var name=req.user.name;


    Logs.find({name:name},function(err,logs){

        if(err){
            console.log("no logs found")
        }

        var endTimeString=[];
        var endTimeString2=[];
      
        for(i=0;i<logs.length;i++){
            // console.log(logs[i]._doc);
            var newdoc=logs[i]._doc;

            
            if (logs[i]._doc.name==name && logs[i]._doc.status== "absent")
                                                        { 
              var endString = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;


             endTimeString.push(endString); //
             }
             
             else if(logs[i]._doc.name==name && logs[i]._doc.status== "late")
             var endString2 = '' + logs[i]._doc.name + ' - ' + logs[i]._doc.hall +'    ' + '   ' +  logs[i]._doc.roomno + '   ' + logs[i]._doc.phoneno+ '   '+ logs[i]._doc.date+ '   '  ;


             endTimeString2.push(endString2); //

             {
               
             }
            
           
            
        }
        console.log("ndutu",endTimeString)
        res.render('checkin',{
            newdoc :endTimeString,
            newdoc2 :endTimeString2,
           
        });
    })








    
});


router.get("/search",function(req, res) {
    res.render("search");
});






//route to approve
router.post("/absent", middleware.isLoggedIn, function(req, res) {

    var name= req.body.book_id;
    var status=req.body.status;
    console.log("jinga", status);
 //    var ovaralla=[];
 console.log(name);
     
    User.find({name:name},
    function(err,logs) {
        
       
        if (err){
            console.log("error");
        }
        
       else {
        //   console.log(logs);
          for(i=0;i<logs.length;i++){
              console.log(logs[i]._doc);
              var name=logs[i]._doc.name;
              var hall=logs[i]._doc.hall;
              var roomno =logs[i]._doc.roomno;
              var phoneno =logs[i]._doc.phoneno;

              var today = new Date();
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              
              today = mm + '/' + dd + '/' + yyyy;
             console.log("leo",today);

             Logs.findOneAndUpdate({name: name, date :today}, {$set:{status: status}}, {new: true}, (err, doc) => {
                if (err) {
                    console.log("Something wrong when updating data!");
                }
                 if(doc==null){
                    var absent = {
                        name: name,
                        hall : hall,
                        roomno :roomno ,
                        phoneno : phoneno, 
                        status : status,
                        date : today,  
                          
                    };  
                   Logs.create(absent, function(err, log) {
                       if (err) {
                           req.flash('error', 'An error seems to have occurred');
                           console.log("error has occured");
                           console.log(err.message);
                          
                       } 
                       
                       
                       req.flash('success', 'User was recorded absent');
                     
                   
                   });
                    
                 }
                console.log("mwangi",doc);
            });

            
              


          }
         //  console.log(logs);
       }
        
    });
 
 
 });













router.get("/userinfo", middleware.isLoggedIn, function(req, res) {

 var user=req.user;

    res.render("userinfo",{
        user:user,
    });
});






//checkin data
router.get("/checkindata", middleware.isLoggedIn, function(req, res) {
  
    var checkindata = [];
    
    User.find({}, function(err, checkin) {
        if (err){
            console.log("error");
        }
        
        for(i=0; i<checkin.length; i++ ){
            
            var userData = checkin[i]._doc;

            checkindata.push(userData);

            
        }

        res.json(
            checkindata 
        )
    });
});


// Vote Post Route





//Unhash post route


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }











module.exports = router;