var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: './uploads'
}) //create a destination folder in developers m/c for all the files that end-user would be uploading

var {
  User,
  createUser
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
  res.render('login.hbs')
});

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

    newUser.save((err, userObj) => {
      if (err) throw err
      console.log(userObj);
    })
//once document is saved in saved in the collection, before redirecting to home page
//show some message to end-client
    req.flash('success', 'You are now registered, can login now')

    res.location('/');
    res.redirect('/'); //redirect to home page

  }


});

module.exports = router;