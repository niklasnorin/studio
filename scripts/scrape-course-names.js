var fs = require('fs'),
      jsdom = require('jsdom'),
      request = require('request'),
      url = require('url'),
	    db = require('../modules/persist');

// These probably equals the 'real' program abbreviation except for the last three.
var programPostName = ['ACG','AER','AFU','APB','ASIENJ','ASIENK','Bas','BAS-X','BasT','BI','Bio','BKM','BME','C','CAS','CII','CM-DE','CM-GI','CM-KO','CM-SN','CM-TA','COE','COM','COS','CS','D','DAV','DE','DI','DPU','ECO','ED','EI','EL','ELE','EM','ENB','ENG','ENV','ERG','ES','ETH','EUM','FL','FORE','FORTL','FRIST','FyN','Fys','GDK','HU','I','IE','Ii','IMM','IND','INN','IP','IT','ITS','Jap','KA','KBI','KeBi','Kem','KI','KOS','KTS','LOG','M','Mat','MEC','MED','MES','MFYS','MI','MK','MMAT','MOL','MPN','MSK','MT','MuP','MuP ','NET','NO','OEL','OI','PEK','PRO','SEM','SL','SOC','SOM','SY','TB','TES','TL','TSL','U','UTL','WNE','X','XACG','XSY','Y','YDT','YH','Yi','YMP','YTHele','Bas%C3%A5r%2C+N', 'Bas%C3%A5r%2C+L', 'YTHtr%C3%A4']; 

// Do one request per program.
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