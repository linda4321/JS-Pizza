var marker_home;
var map;
var point;

var directionsService = new google.maps.DirectionsService;
var directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers:true});

function initialize() {
//Тут починаємо працювати з картою
    point	=	new	google.maps.LatLng(50.464379,30.519131);

    var mapProp = {
        center:	point,
        zoom:11
    };
    var html_element =	document.getElementById("googleMap");
    map	= new google.maps.Map(html_element,	 mapProp);

    directionsDisplay.setMap(map);
//Карта створена і показана

    var marker	=	new	google.maps.Marker({
        position: point,
        //map - це змінна карти створена за допомогою new google.maps.Map(...)
        map: map,
        icon: "assets/images/map-icon.png"
    });

    marker_home = new	google.maps.Marker({
        position: point,
        //map - це змінна карти створена за допомогою new google.maps.Map(...)
        map: null,
        icon: "assets/images/home-icon.png"
    });

    google.maps.event.addListener(map, 'click', function(me){
         var coordinates = me.latLng;

         setHomeIcon(marker_home, map, coordinates);
        //coordinates	- такий самий об’єкт як створений new google.maps.LatLng(...)
        geocodeLatLng(coordinates, function(err, adress){
            if(!err) {
                $("#address").val(adress);
                $('#address_text').text(adress);
                showTimeAndRoute(point, coordinates);
                // calculateAndDisplayRoute(point, coordinates, directionsService, directionsDisplay);
                //Дізналися адресу
                // console.log(adress);
            } else {
                $("#address").val("");
                $('#address_text').text("невизначено");
                // console.log("Немає адреси")
            }
        });
    });
}

function findOnMap(address){
    if(map && marker_home && point)
        geocodeAddress(address, function(err, coordinates){
            if(!err){
                $('#address_text').text(address);
                setHomeIcon(marker_home, map, coordinates);
                showTimeAndRoute(point, coordinates);
                // calculateAndDisplayRoute(point, coordinates, directionsService, directionsDisplay);
            } else{
                $('#address_text').text("невизначено");
            }
        });
}

function geocodeAddress(address, callback)	{
    var geocoder =	new	google.maps.Geocoder();
    geocoder.geocode({'address': address}, function(results, status)	{
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var coordinates	= results[0].geometry.location;
            callback(null, coordinates);
        } else {
            callback(new Error("Cannot find the adress"));
        }
    });
}

function geocodeLatLng(latlng, callback){
//Модуль за роботу з адресою
    var geocoder =	new	google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function(results, status) {
        if	(status	===	google.maps.GeocoderStatus.OK&&	results[0])	{
            var adress = results[0].formatted_address;
            console.log(results);
            callback(null, adress);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng,	directionService, directionsDisplay, callback) {
   // var directionService =	new	google.maps.DirectionsService();
    directionService.route({
        origin:	A_latlng,
        destination: B_latlng,
        travelMode:	google.maps.TravelMode["DRIVING"]
    }, function(response, status) {
        if	(status	==	google.maps.DirectionsStatus.OK ) {
            var leg = response.routes[0].legs[0];
            directionsDisplay.setDirections(response);
            // console.log("routes ", response.routes);
            console.log("leg ", response.routes[0].legs);
            callback(null, leg.duration)
        } else {
            callback(new Error("Cannot find direction"));
        }
    });
}

function showTimeAndRoute(coord1, coord2){
    calculateRoute(coord1, coord2, directionsService, directionsDisplay, function(err, time){
        if(!err){
            $("#time").text(time.text);
            // console.log(time.text);
        } else{
            $("#time").text("невизначено");
        }
    });
}

function setHomeIcon(marker_home, map, coordinates){
    marker_home.setMap(null);
    marker_home.setPosition(coordinates);
    marker_home.setMap(map);
}


//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initialize);

exports.findOnMap = findOnMap;