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

// Initial map state
var mapOptions = {
  center: new google.maps.LatLng(40.769081, -73.977126),
  zoom: 13
};

var map = new google.maps.Map(document.getElementById('map-canvas'),
  mapOptions);

var input = /** @type {HTMLInputElement} */(
    document.getElementById('pac-input'));

var types = document.getElementById('type-selector');
map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
map.controls[google.maps.ControlPosition.TOP_LEFT].push(types);

var autocomplete = new google.maps.places.Autocomplete(input);
autocomplete.bindTo('bounds', map);

var infowindow = new google.maps.InfoWindow();
var marker = new google.maps.Marker({
  map: map
});

// CALL FUNCTIONS
$(document).ready(function(){
  initialize();
});


// DEFINE FUNTIONS
function initialize() {

  // INCORPORATE STYLES
  map.setOptions({styles: styles});

  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    infowindow.close();
    marker.setVisible(false);
    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // If the place has a geometry, then present it on a map.
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);  // Why 17? Because it looks good.
    }
    marker.setIcon(/** @type {google.maps.Icon} */({
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(35, 35)
    }));
    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
    infowindow.open(map, marker);

    var photos_array = place.photos
    var photos = []
    for (i=0; i < photos_array.length; i++){
      var url = photos_array[i].getUrl({ 'maxWidth': 800, 'maxHeight': 800 });
      photos.push(url);
    }

    console.log(photos);
    
    // POPULATE HIDDEN FORM FIELDS
    $("#placeid").val(place.id);
    $("#name").val(place.name);
    $("#latitude").val(place.geometry.location.d);
    $("#longitude").val(place.geometry.location.e);
    $("#phone").val(place.formatted_phone_number);
    $("#address").val(place.formatted_address);
    // $("#city").val(place.address_components[5].short_name); // inaccurate
    // $("#state").val(place.address_components[7].short_name); // inaccurate
    // $("#postal").val(place.address_components[6].short_name); // inaccurate
    // $("#country").val(place.address_components[6].short_name); // inaccurate
    $("#website").val(place.website);
    $("#photos").val(photos);

  });

  

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  function setupClickListener(id, types) {
    var radioButton = document.getElementById(id);
    google.maps.event.addDomListener(radioButton, 'click', function() {
      autocomplete.setTypes(types);
    });
  }

  setupClickListener('changetype-all', []);
  setupClickListener('changetype-establishment', ['establishment']);
  setupClickListener('changetype-geocode', ['geocode']);

}
    
