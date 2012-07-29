 
 
$(document).ready(function() {
   
  $(".feature-vote-down").click(function() {
    if( !$(this).hasClass("voted") ) {
      if( $(".feature-vote-up").hasClass("voted") ) {
        $(".feature-vote-up").removeClass("voted");
        $(".feature-vote-up").button('toggle');
        $(".feature-votes").text( parseInt($(".feature-votes").text()) - 1 );
      }
    
      $(this).addClass("voted");
      $(this).button('toggle');
      $(".feature-votes").text( parseInt($(".feature-votes").text()) - 1 );
    }
    else {
      $(this).removeClass("voted");
      $(this).button('toggle');
      $(".feature-votes").text( parseInt($(".feature-votes").text()) + 1 );
    }
  });
   
  $(".feature-vote-up").click(function() {
    if( !$(this).hasClass("voted") ) {
      if( $(".feature-vote-down").hasClass("voted") ) {
        $(".feature-vote-down").removeClass("voted");
        $(".feature-vote-down").button('toggle');
        $(".feature-votes").text( parseInt($(".feature-votes").text()) + 1 );
      }
    
      $(this).addClass("voted")
      $(this).button('toggle');
      $(".feature-votes").text( parseInt($(".feature-votes").text()) + 1 );
    }
    else {
      $(this).removeClass("voted");
      $(this).button('toggle');
      $(".feature-votes").text( parseInt($(".feature-votes").text()) - 1 );
    }
    
  });
});