 
 var featureIdFromElement = function( element, callback ) {
 
  var id = -1;
 
  element.attr('class').split(' ').forEach( function( c ) {
  
      console.log( c );
  
      if (c.search('feature-id-') != -1)
        id = parseInt( c.split('-').pop() );
  });
  
  callback(id);
}


$(document).ready(function() {
   
  $('.feature-vote-down').click(function() {
  
    featureIdFromElement( $(this).parent(), function( id ) { 
  
      if( !$(this).hasClass('voted') ) {
        if( $('.feature-vote-up').hasClass('voted') ) {
          $('.feature-vote-up .feature-id-' + id).removeClass('voted');
          $('.feature-vote-up .feature-id-' + id).button('toggle');
          //$('.feature-votes .feature-id-' + id).text( parseInt($('.feature-votes').text()) + 1 );
        }
      
        $(this).addClass('voted')
        $(this).button('toggle');
        $.get( '/features/' + id + '/vote/down' );
        
        // $('.feature-votes .feature-id-' + id).text( parseInt($('.feature-votes .feature-id-' + id).text()) + 1 );
      }
      else {
        $(this).removeClass('voted');
        $(this).button('toggle');
        //$('.feature-votes .feature-id-' + id).text( parseInt($('.feature-votes .feature-id-' + id).text()) - 1 );
      }
    });
    
    window.location.reload();
    
  });
   
  $('.feature-vote-up').click(function() {
  
    featureIdFromElement( $(this).parent(), function( id ) { 
  
      if( !$(this).hasClass('voted') ) {
        if( $('.feature-vote-down').hasClass('voted') ) {
          $('.feature-vote-down .feature-id-' + id).removeClass('voted');
          $('.feature-vote-down .feature-id-' + id).button('toggle');
          //$('.feature-votes .feature-id-' + id).text( parseInt($('.feature-votes').text()) + 1 );
        }
      
        $(this).addClass('voted')
        $(this).button('toggle');
        $.get( '/features/' + id + '/vote/up' );
        //feature-votes .feature-id-' + id).text( parseInt($('.feature-votes .feature-id-' + id).text()) + 1 );
      }
      else {
        $(this).removeClass('voted');
        $(this).button('toggle');
        //$('.feature-votes .feature-id-' + id).text( parseInt($('.feature-votes .feature-id-' + id).text()) - 1 );
      }
    });
    
    window.location.reload();
    
  });
});