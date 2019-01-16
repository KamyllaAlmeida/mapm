$(document).ready(() => {
  $('.home-hero--image').parallax({
    imageSrc: '/images/home-hero-image.jpeg',
    naturalWidth: 960,
    naturalHeight: 627,
    speed: 0.5,
  });

  // Pulls the category id from a hidden HTML tag
  let categoryId = $('#category').data('display');
  let isNewPage = $('#category').data('new');

  // Retrieves the points from the server and hands them over to the function
  // that handles the Google APIs
  if (categoryId) {
    const points = [];
    $.ajax({
      method: 'GET',
      url: `/api/categories/${categoryId}/points`,
    }).done((result) => {
      result.pointData.forEach((point) => {
        points.push({
          lat: point.lat,
          lng: point.long,
          placeId: point.place_id,
          title: point.title
        });
      });
      initGoogleMaps(points);
    });
  } else if (isNewPage) {
      initGoogleMaps([]);
  }

  // Sets options on Masonry
  const $grid = $('[data-categories-grid]').masonry({
    itemSelector: '.category-grid--item',
    fitWidth: true,
    percentPosition: true,
  });

  $grid.masonry('on', 'layoutComplete', () => {
    $grid.masonry();
  });

  // Like category
  $('[data-category-like]').on('click', (event) => {
    event.preventDefault();

    let categoryId = $(event.currentTarget).attr('data-category-like');

    $.ajax({
      url: `/api/categories/${categoryId}/like`,
      type: 'PUT',
      success: ((response) => {
        $(event.currentTarget).toggleClass('liked');
      })
    });
  });
});

// Initialize Google Maps API map
function initGoogleMaps(points) {

  // Determines if this is a page for editing the map and sets the id for Ajax
  if ($('#category').data('edit') === true) {
    var editPageId = parseInt($('#category').data('display'));
  }

  // Sets the data for the info box. This is called on the marker's click event
  function setInfoWindowContent(place) {
    if (place.photos !== undefined) {
      infowindowContent.children['place-photo'].src
        = place.photos[0].getUrl({ 'maxWidth': 100, 'maxHeight': 100 });
    } else {
      infowindowContent.children['place-photo'].src
        = '/images/map-image-placeholder.png';
    }
    infowindowContent.children['place-name'].textContent = place.name;
    infowindowContent.children['place-description'].textContent
      = place.formatted_address;
  }

  // Adds a point to the map.
  function addMapPoint(element) {
    boundPoint = new google.maps.LatLng(element.lat, element.lng);
    markerBounds.extend(boundPoint);
    const request = {
      placeId: element.placeId,
      fields: ['place_id','name', 'rating', 'formatted_phone_number',
               'geometry', 'photos', 'formatted_address']
    };

    service.getDetails(request, placesResult);

    // Callback for the call the the Places API
    function placesResult(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        const aMarker = newMarker(place);
        aMarker.setVisible(true);

        aMarker.addListener('click', () => {
          setInfoWindowContent(place);
          infowindow.open(map, aMarker);
        });

        markers.push(aMarker);

      }
    }
  };

  // Creates a marker object off of the place id
  function newMarker(place) {
    const aMarker = new google.maps.Marker({
      map: map,
      place: {
        placeId: place.place_id,
        location: place.geometry.location,
      }
    });
    return aMarker;
  }

  // Adds point to the list at bottom of map
  function addPoint(pointData) {
    let currentIds = selectedMapPoints.map((item) => item.placeId);

    // Only adds the point if it is not currently in the list
    if (!currentIds.includes(pointData.placeId)) {
      selectedMapPoints.push(pointData);
      $('.list-group')
        .append($('<li>', {class: 'list-group-item d-flex justify-content-between align-items-center'})
          .append($('<span>', {class: 'list-group-item-label'}).text(pointData.title))
          .append($('<button>', {class: 'list-item-delete-button', 'data-placeId': `${pointData.placeId}`}).text('Delete')));

      $(`[data-placeId=${pointData.placeId}]`).on('click', function(event) {
        removePoint($(event.target).attr('data-placeId'));
        $(this).parent().remove();
      });
    }
  }

  // Removes the point from the visible list and the array
  function removePoint(placeId) {
    let removeIndex = selectedMapPoints.map((item) => item.placeId).indexOf(placeId);
    let pointIndex = markers.map((item) => item.place.placeId).indexOf(placeId);
    if (removeIndex !== -1) {
      selectedMapPoints.splice(removeIndex, 1);
    }
    if (pointIndex !== -1) {
      markers[pointIndex].setMap(null);
      markers[pointIndex] = null;
      markers.splice(pointIndex, 1);
    }

    // After removing the point from the array of points, go back through and
    // redraw bounds
    let newBounds = new google.maps.LatLngBounds();

    for (var i = 0; i < markers.length; i++) {
      let lat = markers[i].place.location.lat();
      let lng = markers[i].place.location.lng();
      boundPoint = new google.maps.LatLng(lat, lng);
      newBounds.extend(boundPoint);
      map.fitBounds(newBounds);
    }

    markerBounds = newBounds;
  }

  // Submit points data using Ajax when clicking the submit button
  $('#category-form-button').on('click', (event) => {
    event.preventDefault();
    let prunedPoints = selectedMapPoints.map(({lat, lng, placeId, title, description}) => ({lat, lng, placeId, title, description}));
    if (editPageId) {
      $.ajax({
        url: `/api/categories/${editPageId}`,
        type: 'PUT',
        data: {
          'category': $('#save-category-form').serializeArray(),
          'mapPoints': prunedPoints,
          'categoryId': editPageId
        },
        success: function(response) {
          window.location.replace(response.url);
    }
      });
    } else {
      $.ajax({
        url: '/api/categories',
        type: 'POST',
        data: {
          'category': $('#save-category-form').serializeArray(),
          'mapPoints': prunedPoints},
        success: function(response) {
          window.location.replace(response.url);
        },
      });
    }
  });

  // Creates a new Google Maps instance and sets the initial center and zoom
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 49.283832198, lng: -123.119332856},
    zoom: 12
  });

  const markers = [];

  // Creates a new Google Places instance
  const service = new google.maps.places.PlacesService(map);

  // Creates new instance of the Autocomplete search bar
  const searchInput = document.getElementById('pac-input');
  let autocomplete = new google.maps.places.Autocomplete(searchInput);
  autocomplete.bindTo('bounds', map);

  // Creates new instance of InfoWindow for displaying location info
  let infowindow = new google.maps.InfoWindow();
  let infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  var markerBounds = new google.maps.LatLngBounds();
  let boundPoint;

  // Runs through the points passed into the main function and places them on
  // the map.
  points.forEach((point) => {
    addMapPoint(point);

  });

  if(boundPoint){
    map.fitBounds(markerBounds);
    map.panToBounds(markerBounds);
  }

  // Empty array for points data
  const selectedMapPoints = [];

  // Adds the map's existing points to the list if it's an edit page
  if(editPageId) {
    points.forEach((point) => {
      addPoint(point);
    });
  }

  autocomplete.addListener('place_changed', () => {
    infowindow.close();

    // Gets places info from autocomplete and returns if there is no geometry
    const place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    // Sets the window content on the new location and opens it on the map
    setInfoWindowContent(place);
    infowindow.open(map);

    // Get latitude and longitude of point
    const pointLat = place.geometry.location.lat();
    const pointLng = place.geometry.location.lng();

    // Point data from each point selected on the map
    const pointData = {
      lat: pointLat,
      lng: pointLng,
      placeId: place.place_id,
      title: place.name,
      description: place.formatted_address
    };

    // Expands the map to fit all existing points plus the new point
    boundPoint = new google.maps.LatLng(pointData.lat, pointData.lng);
    markerBounds.extend(boundPoint);
    map.fitBounds(markerBounds);

    // Adds the point to the map, the visible list and the data array
    addMapPoint(pointData);
    addPoint(pointData);
  });

  // Show map and search input after last event is loaded (tilesloaded)
  google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
    document.getElementById('map').style.visibility = 'visible';

    if (!$('[data-category-name]').length) {
      searchInput.style.display = 'block';
    }
  });
}
