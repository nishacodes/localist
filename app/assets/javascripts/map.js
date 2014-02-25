// CALL FUNCTION
$(document).ready(function(){
  initialize();
});

// VARIABLES
// ---------------------
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
var infowindow = new google.maps.InfoWindow();

// MAIN FUNCTION
// ---------------------
function initialize() {
  
  // MAP SETUP
  // ---------------------
  // Incorporate styles
  map.setOptions({styles: styles}); 
  addSelected();

  // when you click +place, call the autocomplete function and pass in the list id
  $('.new_placelink').on('click', function(e){
    e.preventDefault();
    var array = $(this)[0].id.split("_"); // this is a little hacky, but gets the list id from the string
    var list_id = array[array.length-1];
    $("#hidden-form").html(""); // this clears the div before adding more; a bit slow
    $.get("/lists/" + list_id + "/places/new", function(data) { 
      $("#hidden-form").html(data);
      autoComplete();
    });
    
  })

  // NEED TO MAKE IT OBVIOUS WHAT HAPPENS WHEN U CLICK ADD

  // AUTOCOMPLETE
  // ---------------------
  function autoComplete(){
  
    // A reference to the marker created by the search
    var input = document.getElementById('input');
    var submit = document.getElementById('place-submit-button');
    var markerNew = new google.maps.Marker({
      map: map
    });
    
    // Pushes the field to the top left position on the map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(submit);

    // Makes the input box into an autocomplete field
    var autocomplete = new google.maps.places.Autocomplete(input);
    // Fixes the autocomplete to the bounds of the map so the top results are in your area
    autocomplete.bindTo('bounds', map);

    // This event listener remove the old marker and infowindow when you change the place searched
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
      infowindow.close();
      markerNew.setVisible(false);
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
      markerNew.setIcon(/** @type {google.maps.Icon} */({
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(35, 35)
      }));
      markerNew.setPosition(place.geometry.location);
      markerNew.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
      infowindow.open(map, markerNew);


      // STORE PHOTO URLS IN AN ARRAY
      var photos_array = place.photos
      var photos = []
      for (i=0; i < photos_array.length; i++){
        var url = photos_array[i].getUrl({ 'maxWidth': 800, 'maxHeight': 800 });
        photos.push(url);
      }

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
      $("#rating").val(place.rating);
      $("#rating_url").val(place.url);
      $("#price_level").val(place.price_level);
      $("#photos").val(photos);
  
    });

    
  }

  // FILTER CONTROLS
  // ---------------------
  // Toggle 'all' to control other selectors
  $("#filters li").first().on('click',function(){
    $(this).toggleClass("");
    if($(this).hasClass("selected")){
      $(this).nextAll().removeClass("selected");
      addSelected();
    } else {
      $(this).nextAll().addClass("selected");
      addSelected();
    }
  })

  // Toggle 'selected' class for each filter
  $("#filters li").on('click',function(){
    $(this).toggleClass("selected");
    addSelected();
  })

  // Add all the lists (of objects) into the selected_lists array to start 
  function addSelected(){
    clearMarkers(); 
    markers = [];
    var selected_lists=[];

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
        var name = selected_lists[i][x].name;    // index 0
        var lat = selected_lists[i][x].lat;      // index 1
        var long = selected_lists[i][x].long;    // index 2
        var id = selected_lists[i][x].id;        // index 3
        var marker = [name,lat,long, id];
        markers.push(marker);
        placeMarkers();
        
      }
    }
  }

  // clears array of permanentMarkers
  function clearMarkers(){
    for (var i=0; i<permanentMarkers.length; i++){
      permanentMarkers[i].setMap(null);
    }
  }
  
  // PLACES MARKERS IN THE MARKERS ARRAY 
  // ---------------------
  // Place markers on map
  function placeMarkers(){
    var i;
 
    for (i = 0; i < markers.length; i++) {  
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(markers[i][1], markers[i][2]), // lat/long coordinates
            map: map,
            icon: "dot.png"
        });

        permanentMarkers.push(marker); // keep track of google objects
 
        // CREATE INFOBOX (PLUGIN)
        var infobox = new InfoBox({
          content: document.getElementById("infobox"),
          disableAutoPan: false,
          maxWidth: 150,
          opacity: 0.7,
          pixelOffset: new google.maps.Size(-142, -22),
          alignBottom: true,
          zIndex: null,
          boxStyle: {
            background: "white",
            width: "280px"
          },
          closeBoxMargin: "0px",
          closeBoxURL: "",
          infoBoxClearance: new google.maps.Size(1, 1)
        });

        // SHOW INFOBOX ON MOUSEOVER  
        google.maps.event.addListener(marker, 'mouseover', (function(marker, i) { 
          var tooltip = $("#tooltip_"+markers[i][3]).clone()[0];
          return function() {
            if(tooltip!=infobox.getContent()){
              infobox.open(map, marker); // display infobox instead of infowindow
              infobox.setContent(tooltip);          
            }
          }
        })(marker, i));

        google.maps.event.addListener(marker, 'click', function() {
          //when the infowindow is open, close it an clear the contents
          var tooltip = $("#tooltip_"+markers[i][3]).clone()[0];
          
          return function() {
            if(tooltip==infobox.getContent()){
              infobox.close(map,marker);
              infowindow.setContent('');
            } else { //otherwise trigger mouseover to open the infowindow
              google.maps.event.trigger(marker, 'mouseover');
            }
          }
        });

        //clear the contents of the infwindow on closeclick
        google.maps.event.addListener(infobox, 'click', function() {
            console.log(infobox);
              infobox.setContent('');
        });
   
        // // HIDE INFOBOX ON MOUSEOUT
        // google.maps.event.addListener(marker, 'mouseout', function() {
        //   infobox.close();
        // });

        // ADD A MOUSEOUT FUNCTION TO REMOVE INFOWINDOW AND A CLICK FUNCTION TO MAKE IT STICK.
    }
  }
}



// JQUERY EFFECTS SIDENAV
// ---------------------
// Hover effects
$("li.place a").on('mouseover', function(){
  var coordinates = $(this).data('url');
  // need to show the infowindow on the map for the marker at these coordinates
})

// Toggle sidenav
$("#view").on('click', function(){
  if ($(this).hasClass('hide')) {
    $('.sidenav').animate({width:'300px', padding:'20px'},500);
    $(this).removeClass('hide');
  } else { 
    $('.sidenav').animate({width:'0px', padding:'0px'},500);
    $(this).addClass('hide');
  };
  if ($(this).html() == "Hide") {
    $(this).html("Show")
  } else {
    $(this).html("Hide")
  }
})

// Toggle lists
$(".list_name").on('click', function(e){
  e.preventDefault();
  $(this).parent().next().find('li').slideToggle();
})

// Show tooltip on sidenav hovers 
$('li.place').on("mouseover", function(){
  var place_id = ($(this).find('a')[0].id);
  var infowindow_id = place_id.replace("place","tooltip");
})

// JQUERY EFFECTS RECOMMENDATIONS
// ------------------------------
// Toggle recommendations
$('#hiderecs').on('click', function(){
  $('.recommendations').slideToggle();
  if ($(this).html() == "Hide") {
    $(this).html("Show")
  } else {
    $(this).html("Hide")
  }
})


