
var latitude = document.getElementById('lat').value;
var longitude = document.getElementById('long').value;
var myMap = document.getElementById('previewMap');
var marker;
var previewMap;

function initMap(){
   // Map options
   var options = {
     zoom : 14,
     center : {lat:Number(latitude),lng:Number(longitude)}
   }

   // New map
   previewMap = new google.maps.Map(myMap, options);
   addMarkerPreview({coords:{lat: parseFloat(latitude), lng: parseFloat(longitude)}});

 }

 // Add Marker Function
 function addMarkerPreview(props){
   marker = new google.maps.Marker({
     position:props.coords,
     map:previewMap,
   });
 }
