$(document).ready(function(){
  
  // Animate taglines on landing page
  var taglines = $('#taglines li');
  (function headlines(){
    $(taglines[0]).delay(500).fadeIn(2000).delay(1000).fadeOut(1000);
    $(taglines[1]).delay(5000).fadeIn(2000).delay(1000).fadeOut(1000);
    $(taglines[2]).delay(9500).fadeIn(2000).delay(1000).fadeOut(1000, headlines);
  })();


  // Toggle recommendations
  $('#hiderecs').on('click', function(){
    $('.recommendations').slideToggle();
    if ($(this).html() == "Hide") {
      $(this).html("Show")
    } else {
      $(this).html("Hide")
    }
  })

  // Toggle preference sections
  $('.hideblock').on('click', function(){
    console.log($(this).next());
    $(this).next().slideToggle();
    if ($(this).html() == "Hide") {
      $(this).html("Show")
    } else {
      $(this).html("Hide")
    }
  })

  // IMAGE SCROLL FUNCTION
  $('a.show_place').on('click', function (){ 
    $(document).imgScrubber({
        delegate: "div.img"
    });
  })

  $(document).foundation('joyride', 'start');
})