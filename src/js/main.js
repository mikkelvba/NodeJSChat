'use strict';
// Read: http://javascript.crockford.com/code.html

var app = {

    rooms: function(){

        // Read: https://davidwalsh.name/websocket
        var socket = io('/rooms', { transports: ['websocket'] });

        // When socket connects, get a list of chatrooms
        // Socket -> ved connect -> Hent en liste med rum
        socket.on('connect', function () {

            // updateRoomsList -> ved event.
            socket.on('updateRoomsList', function(room) {

                // Tager fat i .room-create
                $('.room-create p.message').remove();
                if(room.error != null){
                    // room.error tilgåes fra backend
                    $('.room-create').append(`<p class="message error">${room.error}</p>`);
                }else{
                    app.helpers.updateRoomsList(room);
                }
            });

            // Når brugeren klikker på creat room - emit 'createRoom
            $('.room-create button').on('click', function() {
                var inputEle = $("input[name='title']");
                if(inputEle.val() !== '') {
                    socket.emit('createRoom', inputEle.val());
                    inputEle.val('');
                }
            });

        });
    },

    chat: function(roomId, username){

        var socket = io('/chatroom', { transports: ['websocket'] });

        // Få forbindelse til Chat rummet
        socket.on('connect', function () {
            // Joiner rummer 
            socket.emit('join', roomId);

            // updateUsersList bliver dernæst kaldt for at opdatere brugerne i rummet
            socket.on('updateUsersList', function(users, clear) {
                // Samme fejl system
                $('.container p.message').remove();
                if(users.error != null){
                    $('.container').html(`<p class="message error">${users.error}</p>`);
                }else{
                    app.helpers.updateUsersList(users, clear);
                }
            });

            // Tryk Send - Kalder newMessage
            $(".chat-message button").on('click', function() {

                var textareaEle = $("textarea[name='message']");
                if(textareaEle.val() !== '') {
                    // Beskeden indeholder textfeltet, username og Date.now()
                    var message = { 
                        content: textareaEle.val(), 
                        username: username,
                        date: Date.now()
                    };

                    socket.emit('newMessage', roomId, message);
                    textareaEle.val('');
                    app.helpers.addMessage(message);
                    console.log(message);
                }
            });
            
            // Fjern brugeren fra oversigten når den forlader rummer
            // Når removeUser - fjern  userid fra li#user
            socket.on('removeUser', function(userId) {
                $('li#user-' + userId).remove();
                app.helpers.updateNumOfUsers();
            });

            // Append a new message.
            socket.on('addMessage', function(message) {
                app.helpers.addMessage(message);
            });
        });
    },

    helpers: {

        encodeHTML: function (str){
            return $('<div />').text(str).html();
        },

        // updateRoomsList funktion
        updateRoomsList: function(room){
            room.title = this.encodeHTML(room.title);
            var html = `<a href="/chat/${room._id}"><li class="room-item">${room.title}</li></a>`;

            if(html === ''){ return; }

            if($(".room-list ul li").length > 0){
                $('.room-list ul').prepend(html);
            }else{
                $('.room-list ul').html('').html(html);
            }

            this.updateNumOfRooms();
        },

        // Listen med brugerne
        updateUsersList: function(users, clear){
            if(users.constructor !== Array){
                users = [users];
            }

            var html = '';
            for(var user of users) {
                user.username = this.encodeHTML(user.username);
                html += `<li class="clearfix" id="user-${user._id}">
                <img src="${user.picture}" alt="${user.username}" />
                <div class="about">
                <div class="name">${user.username}</div>
                <div class="status"><p class="online">Online</p></div>
                </div></li>`;
            }

            if(html === ''){ return; }

            if(clear != null && clear == true){
                $('.users-list ul').html('').html(html);
            }else{
                $('.users-list ul').prepend(html);
            }

            this.updateNumOfUsers();
        },

        // Adding a new message to chat history
        addMessage: function(message){
            message.date      = (new Date(message.date)).toLocaleString();
            message.username  = this.encodeHTML(message.username);
            message.content   = this.encodeHTML(message.content);

            var html = `<li>
            <div class="message-data">
            <span class="message-data-name">${message.username}</span>
            <span class="message-data-time">${message.date}</span>
            </div>
            <div class="message my-message" dir="auto">${message.content}</div>
            </li>`;
            $(html).hide().appendTo('.chat-history ul').slideDown(200);

            // Keep scroll bar down
            $(".chat-history").animate({ scrollTop: $('.chat-history')[0].scrollHeight}, 1000);
        },

        // Gem besked -> Mongoose - MessageSchema
        saveMessage: function(message){
            message.date      = (new Date(message.date)).toLocaleString();
            message.username  = this.encodeHTML(message.username);
            message.content   = this.encodeHTML(message.content);
        },

        // Update number of rooms
        // This method MUST be called after adding a new room
        updateNumOfRooms: function(){
            var num = $('.room-list ul li').length;
            $('.room-num-rooms').text(num +  " Room(s)");
        },

        // Update number of online users in the current room
        // This method MUST be called after adding, or removing list element(s)
        updateNumOfUsers: function(){
            var num = $('.users-list ul li').length;
            $('.chat-num-users').text(num +  " User(s)");
        }
    }
};
