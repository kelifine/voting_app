'use strict';

var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var path = require('path');
var app = express();
require('dotenv').load();

app.use(express.static(path.join(__dirname, '/public')));

mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;




var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});
