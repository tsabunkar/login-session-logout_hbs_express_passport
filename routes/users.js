var express = require('express');
var router = express.Router();
var multer = require('multer');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var upload = multer({
  dest: './uploads'
}) //create a destination folder in developers m/c for all the files that end-user would be uploading

var {
  User,
  createUser,
  getUserById,
  getUserByEmailId,
  verifyPassword,

} = require('../models/user');

/* GET users listing. */
//localhost:3000/users
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//localhost:3000/users/register
router.get('/register', function (req, res, next) {
  res.render('register.hbs')
});

//localhost:3000/users/login
router.get('/login', function (req, res, next) {
  res.render('login.hbs', {
    loginmessages: req.flash('failuremessage')
  })
});



// action="/users/login" [http://localhost:3000/users/login]
//checking login creds using passportjs

/* router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username/password'
  }),
  function (req, res) {
    console.log('Success');
    req.flash('success', 'Your r now logged in successfully !!')
    res.redirect('/');
  }); */

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('failuremessage', 'Invalid username/password')
      res.redirect('/users/login');
      return
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Your r now logged in successfully !!')
      res.redirect('/');
      return
    });
  })(req, res, next);
});

//serialize and de-serialize
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  getUserById(id, function (err, user) {
    done(err, user);
  });
});


//using localStragey of passport to authorize
passport.use(new LocalStrategy({
  usernameField: "email" //by default localStartegy will authenticate username and password, but instead of username we want to authenticate email property, soo need to specifiy
  // passwordField : "password"
}, async (email, password, done) => {

  console.log(email);
  console.log(password);

  try {
    //find the user with the passed emailId
    const userObj = await User.findOne({ //NOTE : It was returning null object -> Found the solution by giving the second argum
      "email": email //check this property in user.js inside Model Schema defined
    }, function (err, obj) {
      console.log('fetching the obj from the entered emailID');
      console.log(obj);
    })

    //if not handle it, (invalid emailId)
    if (!userObj) {
      // req.flash('failuremessage', 'Unknown emailId');
      done(null, false, {
        failuremessage: 'Unknown emailId'
      })
      return
    }

    //if user is found, then check if the password is correct
    const isMatched = await userObj.isValidPassword(password);

    //if not handle it, (invalid password)
    if (!isMatched) { //password didn't match scenario
      // req.flash('failuremessage', 'Unknown password');
      done(null, false, {
        failuremessage: 'Invalid Password'
      })
      return
    }

    //thus success, valid credentials , pass the user object
    done(null, userObj);
  } catch (err) {
    done(err, false) //done callback fun returning false
  }

}))




// action="/users/register" [http://localhost:3000/users/register]
//body-parse cannot handle file upload, soo we r using 3rd party module called-multer
router.post('/register', upload.single('fileUploadId'), function (req, res, next) { //uploading single file
  // console.log(req.body.nameId);
  var nameId = req.body.nameId;
  // var fileUploadId = req.body.fileUploadId;
  var emailId = req.body.emailId;
  var mobileId = req.body.mobileId;
  var jobSelectedId = req.body.jobSelectedId;
  var passwordId = req.body.passwordId;
  var rePasswordId = req.body.rePasswordId;

  // console.log(req.file);//if it is multiple file upload then use req.files
  if (req.file) {
    console.log('uploading file...');
    var profileImage = req.file.filename;

  } else {
    console.log('No file is uploaded');
    var profileImage = 'noimage.jpg'; //showing default image, If end-user didn't upload the file
  }
  console.log(nameId, emailId, mobileId, jobSelectedId, passwordId, rePasswordId);
  console.log(profileImage);

  //form validators
  req.checkBody('nameId', 'Name field is required').notEmpty();
  req.checkBody('emailId', 'Email field is required').notEmpty();
  req.checkBody('emailId', 'Email is not in valid format').isEmail();
  req.checkBody('mobileId', 'Mobile field is required').notEmpty();
  req.checkBody('jobSelectedId', 'Professional dropdown is required').notEmpty();
  req.checkBody('passwordId', 'Password field is required').notEmpty();
  req.checkBody('rePasswordId', 'Password do not match').equals(req.body.passwordId);

  //check errors
  var errors = req.validationErrors();

  if (errors) {
    console.log('Errors has occured!!');
    res.render('register.hbs', {
      errors: errors
    })
  } else {
    console.log('No errors occured');
    var newUser = new User({
      username: nameId,
      email: emailId,
      mobile: mobileId,
      profileSelected: jobSelectedId,
      password: passwordId,
      profileImage: profileImage
    })

    createUser(newUser, (err, userObj) => {
      if (err) throw err
      console.log(userObj);
    })
    /*   newUser.save((err, userObj) => {
       
      }) */
    //once document is saved in saved in the collection, before redirecting to home page
    //show some message to end-client
    req.flash('success', 'You are now registered, can login now');
    res.location('/');
    res.redirect('/'); //redirect to home page

  }
});



module.exports = router;