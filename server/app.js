require('./configuration/config')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const hbs = require('hbs')

const session = require('express-session');
const passport = require('passport');

const flash = require('connect-flash');
const {
  mongoose
} = require('./db/mongoose_config');

const expressValidator = require('express-validator');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
hbs.registerPartials(path.join(__dirname , '../views/partials'))
hbs.localsAsTemplateData(app); //this is for Exposing locals variable as template data
//when we use app.locals & res.locals -> to set the global variable which can be used in Template engine (Handlebars)
app.locals.myName = '@Tejas Sabunkar Creations';

app.use(logger('dev')); //morgan's logger
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')));
// console.log(path.join(__dirname, 'public'));

//middleware for doing session's using ->(express-session, 3rd party libr)
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));

//middleware, doing end user authentication using ->(passport, 3rd party libr)
app.use(passport.initialize());
app.use(passport.session()); //telling passport to use session module

//middleware for validation using ->(express-validator, 3rd party libr)
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.'),
      root = namespace.shift(),
      formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

//middleware for messages(showing u have logged in successfully and u have logout popups) using -> (connect-flash , 3rd party module)
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res); //res.locals.messages -> this way we can create a global variable called (messages)
  /* console.log(res.locals.messages());
  console.log(res.locals); */
  next();
});

//creating a new global variable to hideout login btn when user has logged in
//and hideout logout btn when user has not loggedin/signin 
app.get('*', function (req, res, next) { //for all pages ->*
  let userObjectFetched = req.user;
  if (!userObjectFetched) { //userObjectFetched in undefined or null
    res.locals.userLoggedInObj = null;
  } else {
    res.locals.userLoggedInObj = userObjectFetched; //created global varaible-> isUserLoggedIn (it is an object type)
  }
  next();

});


app.use('/', indexRouter); //routing "localhost:3000/" to routes/index.js file
app.use('/users', usersRouter); //routing "localhost:3000/users" to routes/users.js file


//code for redirecting to pagenotfound, if invalid url
app.use(function (req, res, next) {
  let statusCodeVal = res.statusCode;

  if (statusCodeVal <= 200 || statusCodeVal > 200) {
    //whatever is the invalid url[or irrespective of invalid url] , just convert that url to this -> http://localhost:3000/pagenotfound url
    res.redirect(process.env.URL_404)    //this url response is handled in routes/index.js
  }
  // next(createError(404));
});



// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// app.listen(3000);

module.exports = app;