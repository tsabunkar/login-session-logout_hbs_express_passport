var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated ,function (req, res, next) {
  
  res.render('index', {
    title: 'Personal Home Loan'
  });
});

function ensureAuthenticated(req,res,next) { //ensureAuthenticated() func is check wheather user has logged in before viewing home page
  if(req.isAuthenticated()){ //isAuthenticated() builtin method
    return next(); //if user had alreday logged in then only continue the flow of execution by caling next() method
  }
  res.redirect('/users/login')//user has not logged in soo redirect him to login page :)
}


module.exports = router;
