var fs = require('fs'),
    jsdom = require('jsdom'),
    request = require('request'),
    url = require('url');


module.exports = function(app){

	app.get('/api/courses', function(req, res) {
	
		var courses = [
			{
				code: 'TNA007',
				name: 'Vektoranalys',
				points: 6,
				scheduled: [
					{
						year: 2012,
						semester: 'VT',
						period: [1]
					},
					{
						year: 2011,
						semester: 'VT',
						period: [1]
					}
				]
			},
			{
				code: 'TNG032',
				name: 'Transformteori',
				points: 6,
				scheduled: [
					{
						year: 2012,
						semester: 'HT',
						period: [2]
					},
					{
						year: 2011,
						semester: 'HT',
						period: [2]
					}
				]
			}
		];
	
		res.end( JSON.stringify( courses, null, 4 ) );	
		
	});
    
}

var requestCourses = function( req, res ) {

	request({uri: 'https://www3.student.liu.se/portal/registreringar/tidigare?termin=Alla', encoding: 'utf-8'},
		function(err, response, body) {
			var self = this;
			self.courses = new Array();
			
			if(err)
				console.log('Request error.');
				
			jsdom.env({
				html: body,
				scripts: ['http://code.jquery.com/jquery-1.6.min.js']
				}, function(err, window){

						var $ = window.jQuery,
							$semesterRegistrationTable = $('table[bgcolor="#ffffcc"][border="0"]');
							
						$semesterRegistrationTable.each( function( i, item ) { // For every registration table
						
							var $year = $(item).find("th:eq(0)").text().substr(-8,7),
							
								$semester = $(item).find("td:eq(1)").text().substr(-1);
								
							$(item).find("tr:gt(1)")
								   .each( function(j, courseRow) { // For every course
										var $code = $(courseRow).children("td:eq(1)").text(),
											$name = $(courseRow).children("td:eq(2)").text(),
											$points = $(courseRow).children("td:eq(3)").text().substr(0,2).replace(".","");
								   
										//console.log( "Code: " + $code );
										//console.log( "Name: " + $name );
										//console.log( "Points: " + $points );
										
										self.courses.push({
											year: $year,
											semester: $semester,
											code: $code,
											name: $name,
											points: $points
										});
							});
						});
						
						console.log( self.courses );
						res.end( JSON.stringify( self.courses, null, 4 ) );
						//res.render('layout', {
						//	title: 'StudIO',
						//	courses: self.courses
						//});
						
			});
		});
}