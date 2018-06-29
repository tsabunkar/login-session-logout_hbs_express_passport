var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: './uploads'
}) //create a destination folder in developers m/c for all the files that end-user would be uploading

const userController = require('../controllers/userController')
const passportConfigu = require('../passportConfigu')

/* GET users listing. */
//localhost:3000/users
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//localhost:3000/users/register
router.get('/register', function (req, res, next) {
  res.render('register.hbs', {
    emailalreadyexistmessage: req.flash('emailexistmessage')
  })
});

//localhost:3000/users/login
router.get('/login', function (req, res, next) {
  res.render('login.hbs', {
    loginmessages: req.flash('failuremessage'),
    logoutmessages: req.flash('successmessage')
  })
});


// action="/users/login" [http://localhost:3000/users/login]
router.post('/login', passportConfigu.passportAuthenticateLogin)


// action="/users/register" [http://localhost:3000/users/register]
//body-parse cannot handle file upload, soo we r using 3rd party module called-multer
router.post('/register', upload.single('fileUploadId'), userController.signUp);

//http://localhost:3000/users/logout
router.get('/logout', userController.signOut)

module.exports = router;