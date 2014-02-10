// CALL FUNCTION
$(document).ready(function(){
  // placePins();   // call this on the index page
  initialize();
});

// VARIABLES

// Custom styles for map
var styles = [
  {
    stylers: [
      { hue: "#2397BA" },
      { saturation: -20 }
    ]
  },{
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },{
    featureType: "road",
    elementType: "labels",
    stylers: [
      { visibility: "off" }
    ]
  }
];

var myLatlng = new google.maps.LatLng(40.772152,-73.955558);
var mapOptions = {
  zoom: 14,
  center: myLatlng
}

var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);



var markers = [
      ['Bondi Beach', 40.724075, -73.996509],
      ['Coogee Beach', 40.77203, -73.96074199999998],
      ['Cronulla Beach', 40.772152,-73.955558]
    ];

// MAIN FUNCTION
function initialize() {

  // Incorporate styles
  map.setOptions({styles: styles}); 

  // Add markers
  var infowindow = new google.maps.InfoWindow(), marker, i;
    
  for (i = 0; i < markers.length; i++) {  
      marker = new google.maps.Marker({
          position: new google.maps.LatLng(markers[i][1], markers[i][2]),
          map: map
      });
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
          return function() {
              infowindow.setContent(markers[i][0]);
              infowindow.open(map, marker);
          }
      })(marker, i));
  }
}
