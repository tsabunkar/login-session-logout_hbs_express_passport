const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {
    User,
    getUserById
} = require('./models/user')


//checking login creds using passportjs

/* router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: 'Invalid username/password'
  }),
  function (req, res) {
    console.log('Success');
    req.flash('messages', 'Your r now logged in successfully !!')
    res.redirect('/');
  }); */

//enveloping  passport.authenticate('local', ) this function with another function passportAuthenticateLogin() -> to get req, resp, next arguments
var passportAuthenticateLogin = function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('failuremessage', 'Invalid username/password')
            res.redirect('/users/login');
            return
        }
        req.logIn(user, function (err) { // req.logIn() -> logIn() method (builtin method for login)
            if (err) {
                return next(err);
            }
            req.flash('messages', 'Your r now logged in successfully !!') //this message is not prinitng
            res.redirect('/'); //redirect to home page
            return
        });
    })(req, res, next);
}


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
    usernameField: "email", //by default localStartegy will authenticate username and password, but instead of username we want to authenticate email property, soo need to specifiy
    // passwordField : "password"
    passReqToCallback: true
}, async (req, email, password, done) => {

    console.log(email);
    console.log(password);

    try {
        //find the user with the passed emailId
        const userObj = await User.findOne({ //NOTE : It was returning null object -> Found the solution by giving the second argum
            "email": email //check this property in user.js inside Model Schema defined
        }, function (err, obj) {
            console.log(obj);
        })

        //if not handle it, (invalid emailId)
        if (!userObj) {
            req.flash('failuremessage', '(Unknown emailId) ');
            done(null, false)
            return
        }

        //if user is found, then check if the password is correct
        const isMatched = await userObj.isValidPassword(password);

        //if not handle it, (invalid password)
        if (!isMatched) { //password didn't match scenario
            req.flash('failuremessage', '(Invalid password)');
            done(null, false)
            return
        }

        //thus success, valid credentials , pass the user object
        done(null, userObj);
    } catch (err) {
        done(err, false) //done callback fun returning false
    }

}))

module.exports = {
    passportAuthenticateLogin
}