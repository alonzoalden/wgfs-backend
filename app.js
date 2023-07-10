const express = require('express');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorhandler = require('errorhandler');

const isProduction = process.env.NODE_ENV === 'production';
//Global app object
const app = express();

// app.use(cors({origin: 'http://localhost:8000'}));
//app.use(cors())
// Normal express config defaults
// app.use(require('morgan')('dev'));
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

const corsOptions ={
   origin: '*',
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(require('method-override')());
app.use(express.static(__dirname + '/dist'));

// app.use(jwtCheck);

if (!isProduction) {
	app.use(errorhandler());
}


app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
	app.use(function(err, req, res, next) {
		console.log(err.stack);

		res.status(err.status || 500);

		res.json({'errors': {
			message: err.message,
			error: err
		}});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({'errors': {
		message: err.message,
		error: {}
	}});
});

//starting server
app.listen(3999, function () {
	console.log('DEV server listening on port 3999!');
});

module.exports = app;