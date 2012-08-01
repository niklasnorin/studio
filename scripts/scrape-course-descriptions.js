 var fs = require('fs'),
       jsdom = require('jsdom'),
       request = require('request'),
       url = require('url'),
	     db = require('../modules/persist'),
       encoder = require('../scripts/encoder');
      
var course = 'TGTU35',
       year = '2012';
       
 console.log( "Starting..." )
       
request.get( 
		{
			url:'http://kdb-5.liu.se/liu/lith/studiehandboken/svkursplan.lasso?&k_kurskod=' + course + '&k_budget_year=' + year,
      encoding: 'utf8',
      headers: { 'User-Agent': 'Mozilla/5.0' }
		},
		function( err, response, body ) {
			
			if(err)
				console.log('Request error.');
				
			jsdom.env(
				{ 
					html: body, 
					scripts: ['http://code.jquery.com/jquery-1.7.min.js'] 
				},
				function(err, window) {

            body = encoder.htmlDecode(body);
        
						var $ = window.jQuery;
            
						console.log( 'Name: ' + $('b:eq(2)').text().split(',')[0] );
            console.log( 'Points: ' + $('b:eq(4)').text() + ' (' + $('b:eq(2)').text().split(',')[1].trim() + ')' );
            console.log( 'Programes: ' );
            $('span.navact:gt(1)').each( function() { console.log( '\t' + $(this).text() ) } )
            //var req = $('span.txtkursivlista:eq(1)').text().split('\n')[1].split(':')[1].trim() 
            //console.log( 'Preliminary scheduled hours: ' + $('span.txtkursivlista:eq(1)').text());
            //console.log( 'Recommended self study hours: ' + $('span.txtkursivlista:eq(1)').text().split('\n')[2].split(':')[1].trim() );
            console.log( 'Educational area: ' + $('span.txtlista:eq(0)').text() );
            console.log( 'Subject group: ' + $('span.txtlista:eq(1)').text() );
            console.log( 'Level (A-D): ' + $('span.txtlista:eq(2)').text() );
            console.log( 'Main area(s): ' + $('span.txtlista:eq(3)').text().split(',') );
            console.log( 'Level (G1,G2,A): ' + $('span.txtlista:eq(4)').text() );
            console.log( 'Aim: ' + $('span.txtlista:eq(5)').html() );
            console.log( 'Prerequisites: ' + $('span.txtlista:eq(6)').html() );
            console.log( 'Organization: ' + $('span.txtlista:eq(7)').html() );
            console.log( 'Content: ' + $('span.txtlista:eq(8)').html() );
            console.log( 'Litterature: ' + $('span.txtlista:eq(9)').html() );
            
            var examAbbrs = $('.txtbold:eq(6)').html().split('<br />'),
                   examDescriptions = $('td.txtlista:eq(0)').html().split('<br />'),
                   examPoints = $('td.txtlista:eq(1)').html().split('<br />'); // Untrimmed
                   
            console.log( 'Examination: ' );
            for( i = 0; i < examPoints.length -1; ++i )
            {
              console.log( examAbbrs[i].trim() + ' - ' + examDescriptions[i].trim() + ' - ' + examPoints[i].trim() );
            }
            
            console.log( 'Language: ' + $('span.txtlista:eq(11)').text() );
            console.log( 'Institution: ' + $('span.txtlista:eq(12)').text().split(':')[1].trim().replace('.','') );
            console.log( 'Study principal:  ' + $('span.txtlista:eq(13)').text().split(':')[1].trim() );
            console.log( 'Examinor:  ' + $('span.txtlista:eq(13)').text().split(':')[1].trim() );
            console.log( 'Website: ' + $('span.txtlista:eq(15)').text().trim().split(' ')[1] );
            console.log( 'Board: ' + $('span.txtlista:eq(16)').text().trim().split(' ')[2] );
            /*
						
							db.collection('courses').update( {code: $(this).text()}, {code: $(this).text()},
								{upsert:true});
						
							console.log( $(this).text() );
						
						});*/
						
						
				});
		});
    
console.log( "Done!" )
      