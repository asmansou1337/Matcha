
var latitude = document.getElementById('lat').value;
var longitude = document.getElementById('long').value;
var myMap = document.getElementById('map');
var marker;
var map;

function initMap(){
   // Map options
   var options = {
     zoom : 14,
     center : {lat:Number(latitude),lng:Number(longitude)}
   }

   // New map
   map = new google.maps.Map(myMap, options);
   addMarker({coords:{lat: parseFloat(latitude), lng: parseFloat(longitude)}});

   // Listen for click on map
   google.maps.event.addListener(map, 'click', function(event){
      clearMarkers();
      // Add marker
      var pos = event.latLng;
      addMarker({coords:pos});
      document.getElementById('lat').value = pos.lat();
      document.getElementById('long').value = pos.lng();
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

 function locate() {
   if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
      latitude  = position.coords.latitude;
      longitude = position.coords.longitude;
      initMap();
      clearMarkers();
      addMarker({coords:{lat: parseFloat(latitude), lng: parseFloat(longitude)}});
      document.getElementById('lat').value = latitude;
      document.getElementById('long').value = longitude;
      })
   }
}