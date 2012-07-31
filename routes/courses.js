var fs = require('fs'),
      jsdom = require('jsdom'),
      request = require('request'),
      url = require('url'),
	  mongo = require('mongoskin');

module.exports = function(app){


  var host = process.env.OPENSHIFT_NOSQL_DB_HOST || 'localhost',
      port = process.env.OPENSHIFT_NOSQL_DB_PORT || '27017',
      user = process.env.OPENSHIFT_NOSQL_DB_USERNAME || '',
      pass = process.env.OPENSHIFT_NOSQL_DB_PASSWORD || '';
  
  var userpass = '';
  
  if( !(user === '') )
    userpass = user + ':' + pass + '@';
  
  var db = mongo.db( userpass + host + ':' + port + '/studio?auto_reconnect');


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
		

 
	app.get('/courses', function(req, res){
	
		db.collection('courses').find().toArray(function (err, courses) {
	
		res.render('courses.jade',
			{
				title: 'courses',
				courses: courses
			});
			
		});
	});
		
		
	
	app.get('/courses/update', function(req, res){

		var programs= ['ACG','AER','AFU','APB','ASIENJ','ASIENK','Bas','BAS-X','BasT','BI','Bio','BKM','BME','C','CAS','CII','CM-DE','CM-GI','CM-KO','CM-SN','CM-TA','COE','COM','COS','CS','D','DAV','DE','DI','DPU','ECO','ED','EI','EL','ELE','EM','ENB','ENG','ENV','ERG','ES','ETH','EUM','FL','FORE','FORTL','FRIST','FyN','Fys','GDK','HU','I','IE','Ii','IMM','IND','INN','IP','IT','ITS','Jap','KA','KBI','KeBi','Kem','KI','KOS','KTS','LOG','M','Mat','MEC','MED','MES','MFYS','MI','MK','MMAT','MOL','MPN','MSK','MT','MuP','MuP ','NET','NO','OEL','OI','PEK','PRO','SEM','SL','SOC','SOM','SY','TB','TES','TL','TSL','U','UTL','WNE','X','XACG','XSY','Y','YDT','YH','Yi','YMP','YTHele']; // 'YTHtr&#228;', 'Bas&#229;r, L','Bas&#229;r, N',
	
		for( p in programs )
		{
		
			console.log( 'Requesting courses for ' + programs[p] + '...' );
	
			request.post( 
				{
					url:'http://kdb-5.liu.se/liu/lith/studiehandboken/search_12/search_response_sv.lasso?-Maxrecords=600&-Op=cn&-Op=cn&-Op=cn&-Operator=equals&-Operator=equals&-Operator=equals&-Operator=bw&-Operator=eq&-Operator=cn&-Operator=eq&-Search=S%C3%B6k&kp_huvudomrade_sv=&kp_institution=&kp_kursinnehall_sv=&kp_kurskod=&kp_kursnamn_sv=&kp_period_ber=&kp_programkod=' + programs[p] + '&kp_schemablock=&kp_termin_ber=&kp_utb_niva=',
					form: true
				},
				function( err, response, body ) {
					
					if(err)
						console.log('Request error.');
						
					jsdom.env(
						{ 
							html: body, 
							scripts: ['http://code.jquery.com/jquery-1.6.min.js'] 
						},
						function(err, window) {

								var $ = window.jQuery;
								
								$('a[href*="k_kurskod="]').each( function() {
								
									db.collection('courses').update( {code: $(this).text()}, {code: $(this).text()},
                                        {upsert:true});
								
									console.log( $(this).text() );
								
								});
								
								
						});
				});
			
			console.log( 'Done!' );
				
			
		}
		res.end("It worked!");
		
		//http://kdb-5.liu.se/liu/lith/studiehandboken/search_12/search_response_sv.lasso?-Maxrecords=600&-Op=cn&-Op=cn&-Op=cn&-Operator=equals&-Operator=equals&-Operator=equals&-Operator=bw&-Operator=eq&-Operator=cn&-Operator=eq&-Search=S%C3%B6k&kp_huvudomrade_sv=&kp_institution=&kp_kursinnehall_sv=&kp_kurskod=&kp_kursnamn_sv=&kp_period_ber=&kp_programkod=&kp_schemablock=&kp_termin_ber=&kp_utb_niva=
	
		/*	
		request({uri: 'https://www3.student.liu.se/portal/registreringar/tidigare?termin=Alla', encoding: 'utf-8'},
			function(err, response, body) {
				var self = this;
				self.courses = new Array();
				
				if(err)
					console.log('Request error.');
					
				jsdom.env({ html: body, scripts: ['http://code.jquery.com/jquery-1.6.min.js'] }, function(err, window){

							var $ = window.jQuery;
							      //$semesterRegistrationTable = $('table[bgcolor="#ffffcc"][border="0"]');
								
							console.log( $('title').text() );
								
							
							$semesterRegistrationTable.each( function( i, item ) { // For every registration table
							
								console.log( i );
							
								var $year = $(item).find("th:eq(0)").text().substr(-8,7),
								
									$semester = $(item).find("td:eq(1)").text().substr(-1);
									
								$(item).find("tr:gt(1)")
									   .each( function(j, courseRow) { // For every course
											var $code = $(courseRow).children("td:eq(1)").text(),
												$name = $(courseRow).children("td:eq(2)").text(),
												$points = $(courseRow).children("td:eq(3)").text().substr(0,2).replace(".","");
									   
											console.log( "Code: " + $code );
											console.log( "Name: " + $name );
											console.log( "Points: " + $points );
											
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
				});
			});
			*/
			
		/*
        res.render('courses.jade',
			{
				title: 'courses',
        courses: courses
			});
		*/
		});
    
}