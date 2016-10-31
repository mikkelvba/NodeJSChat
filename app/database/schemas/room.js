(function () {
    'use strict';

    var Mongoose  = require('mongoose');


    // Every connection is a user connected via a socket
    // Every connection is a userId + socketID

    var MessageSchema = Mongoose.Schema({
        content: { type: String, required: true},
        date: { type: Date, default: Date.now },
        username: { type: String, required: true}
    });

    var RoomSchema = new Mongoose.Schema({
        title: { type: String },
        connections: { type: [{ userId: String, socketId: String }]},
        messages: [MessageSchema]
    });

    var roomModel = Mongoose.model('room', RoomSchema);

    // Using exports -> makes it generally accessible
    module.exports = roomModel;
}());
