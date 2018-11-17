$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for (let user of users) {
      // $("<div>").text(user.name).appendTo($("body"));
      console.log(user.name);
    }
  });
});

// Initialize Google Maps API map
function initGoogleMaps() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.283832198, lng: -123.119332856},
    zoom: 15
  });

////////

var points = [
  {lat: 49.2777153, lng: -123.1201232, placeId: "ChIJOf2W8H1xhlQRcHg0iE0vxJg"},
  {lat: 49.278619, lng: -123.11538999999999, placeId: "ChIJlU3DzX1xhlQRQKD6yVPPrx0"}
  ];



  var service = new google.maps.places.PlacesService(map);
  
  //let infowindow = new google.maps.InfoWindow();
  var markers = []
  points.forEach(element => {

    var request = {
      placeId: element.placeId,
      fields: ['place_id','name', 'rating', 'formatted_phone_number', 'geometry', 'photos', 'formatted_address']
    };

    
    service.getDetails(request, callback);
  
    function callback(place, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        var amarker = newMaker(place);
        amarker.setVisible(true);
        markers.push(amarker);
         amarker.addListener('click', function() {
          setInfoWindowContent(place);
          infowindow.open(map, amarker);
        }); 
       
      }
    }
  });

  function newMaker(place) { 
    var amarker = new google.maps.Marker({
      map: map,
      place: {
      placeId: place.place_id,
      location: place.geometry.location
      }
    })
    return amarker;
  }


  function setInfoWindowContent(place) {
    if (place.photos !== undefined) {
      infowindowContent.children['place-photo'].src = place.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
    } else {
      infowindowContent.children['place-photo'].src = '/images/map-image-placeholder.png';
    }

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-description'].textContent = place.formatted_address;
  }








/////////
  const searchInput = document.getElementById('pac-input');

  let autocomplete = new google.maps.places.Autocomplete(searchInput);
  autocomplete.bindTo('bounds', map);

  let infowindow = new google.maps.InfoWindow();
  let infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  let marker = new google.maps.Marker({
    map: map
  });

  marker.addListener('click', () => {
    infowindow.open(map, marker);
  });

  google.maps.event.addListener(map, 'click', function(event) {
    google.maps.event.addListener(marker, 'click', function() {
      infowindow.open(map, marker);
    });
  });

  // Empty array for points data
  const selectedMapPoints = [];

  // Submit points data using AJAX when clicking the category form button
  $('#category-form-button').on('click', (event) => {
    event.preventDefault();
    let prunedPoints = selectedMapPoints.map(({lat, lng, placeId}) => ({lat, lng, placeId}));

    $.ajax({
      url: '/',
      type: 'POST',
      data: {'mapPoints': prunedPoints},
    });
  });

  autocomplete.addListener('place_changed', () => {
    infowindow.close();

    const place = autocomplete.getPlace();

    if (!place.geometry) {
      return;
    }

    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }

    // Set the position of the marker using the place ID and location
    marker.setPlace({
      placeId: place.place_id,
      location: place.geometry.location
    });

    marker.setVisible(true);

    // If place has photos, load first one; if it doesn't, load placeholder image
    if (place.photos !== undefined) {
      infowindowContent.children['place-photo'].src = place.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
    } else {
      infowindowContent.children['place-photo'].src = '/images/map-image-placeholder.png';
    }

    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-description'].textContent = place.formatted_address;
    infowindow.open(map, marker);

    // Get latitude and longitude of point
    const pointLat = place.geometry.location.lat();
    const pointLng = place.geometry.location.lng();

    // Point data from each point selected on the map
    const pointData = {
      lat: Number(pointLat),
      lng: Number(pointLng),
      placeId: place.place_id,
    };

    // Push pointData to empty array
    selectedMapPoints.push(pointData);

    // Use to print points to a map
    // map.data.addGeoJson(cachedGeoJson);
  });

  // Show map and search input after last event is loaded (tilesloaded)
  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    document.getElementById('map').style.visibility = 'visible';
    document.getElementById('pac-input').style.display = 'block';
  });
}

$(document).ready(() => {
  $('.home-hero--image').parallax({
    imageSrc: '/images/home-hero-image.jpeg',
    naturalWidth: 960,
    naturalHeight: 627,
    speed: 0.5,
  });

  initGoogleMaps();
});