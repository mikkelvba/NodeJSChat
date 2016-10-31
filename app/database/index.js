(function () {
    'use strict';

    var config 		= require('../config');
    var Mongoose 	= require('mongoose');
    var logger 		= require('../logger');

    // Localhost connection - Chat DB
    Mongoose.connect('mongodb://localhost/chat');

    Mongoose.connection.on('error', function(err) {
        if(err) throw err;
    });

    Mongoose.Promise = global.Promise;

    // Get Mongoose Models
    module.exports = { Mongoose, 
        models: {
        user: require('./schemas/user.js'),
        room: require('./schemas/room.js'),
        messages: require('./schemas/message.js')
    }
    };
}());
