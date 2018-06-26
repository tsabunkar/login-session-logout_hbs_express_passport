var mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

mongoose.Promise = global.Promise;
// const url = process.env.MONGODB_URI;
const url = 'mongodb://localhost:27017/mymongodb';


mongoose.connect(url);
//for production env, we are using the mongodb uri as -> process.env.MONGODB_URI

var userSchema = mongoose.Schema({
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

var User = mongoose.model('user_local_collec', userSchema);

var createUser = (newUserObj, callback) => {
    bcryptjs.genSalt(10, (err, salt) => {
        bcryptjs.hash(newUserObj.password, salt, (err, hash) => {
            newUserObj.password = hash;
            newUserObj.save(callback);
        });
    });

}
module.exports = {
    User,
    createUser
}