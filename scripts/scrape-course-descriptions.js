 var fs = require('fs'),
       jsdom = require('jsdom'),
       request = require('request'),
       url = require('url'),
	     db = require('../modules/persist'),
       encoder = require('../scripts/encoder');
      
var courseCodeUrl = 'TAMS27',
       yearUrl = '2012';
       
 console.log( "Starting..." )
       
request.get( 
		{
			url:'http://kdb-5.liu.se/liu/lith/studiehandboken/svkursplan.lasso?&k_kurskod=' + courseCodeUrl + '&k_budget_year=' + yearUrl,
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
            
            /*
						console.log( 'Name: ' + $('b:eq(2)').text().split(',')[0] );
            console.log( 'Points: ' + $('b:eq(4)').text() + ' (' + $('b:eq(2)').text().split(',')[1].trim() + ')' );
            console.log( 'Programes: ' );
            $('span.navact:gt(1)').each( function() { console.log( '\t' + $(this).text() ) } )
            //var req = $('span.txtkursivlista:eq(1)').text().split('\n')[1].split(':')[1].trim() 
            //console.log( 'Preliminary scheduled hours: ' + $('span.txtkursivlista:eq(1)').text());
            //console.log( 'Recommended self study hours: ' + $('span.txtkursivlista:eq(1)').text().split('\n')[2].split(':')[1].trim() );
            console.log( 'Educational area: ' + $('span:contains("Utbildningsomr")').nextAll('span:first').text() );
            console.log( 'Subject group: ' + $('span:contains("mnesgrupp")').nextAll('span:first').text() );
            console.log( 'Level (A-D): ' + $('span:contains("(A-D)")').nextAll('span:first').text() );
            console.log( 'Main area(s): ' + $('span:contains("Huvudomr")').nextAll('span:first').text().split(',') );
            console.log( 'Level (G1,G2,A): ' + $('span:contains("(G1,G2,A)")').nextAll('span:first').text() );
            console.log( 'Aim: ' + $('span:contains("IUAE-matris")').nextAll('span:first').html() );
            console.log( 'Prerequisites: ' + $('span:contains("rkunskaper")').nextAll('span:first').html() );
            console.log( 'Organization: ' + $('span:contains("Organisation:")').nextAll('span:first').html() );
            console.log( 'Supplementary courses: ' + $('span:contains("byggnadskurser")').nextAll('span:first').html() )  
            console.log( 'Content: ' + $('span:contains("Kursinneh")').nextAll('span:first').html() );
            console.log( 'Litterature: ' + $('span:contains("Kurslitteratur")').nextAll('span:first').html() );
            
            var examAbbrs = $('span:contains("Examination:")').parent().parent().next().children().first().html().split('<br />'),
                   examDescriptions = $('td.txtlista:eq(0)').html().split('<br />'),
                   examPoints = $('td.txtlista:eq(1)').html().split('<br />'); // Untrimmed
                   
            console.log( 'Examination: ' );
            for( i = 0; i < examPoints.length -1; ++i )
            {
              console.log( examAbbrs[i].trim() + ' - ' + examDescriptions[i].trim() + ' - ' + examPoints[i].trim() );
            }
            
            console.log( 'Language: ' + $('span:contains("Undervisningsspr")').nextAll('span:first').text().replace('.', '').trim() );
            console.log( 'Institution: ' + $('span:contains("Institution")').text().split(':')[1].trim().replace('.','') );
            console.log( 'Study principal:  ' + $('span:contains("Studierektor")').text().split(':')[1].trim() );
            console.log( 'Examinor:  ' + $('span:contains("Examinator")').text().split(':')[1].trim() );
            console.log( 'Website: ' + $('span:contains("Kurshemsida")').find('a').text());
            console.log( 'Board: ' + $('span:contains("Ansvarig programn")').text().trim().split(' ')[2] );
            */
            
            
            var Course = 
            {
                code: courseCodeUrl,
                year: yearUrl,
                name: $('b:eq(2)').text().split(',')[0],
                points: $('b:eq(4)').text() + ' (' + $('b:eq(2)').text().split(',')[1].trim() + ')' ,
                programes: [],
                areaOfEducation: $('span:contains("Utbildningsomr")').nextAll('span:first').text(),
                fieldGroup: $('span:contains("mnesgrupp")').nextAll('span:first').text(),
                fieldGroupLevel: $('span:contains("(A-D)")').nextAll('span:first').text(),
                mainFieldOfStudies: $('span:contains("Huvudomr")').nextAll('span:first').text().split(','),
                advancementLevel: $('span:contains("(G1,G2,A)")').nextAll('span:first').text(),
                aim: $('span:contains("kunskaper:")').parent().parent().prev().find('span.txtlista:first').html(),
                prerequisites: $('span:contains("rkunskaper")').nextAll('span:first').html(),
                organisation: $('span:contains("Organisation:")').nextAll('span:first').html(),
                supplementaryCourses: $('span:contains("byggnadskurser")').nextAll('span:first').html(),
                courseContent: $('span:contains("Kursinneh")').nextAll('span:first').html(),
                courseLiterature: $('span:contains("Kurslitteratur")').nextAll('span:first').html(),
                examinations: [],
                courseLanguage: $('span:contains("Undervisningsspr")').nextAll('span:first').text().replace('.', '').trim(),
                institution: $('span:contains("Institution:")').text().split(':')[1].trim().replace('.',''),
                directorOfStudies: $('span:contains("Studierektor")').text().split(':')[1].trim(),
                examiner: $('span:contains("Examinator:")').text().split(':')[1].trim(),
                website: $('span:contains("Kurshemsida:")').find('a').text(),
                board: $('span:contains("Ansvarig programn")').text().trim().split(' ')[2]
                
            };
            
            $('span.navact:gt(1)').each( function() { Course.programes.push( $(this).text() ) } )
            
            
            var examAbbrs = $('span:contains("Examination:")').parent().parent().next().children().first().html().split('<br />'),
                   examDescriptions = $('td.txtlista:eq(0)').html().split('<br />'),
                   examPoints = $('td.txtlista:eq(1)').html().split('<br />'); // Untrimmed
                   
            for( i = 0; i < examPoints.length -1; ++i )
            {
              Course.examinations.push( { examCode: examAbbrs[i].trim(), examDescription: examDescriptions[i].trim(), examPoints: examPoints[i].trim() } );
            }
         
            console.log( Course );
         
            /*
						
							db.collection('courses').update( {code: $(this).text()}, {code: $(this).text()},
								{upsert:true});
						
							console.log( $(this).text() );
						
						});*/
						
						
				});
		});
    
console.log( "Done!" )
      