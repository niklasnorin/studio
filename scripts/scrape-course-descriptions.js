 var fs = require('fs'),
       jsdom = require('jsdom'),
       request = require('request'),
       url = require('url'),
	     db = require('../modules/persist'),
       encoder = require('../scripts/encoder');
      
      
      
var //courseCodeUrl = 'TAMS27',
       yearUrl = '2012';

       

// Function to get the updated courses from Studiehandboken
var updateCourse = function( courseCode ) {

  console.log( "Updating course: " + courseCode );

  request.get( 
    {
      url:'http://kdb-5.liu.se/liu/lith/studiehandboken/svkursplan.lasso?&k_kurskod=' + courseCode + '&k_budget_year=' + yearUrl,
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
            
            var Course = 
            {
                $set: 
                {
                  code: courseCode,
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
                  board: $('span:contains("Ansvarig programn")').text().trim().split(' ')[2],
                  
                  source: {
                    html: body,
                    retreived: new Date()
                   }
                }
            };
            
            // Parse programmes
            $('span.navact:gt(1)').each( function() { Course.$set.programes.push( $(this).text() ) } )
            
            // Parse examinations 
            var examAbbrs = $('span:contains("Examination:")').parent().parent().next().children().first().html().split('<br />'),
                   examDescriptions = $('td.txtlista:eq(0)').html().split('<br />'),
                   examPoints = $('td.txtlista:eq(1)').html().split('<br />'); // Untrimmed
            for( i = 0; i < examPoints.length -1; ++i )
            {
              Course.$set.examinations.push( { 
                  examCode: examAbbrs[i].trim(), 
                  examDescription: examDescriptions[i].trim(), 
                  examPoints: examPoints[i].trim() 
                 });
            }
            
            db.collection('courses').update( {code: courseCode}, Course); 
        });
    });
};


// Get courses from database and update information
db.collection('courses').find({},{}).toArray( function( err, courses ) {
  for(var i = 0; i < courses.length; i++)
    updateCourse( courses[i].code );
});