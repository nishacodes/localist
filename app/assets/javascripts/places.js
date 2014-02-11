// CALL FUNCTION
$(document).ready(function(){
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
      { visibility: "on" }
    ]
  }
];

var myLatlng = new google.maps.LatLng(40.757975,-73.9752290);
var mapOptions = {
  zoom: 13,
  center: myLatlng
}

var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
var markers = [];
var permanentMarkers = [];

// MAIN FUNCTION
function initialize() {
  
  // Incorporate styles
  map.setOptions({styles: styles}); 
  
  // remove markers example: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
  // another example: http://jsfiddle.net/TwMVj/3/
  
  // Toggle 'selected' class for filters
  $("#filters li").on('click',function(){
    $(this).toggleClass("selected");
    addSelected();
  })

  // Add all the lists (of objects) into the selected_lists array to start 
  function addSelected(){
    clearMarkers();
    var selected_lists=[];
    markers = [];

    $("#filters li.selected").each(function(){  
      list_name = $(this).text();
      for (var key in gon.places_hash) {
        if (list_name == key){
          selected_lists.push(gon.places_hash[key])
        }
      }  
    })

    // Create markers for all places in selected_lists
    for (i=0; i < selected_lists.length; i++){
      for (x=0; x < selected_lists[i].length; x++){
        var name = selected_lists[i][x].name; 
        var lat = selected_lists[i][x].lat;
        var long = selected_lists[i][x].long;
        var marker = [name,lat,long];
        markers.push(marker);
        placeMarkers();
        
      }
    }
  }

  function clearMarkers(){
    for (var i=0; i<permanentMarkers.length; i++){
      permanentMarkers[i].setMap(null);
    }
  }

  // Place markers on map
  function placeMarkers(){
    var infowindow = new google.maps.InfoWindow(), i;
    
    for (i = 0; i < markers.length; i++) {  
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(markers[i][1], markers[i][2]), // lat/long coordinates
            map: map,
            icon: "dot.png"
        });

        permanentMarkers.push(marker); // keep track of google objects

        google.maps.event.addListener(marker, 'mouseover', (function(marker, i) {
            return function() {
                infowindow.setContent(markers[i][0]); // name of place
                infowindow.open(map, marker);
            }
        })(marker, i));
    }
  }
}

// Toggle btw list and map view
$("#view").on('click', function(){
  $(".listview").toggleClass("hidden");
  if ($(".listview").hasClass("hidden")){
    $("#map-canvas").removeClass("hidden");
    $("#filters").removeClass("hidden");
    $(this).text("View lists");
  } else {
    $("#map-canvas").addClass("hidden");
    $("#filters").addClass("hidden");
    $(this).text("View map");
  }
})
