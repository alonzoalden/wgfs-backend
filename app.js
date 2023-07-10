const express = require('express');
const path = require('path');
const http = require('http');
//const bodyParser = require('body-parser');
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
// Add headers before the routes are defined
// app.use(function (req, res, next) {

//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);

//     // Pass to next layer of middleware
//     next();
// });
const corsOptions ={
   origin: '*',
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true, parameterLimit:50000 }));

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