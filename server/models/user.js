var mongoose = require('mongoose');
const bcryptjs = require('bcryptjs')

const Schema = mongoose.Schema;

var UserSchema = new Schema({
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

UserSchema.pre('save', async function (next) {
    //not using fat arrow, bcoz using this keyword
    try {

        //Generate a salt
        const saltedVal = await bcryptjs.genSalt(10) //10 is the number of rounds
        //generate a password hashed (salt + hash)
        const hashedPassword = await bcryptjs.hash(this.password, saltedVal)
        //Re-assigning hashed version over original plain text password
        this.password = hashedPassword;
        next();
    } catch (err) {
        next(err)
    }
})


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


var getUserById = (userId, callback) => {
    User.findById(userId, callback);
}


module.exports = {
    User,
    getUserById,

}