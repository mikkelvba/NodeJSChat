(function () {
    'use strict';

    /**
     * Session Middleware
     * https://github.com/expressjs/session
     * Ellers bliver brugeren hængende.
     *
     */
    var session 	= require('express-session');
    var MongoStore	= require('connect-mongo')(session);
    var Mongo 		= require('../database');
    var config 		= require('../config');

    /**
     * Starter init() sessionen - for at brugeren kan se hinanden
     * Uses MongoDB-based session store
     *
     */
    var init = function () {
        if(process.env.NODE_ENV === 'production') {
            return session({
                secret: config.sessionSecret,
                resave: false,
                saveUninitialized: false,
                unset: 'destroy',
                // Read: https://github.com/jdesboeufs/connect-mongo
                store: new MongoStore({ mongooseConnection: Mongo.Mongoose.connection })
            });
        } else {
            return session({
                secret: config.sessionSecret,
                resave: false,
                unset: 'destroy',
                saveUninitialized: true
            });
        }
    };

    // Export init functionen
    // sesseion.init();
    module.exports = init();

}());
