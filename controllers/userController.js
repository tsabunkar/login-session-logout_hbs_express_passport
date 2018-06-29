const {
    User
} = require('../models/user');

var signUp = async (req, res, next) => {
    //email and password

    var nameId = req.body.nameId;
    // var fileUploadId = req.body.fileUploadId;
    var emailId = req.body.emailId;
    var mobileId = req.body.mobileId;
    var jobSelectedId = req.body.jobSelectedId;
    var passwordId = req.body.passwordId;
    var rePasswordId = req.body.rePasswordId;

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
        const foundUser = await User.findOne({ //wait here untill u finsh this task -> of finding the emai property from mongodb
            "email": emailId
        })
        if (foundUser) { //check if the user with same emaiId present in the DB
            /*  res.status(409).json({
                 error: 'Email already exist in the DB'
             }) */
            req.flash('emailexistmessage', 'EmailId already exist, please register with different email');
            res.location('/users/register');
            res.redirect('/users/register');
            return
        }

        var newUser = new User({
            username: nameId,
            email: emailId,
            mobile: mobileId,
            profileSelected: jobSelectedId,
            password: passwordId,
            profileImage: profileImage
        })

        await newUser.save();

        //once document is saved in saved in the collection, before redirecting to home page
        //show some message to end-client
        req.flash('successmessage', 'You are now registered, can login now');
        res.location('/users/login');
        res.redirect('/users/login'); //redirect to home page
        /*  res.json({ //sending a response to user, saying the user object is created
             user: 'created',
             token: signedTokenVal
         }) */

    }


}

var signOut = (req, res) => {
    req.logout(); //logout() is builtin method for logout
    req.flash('successmessage', 'You have logged-out successfully');
    res.redirect('/users/login')
}

module.exports = {
    signUp,
    signOut
}