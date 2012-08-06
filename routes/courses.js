var fs = require('fs'),
      jsdom = require('jsdom'),
      request = require('request'),
      url = require('url'),
      db= require('../modules/persist'),
      encoder = require('../scripts/encoder');

module.exports = function(app){
		
	app.get('/courses', function(req, res){
	
		db.collection('courses').find({},{sort: 'code'}).toArray(function (err, courses) {
	
		res.render('courses.jade',
			{
				title: 'courses',
				courses: courses
			});
		});
	});
  
  
  app.get('/course/:code', function(req, res){
	
		db.collection('courses').findOne({code: req.params.code}, function (err, course) {
    
      if (!err && course) {
      
        res.render('course.jade',
          {
            title: course.code,
            course: course
          });
      }
      else
        res.status(404);
        res.end();
		});
	});
    
}