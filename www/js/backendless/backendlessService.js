var backendlessService = function($q) {

  function Crowd(args) {
    args = args || {};
    this.deviceId = args.deviceId || "";
    this.deviceReliability = args.deviceReliability || 1;
    this.placeKey = args.placeKey || "";
    this.placeName = args.placeName || "";
    this.placeSource = args.placeSource || "";
    this.placeSid = args.placeSid || "";
    this.crowdValue = args.crowdValue || "";
    this.crowdDate = args.crowdDate || "";
    //this.crowdLocation = args.crowdLocation || "";
    this.crowdLocationLatitude = args.crowdLocationLatitude || "";
    this.crowdLocationLongitude = args.crowdLocationLongitude || "";
  }

  function Device(args) {
    args = args || {};
    this.deviceId = args.deviceId || "";
    this.positiveFeedback = args.positiveFeedback || 1;
    this.negativeFeedback = args.negativeFeedback || 0;
  }

  function init() {
    var APPLICATION_ID = 'A556DD00-0405-02E1-FFF4-43454755FC00',
      SECRET_KEY = '98B3E3B5-F807-2E77-FF87-8A7D553DE200',
      VERSION = 'v1'; //default application version;
    Backendless.initApp(APPLICATION_ID, SECRET_KEY, VERSION);
  }

  function insertCrowd(place, crowd, device, onSuccess, onFailure) {

    var crowds = Backendless.Persistence.of(Crowd);
    var crowdObject = new Crowd({
      deviceId: device.id,
      deviceReliability: device.positiveFeedback / (device.positiveFeedback +
        device.negativeFeedback),
      placeKey: place.key,
      placeName: place.name,
      placeSource: place.source,
      placeSid: place.sid,
      crowdValue: crowd.value,
      crowdDate: crowd.date,
      //crowdLocation: place.location,
      crowdLocationLatitude: place.location.latitude,
      crowdLocationLongitude: place.location.longitude
    });
    crowds.save(crowdObject, new Backendless.Async(onSuccess, onFailure));
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

  function insertDevice(device, onSuccess, onFailure) {
    var devices = Backendless.Persistence.of(Device);
    var deviceObject = new Device({
      deviceId: device.id,
      positiveFeedback: device.positiveFeedback,
      negativeFeedback: device.negativeFeedback
    });
    devices.save(deviceObject, new Backendless.Async(onSuccess, onFailure));
  }

  function retrieveDevice(deviceId) {
    var def = $q.defer();
    var devices = Backendless.Persistence.of(Device);
    var query = new Backendless.DataQuery();
    query.condition = "deviceId = '" + deviceId + "'";
    devices.find(query, new Backendless.Async(function(result) {
      if (result.data.length > 0) {
        def.resolve(result.data[0]);
      } else {
        def.resolve(undefined);
      }
    }, function(error) {
      def.resolve(undefined);
    }));
    return def.promise;
  }

  function retrieveCrowds(filter) {
    var def = $q.defer();
    var q = '1 = 1';

    if (filter) {
      if (filter.date) {
        if (filter.date.start) {
          q += ' and crowdDate >= ' + filter.date.start.valueOf();
        }
        if (filter.date.end) {
          q += ' and crowdDate <= ' + filter.date.end.valueOf();
        }

        if (filter.location && filter.location.latitude && filter.location.latitude
          .upper && filter.location.latitude.lower && filter.location.longitude &&
          filter.location.longitude.upper && filter.location.longitude.lower
        ) {
          q += ' and crowdLocationLatitude >= ' + filter.location.latitude.lower;
          q += ' and crowdLocationLatitude <= ' + filter.location.latitude.upper;
          q += ' and crowdLocationLongitude >= ' + filter.location.longitude.lower;
          q += ' and crowdLocationLongitude <= ' + filter.location.longitude.upper;
        }
      }
    }

    var query = new Backendless.DataQuery();
    query.options = {
      sortBy: 'crowdDate desc'
    };
    query.condition = q;

    var crowds = Backendless.Persistence.of(Crowd);
    crowds.find(query, new Backendless.Async(function(result) {
      var i, formattedResults = [];
      for (i = 0; i < result.data.length; i++) {
        formattedResults.push(formatCrowd(result.data[i]));
      }
      def.resolve(formattedResults);
    }, function(error) {
      def.reject();
    }));

    return def.promise;
  }

  function formatCrowd(crowd) {
    return {
      placeKey: crowd.placeKey,
      placeName: crowd.placeName,
      crowdLocation: {
        latitude: crowd.crowdLocationLatitude,
        longitude: crowd.crowdLocationLongitude
      },
      crowdValue: crowd.crowdValue,
      crowdDate: crowd.crowdDate
    };
  }

  return {
    init: init,
    insertCrowd: insertCrowd,
    retrieveCrowds: retrieveCrowds,
    insertDevice: insertDevice,
    retrieveDevice: retrieveDevice
  };
};

angular.module('backendless', [])
  .factory('backendlessService', ['$q', backendlessService]);
