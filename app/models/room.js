(function () {
    'use strict';
    // IFFI

    // Import roomModel and User model
    var roomModel   = require('../database').models.room;
    var User 		= require('../models/user');

    // Save functions from roomModel -> localScope
    var create = function (data, callback){
        var newRoom = new roomModel(data);
        newRoom.save(callback);
    };

    var find = function (data, callback){
        roomModel.find(data, callback);
    };

    var findOne = function (data, callback){
        roomModel.findOne(data, callback);
    };

    var findById = function (id, callback){
        roomModel.findById(id, callback);
    };

    // Add user with socket

    var addUser = function(room, socket, callback){

        // Get UserId
        var userId = socket.request.session.passport.user;

        // Push new connection {userId + socketId}
        var conn = { userId: userId, socketId: socket.id};
        room.connections.push(conn);
        room.save(callback);
    };

    // Get all users

    var getUsers = function(room, socket, callback){

        var users = [], vis = {}, cunt = 0;
        var userId = socket.request.session.passport.user;

        // ForEach connection to room, then ->
        room.connections.forEach(function(conn){

            // User is connected - add user #cunt++
            if(conn.userId === userId){
                cunt++;
            }

            // Create array with all users
            // Get userId to print image
            if(!vis[conn.userId]){
                users.push(conn.userId);
            }
            vis[conn.userId] = true;
        });

        users.forEach(function(userId, i){
            // Get User ID (findById)
            // Add to user array
            // Create user object
            User.findById(userId, function(err, user){
                if (err) { return callback(err); }
                users[i] = user;
                if(i + 1 === users.length){
                    return callback(null, users, cunt);
                }
            });
        });
    };

    // Remove user when connection is not established

    var removeUser = function(socket, callback){

        // Get userId from Socket.io
        var userId = socket.request.session.passport.user;

        find(function(err, rooms){
            if(err) { return callback(err); }

            // Look at each room ->
            rooms.every(function(room){
                var pass = true, cunt = 0, target = 0;

                room.connections.forEach(function(conn, i){
                    if(conn.userId === userId){
                        cunt++;
                    }
                    if(conn.socketId === socket.id){
                        pass = false, target = i;
                    }
                });

                // !pass - remove user
                if(!pass) {
                    room.connections.id(room.connections[target]._id).remove();
                    room.save(function(err){
                        callback(err, room, userId, cunt);
                    });
                }

                return pass;
            });
        });
    };

    // Export modules
    module.exports = { 
        create, 
        find, 
        findOne, 
        findById, 
        addUser, 
        getUsers, 
        removeUser 
    };
}());
