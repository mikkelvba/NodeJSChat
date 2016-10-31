(function () {
    'use strict';

    var Mongoose 	= require('mongoose');
    // Bcryup -> hash/salt password

    var bcrypt      = require('bcrypt-nodejs');

    // Const -> should not be changed
    const SALTROUNDS = 10;
    const DEFAULT_USER_PICTURE = '/img/p-image.jpg';

    // If user is registered through the application, user gets a password and socialId = null
    // If user is registered through facebook/twitter, user get a socialId with value from Passport.js, password = null


    var UserSchema = new Mongoose.Schema({
        username: { type: String, required: true, unique: true, dropDups: true},
        password: { type: String, default: null },
        socialId: { type: String, default: null },
        picture:  { type: String, default:  DEFAULT_USER_PICTURE}
    });

    // if user.picture is empty, he/she gets a default image

    UserSchema.pre('save', function(next) {
        var user = this;

        // If image not defined -> DEFAULT_USER_PICTURE
        // Const - value should not be changed
        if(!user.picture){
            user.picture = DEFAULT_USER_PICTURE;
        }

        if (!user.isModified('password')) return next();

        bcrypt.genSalt(SALTROUNDS, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, null, function(err, hash) {
                if (err) return next(err);

                user.password = hash;
                next();
            });
        });
    });

    // Validate user password

    UserSchema.methods.validatePassword = function(password, callback) {
        bcrypt.compare(password, this.password, function(err, isMatch) {
            if (err) return callback(err);
            callback(null, isMatch);
        });
    };

    // Create User Schema
    var userModel = Mongoose.model('user', UserSchema);

    // Export userModel
    module.exports = userModel;
}());
