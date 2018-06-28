var mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

mongoose.Promise = global.Promise;
// const url = process.env.MONGODB_URI;
const url = 'mongodb://localhost:27017/mymongodb';


mongoose.connect(url);
//for production env, we are using the mongodb uri as -> process.env.MONGODB_URI

var UserSchema = mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String
    },
    email: {
        type: String,
        index: true //indexing email (soo that it will make sure uniqeness in collection) [go to robo mongo expand Indexes, u will find the email_1(which means index is applied to this property)]
    },
    profileImage: {
        type: String
    },
    mobile: {
        type: Number
    },
    profileSelected: {
        type: String
    }
});

UserSchema.methods.isValidPassword = async function (passwordEntered) {
    try {
        hashedPasswordFromDb = this.password; //bcoz password saved in the DB are in hashed format
        let PromiseObj = await bcryptjs.compare(passwordEntered, hashedPasswordFromDb)
        return PromiseObj; //promiseObj<boolean> is boolean type (i.e- true if passwordEntere == hashedPasswordFromDb )
    } catch (err) {
        throw new Error(err);
    }

}

var User = mongoose.model('user_local_collec', UserSchema);

var createUser = (newUserObj, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUserObj.password, salt, (err, hash) => {
            newUserObj.password = hash;
            newUserObj.save(callback);
        });
    });

}

var getUserById = (userId, callback) =>{
    User.findById(userId,callback);
}
/* var getUserByEmailId = (email, callback) =>{
    var query = {email : email}
    User.findOne(query, callback)
} */


module.exports = {
    User,
    createUser,
    getUserById,
    // getUserByEmailId
}