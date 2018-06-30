var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', ensureAuthenticated, function (req, res, next) {

  res.render('index', {
    title: 'Personal Home Loan'
  });
});

function ensureAuthenticated(req, res, next) { //ensureAuthenticated() func is check wheather user has logged in before viewing home page
  if (req.isAuthenticated()) { //isAuthenticated() builtin method
    return next(); //if user had alreday logged in then only continue the flow of execution by caling next() method
  }
  res.redirect('/users/login')//user has not logged in soo redirect him to login page :)
}
 //code for handling  pagenotfound ie-> http://localhost:3000/pagenotfound
router.get('/pagenotfound', function (req, res, next) {
  res.sendFile('pagenotfound.html', {
    root: path.join(__dirname + '/../../public')  // response.sendfile('public/pagenotfound.html');
  });
});


module.exports = router;
