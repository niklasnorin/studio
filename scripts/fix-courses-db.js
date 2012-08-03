 var fs = require('fs'),
       jsdom = require('jsdom'),
       url = require('url'),
	     db = require('../modules/persist');


var fixCourse = function( course ) {

  jsdom.env(
    { 
      html: course.source.html, 
      scripts: ['http://code.jquery.com/jquery-1.7.min.js'] 
    },
    
    function(err, window) {
      var points = course.points;
      var name = course.name;
      
      halfPoint = false;
      commaInName = false;
      fixedTitle = false;
    
      var $ = window.jQuery;
      
      title = $('b:eq(2)').text();
      titleSplit = title.split(',');
      pLoc = title.search(' p ');
      lastCommaLoc = title.lastIndexOf(',');
      
      // There is half of a point here!
      if( (pLoc - lastCommaLoc) === 2 ) {
          halfPoint = true;
          points = $('b:eq(4)').text() + ' (' + title.substr( title.lastIndexOf(',', lastCommaLoc-1)+1, title.length).trim() + ')' 
          
          console.log( "Half points fix" );
      }
      // Clean up old points value containing parts of title
      else if( titleSplit.length > 2 ) { 
        fixedTitle = true;
        for( var i = 0; i < titleSplit.length -1; i++ ) {
          if( points.search( titleSplit[i].trim() ) != -1 ){
            points = $('b:eq(4)').text() + ' (' + title.substr( title.lastIndexOf(',')+1, title.length).trim() + ')' 
            
            console.log( "Strange points fix" );
          }
        }
      }
      
      if( title.split(',').length > 2 ) {
        commaInName = true;
      
        // If we have half a point, take that into account, else just substring until last comma
        if( halfPoint )
          // Substring from 0 to second last ','
          name = title.substr(0, title.lastIndexOf(',', lastCommaLoc-1) );
        else
          // Substring from 0 all the way to last ','
          name = title.substr(0, lastCommaLoc);
          
        console.log( "Comma title fix" );
      }
      
      if( halfPoint || fixedTitle || commaInName ) {
      
        console.log( 'points: ' + points );
        console.log( 'name: ' + name );
      
        db.collection('courses').update( {code: course.code}, {$set: { name: name, points: points}}); 
      }
  });
}

       
db.collection('courses').find({},{}).toArray( function( err, courses ) {
  for(var i = 0; i < courses.length; i++)
    fixCourse( courses[i] );
});

