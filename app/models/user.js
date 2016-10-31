(function () {
    'use strict';
    // IFFI

    // Get user model from Mongoose
    var userModel = require('../database').models.user;

    // Create user function
    var create = function (data, callback){
        // TODO - Constructor starter med Stort - JSHint
        var newUser = new userModel(data);
        newUser.save(callback);
    };

    // Find user function
    var findOne = function (data, callback){
        userModel.findOne(data, callback);
    };

    //  Use objectId to send messages
    var findById = function (id, callback){
        userModel.findById(id, callback);
    };


    // Find user - facebook, twitter -> else create

    var findOrCreate = function(data, callback){
        findOne({'socialId': data.id}, function(err, user){
            if(err) { return callback(err); }
            if(user){
                return callback(err, user);
            }else{
                create({
                    username: data.displayName,
                    socialId: data.id,
                    picture: data.photos[0].value || null
                }, function(err, newUser){
                    callback(err, newUser);
                });
            }
        });
    };

    // Middleware - redirect to...

    var isAuthenticated = function (req, res, next) {
        if(req.isAuthenticated()){
            next();
        }else{
            res.redirect('/');
        }
    };

    // Export functions
    module.exports = { 
        create, 
        findOne, 
        findById, 
        findOrCreate, 
        isAuthenticated 
    };
}());
