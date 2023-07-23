const express = require('express');
const errorhandler = require('errorhandler');
const cors = require('cors');

const isProduction = process.env.NODE_ENV === 'production';
//Global app object
const app = express();

const corsOptions ={
   //origin: ['https://wilshiregfs.com', 'https://www.wilshiregfs.com'],
   origin: '*',
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200,
}

app.use(cors(corsOptions));

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
app.listen(3998, function () {
	console.log('DEV server listening on port 3998!');
});

module.exports = app;