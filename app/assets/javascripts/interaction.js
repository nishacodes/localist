$(document).ready(function(){
  var taglines = $('#taglines li');

  (function headlines(){
    $(taglines[0]).delay(500).fadeIn(2000).delay(1000).fadeOut(1000);
    $(taglines[1]).delay(5000).fadeIn(2000).delay(1000).fadeOut(1000);
    $(taglines[2]).delay(9500).fadeIn(2000).delay(1000).fadeOut(1000, headlines);
  })();
})