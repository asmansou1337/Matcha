
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

 }

 // Add Marker Function
 function addMarker(props){
   marker = new google.maps.Marker({
     position:props.coords,
     map:map,
   });
 }
