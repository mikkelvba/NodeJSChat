'use strict';

// Hent depencies
var express 	= require('express');
var app  		= express();
var path 		= require('path');
var bodyParser 	= require('body-parser');
var flash 		= require('connect-flash');

// Componenter - alle de forskellige filer, linkes nærmest her
var routes 		= require('./app/routes');
var session 	= require('./app/session');
var passport    = require('./app/auth');
var ioServer 	= require('./app/socket')(app);
var logger 		= require('./app/logger');

// Sti til View filerne
app.set('views', path.join(__dirname, 'app/views'));
// View engine - Pug/Jade var noget lort
app.set('view engine', 'ejs');

// Lav Bower Components mappen static
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));

app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', routes);

// 400 Alle ubenyttede stier ledes til Index
/*
app.use(function(req, res, next) {
  res.status(404).sendFile(process.cwd() + '/app/views/404.html');
});
*/

// Lyt på port 3000
ioServer.listen(3000);
