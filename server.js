
/**
 * Module dependencies.
 */



var express = require('express'),
	app = module.exports = express.createServer();
	
	
	

app.configure(function(){
  app.set('port', process.env.OPENSHIFT_INTERNAL_PORT || 3000);
  app.set('host', process.env.OPENSHIFT_INTERNAL_IP || "192.168.1.6");
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});


app.configure('development', function(){
  app.use(express.errorHandler());
});


// Import all site routes
var routes = require('./routes')(app);

// Import all API routes
var routes = require('./routes/api')(app);


console.log("Starting server on IP " + app.get('host') );
console.log("Port " + app.get('port'));

app.listen( app.get('port'), app.get('host') );
