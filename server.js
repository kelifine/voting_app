'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var routes = require(path.join(__dirname, '/files/routes.js'));
require(path.join(__dirname,'/files/passport/passport.js'))(passport);


app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/node_modules')));




mongoose.connect(process.env.MONGOLAB_URL);
mongoose.Promise = global.Promise;



app.use(session({ secret: 'votingapp', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());


routes(app, passport);



var port = process.env.PORT;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
