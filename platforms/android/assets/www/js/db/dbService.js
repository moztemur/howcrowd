var dbService = function(backendlessService) {

  function init() {
    backendlessService.init();
  }

  function insertCrowd(place, crowd, device, onSuccess, onFailure) {
    backendlessService.insertCrowd(place, crowd, device, onSuccess, onFailure);
  }

  function getPlace(placeSid, placeSoruce, onSuccess) {
    var query = new Parse.Query("Place");

    query.equalTo("placeSid", placeSid);
    query.equalTo("placeSource", placeSoruce);
    query.find({
      success: function(results) {
        if (results.length > 0) {
          onSuccess(results[0]);
        } else {
          onSuccess();
        }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }

  function insertPlace(place, onSuccess, onFailure) {

    getPlace(place.sid, place.source, function(existingPlaceObject) {
      if (existingPlaceObject) {
        onSuccess(existingPlaceObject);
      } else {
        var PlaceObject = Parse.Object.extend("Place");

        placeObject = new PlaceObject();
        placeObject.set('palceSid', place.sid);
        placeObject.set('placeName', place.name);
        placeObject.set('placeLocation', new Parse.GeoPoint(place.location));
        placeObject.set('placeSource', place.source);
        placeObject.save(null, {
          success: function(savedPlaceObject) {
            onSuccess(savedPlaceObject);
          },
          error: function(model, error) {
            onFailure();
          }
        });
      }
    });
  }

  function retrieveDevice(deviceId) {
    return backendlessService.retrieveDevice(deviceId);
  }

  function insertDevice(device, onSuccess, onFailure) {
    backendlessService.insertDevice(device, onSuccess, onFailure);
  }

  function retrieveCrowds(filter) {
    return backendlessService.retrieveCrowds();
  }

  return {
    init: init,
    insertCrowd: insertCrowd,
    retrieveCrowds: retrieveCrowds,
    insertDevice: insertDevice,
    retrieveDevice: retrieveDevice
  };
};

angular.module('db', ['backendless'])
  .factory('dbService', ['backendlessService', dbService]);
