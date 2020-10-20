
var latitude = document.getElementById('latitude').value;
var longitude = document.getElementById('longitude').value;
var locationMap = document.getElementById('map');
var marker;
var map;

function initialize() {
  initMap();
  initMap2();
}

// Location Map Tab
function initMap2(){
   // Map options
   var options = {
     zoom : 14,
     center : {lat:Number(latitude),lng:Number(longitude)}
   }

   // New map
   map = new google.maps.Map(locationMap, options);
   addMarker({coords:{lat: parseFloat(latitude), lng: parseFloat(longitude)}});

   // Listen for click on map
   google.maps.event.addListener(map, 'click', function(event){
      clearMarkers();
      // Add marker
      var pos = event.latLng;
      addMarker({coords:pos});
      document.getElementById('latitude').value = pos.lat();
      document.getElementById('longitude').value = pos.lng();
   });
 }

 // Add Marker Function
 function addMarker(props){
   marker = new google.maps.Marker({
     position:props.coords,
     map:map,
   });
 }

  // Removes the previous marker from the map
  function clearMarkers() {
    if (typeof marker !== 'undefined')
       marker.setMap(null);
  }

  // For auto location
 function locate() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
      latitude  = position.coords.latitude;
      longitude = position.coords.longitude;
      initMap();
      clearMarkers();
      addMarker({coords:{lat: parseFloat(latitude), lng: parseFloat(longitude)}});
      document.getElementById('latitude').value = latitude;
      document.getElementById('longitude').value = longitude;
      })
   }
}

