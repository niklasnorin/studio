var fs = require('fs'),
      jsdom = require('jsdom'),
      request = require('request'),
      url = require('url'),
      db= require('../modules/persist');

module.exports = function(app){
		
	app.get('/courses', function(req, res){
	
		db.collection('courses').find().toArray(function (err, courses) {
	
		res.render('courses.jade',
			{
				title: 'courses',
				courses: courses
			});
		});
	});
    
}