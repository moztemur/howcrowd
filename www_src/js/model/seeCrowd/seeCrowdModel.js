angular.module('seeCrowd.Model', ['seeCrowd.Service', 'map.Service', 'date', 'location.Service', 'config', 'feedback'])
    .factory('seeCrowdModel', ['seeCrowdService', 'mapService', 'feedbackModel',
        'configService', 'dateService', '$rootScope', 'locationService', function(seeCrowdService, mapService,
            feedbackModel, configService, dateService, $rootScope, locationService) {
            var selectedPlaceBasedCrowd, placeBasedCrowdsArray = [], boundingBox,
            mapDivId = 'map', map, markers = [], reload = true;

            function loadCrowds(onSuccess, onFailure) {
                boundingBox = mapService.getBoundingBox($rootScope.location, 0.1);
                seeCrowdService.retrieveCrowds().then(function(results) {
                        loadPlaceBasedCrowds(results);
                        onSuccess();
                    },
                    function() {
                        onFailure();
                    });
            }

            function getPlaceBasedCrowds() {
                return placeBasedCrowdsArray;
            }

            function loadPlaceBasedCrowds(crowds) {
                var i, crowd, crowdFeedbackMargin, now = new Date().getTime(), distance, placeBasedCrowds = {};
                placeBasedCrowdsArray = [];
                for (i = 0; i < crowds.length; i++) {
                    crowd = crowds[i];
                    crowd.lastUpdatePass = Math.round((now - crowd.crowdDate) / (1000 * 60)); //mins
                    if (!placeBasedCrowds[crowd.placeKey]) {
                        placeBasedCrowds[crowd.placeKey] = {
                            crowds: [],
                            crowdCount: 0,
                            crowdValue: 0
                        };
                    }
                    placeBasedCrowds[crowd.placeKey].crowdLocation = crowd.crowdLocation;
                    placeBasedCrowds[crowd.placeKey].placeName = crowd.placeName;
                    placeBasedCrowds[crowd.placeKey].placeSource = crowd.placeSource;
                    placeBasedCrowds[crowd.placeKey].placeSid = crowd.placeSid;
                    placeBasedCrowds[crowd.placeKey].placeDistrict = crowd.placeDistrict;
                    placeBasedCrowds[crowd.placeKey].placeVicinity = crowd.placeVicinity;
                    placeBasedCrowds[crowd.placeKey].placePhoto = crowd.placePhoto;
                    placeBasedCrowds[crowd.placeKey].placeType = crowd.placeType;

                    if(crowd.crowdPhoto){
                        placeBasedCrowds[crowd.placeKey].hasPhoto = true;
                    }
                    if(crowd.crowdText){
                        placeBasedCrowds[crowd.placeKey].hasText = true;
                    }

                    if (!placeBasedCrowds[crowd.placeKey].crowdLast) {
                        placeBasedCrowds[crowd.placeKey].crowdLast = crowd;
                    }

                    //average algorithm including feedbacks
                    crowdFeedbackMargin = 1 + crowd.crowdFeedback.positiveFeedback - crowd.crowdFeedback.negativeFeedback
                    if(crowdFeedbackMargin > 0) {
                        placeBasedCrowds[crowd.placeKey].crowdCount += crowdFeedbackMargin;
                        placeBasedCrowds[crowd.placeKey].crowdValue += crowdFeedbackMargin * crowd.crowdValue;
                    }
                    placeBasedCrowds[crowd.placeKey].crowdAverage = Math.round(
                        placeBasedCrowds[crowd.placeKey].crowdValue / placeBasedCrowds[
                            crowd.placeKey].crowdCount);
                    placeBasedCrowds[crowd.placeKey].crowds.push(crowd);

                    //here algorithm
                    if($rootScope.location.latitude) {
                        distance = locationService.getDistanceBetweenLocations($rootScope.location, crowd.crowdLocation);
                        if(distance > configService.NEARBY_DISTANCE) {
                            placeBasedCrowds[crowd.placeKey].distanceGroup = 10; //not here
                        }
                        else {
                            placeBasedCrowds[crowd.placeKey].distanceGroup = 0; //here
                        }
                    }

                    crowd.feedbackable = 
                        crowd.lastUpdatePass <= configService.FEEDBACK_TIME * 60 && //entered just now
                        placeBasedCrowds[crowd.placeKey].distanceGroup === 0 && //here
                        $rootScope.device.id !== crowd.deviceId; //not me

                    crowd.myFeedback = feedbackModel.getFeedback(crowd.crowdId);
                    if(crowd.myFeedback) {
                        crowd.myFeedback = crowd.myFeedback.isPositive;
                    }
                }
                placeBasedCrowdsArray = Object.keys(placeBasedCrowds).map(function(key) {
                    return placeBasedCrowds[key];
                });
                return placeBasedCrowdsArray;
            }

            function markCurrentLocation() {
                if($rootScope.location.latitude) {
                    markers.push(mapService.markLocationOnMap(map, $rootScope.location));
                }
            }

            function markPlaces() {
                var placeBasedCrowd, i;
                markCurrentLocation();
                for (i = 0; i < placeBasedCrowdsArray.length; i++) {
                    placeBasedCrowd = placeBasedCrowdsArray[i];
                    (function(placeBasedCrowd) {
                        markers.push(mapService.markPlaceOnMap(map, placeBasedCrowd,
                            function() {
                                // selectPlaceBasedCrowd(placeBasedCrowd);
                            })
                        );
                    })(placeBasedCrowd);
                }
            }

            function clearMap(){
                var i;
                for (i = 0; i < markers.length; i++ ) {
                    markers[i].setMap(null);
                }
                markers.length = 0;
                reload = true;
            }

            function loadMap() {
                if(!map) {
                    setTimeout(function(){
                        map = mapService.initMap(mapDivId, boundingBox.latitude.lower, boundingBox.longitude.lower, boundingBox.latitude.upper, boundingBox.longitude.upper);
                        markPlaces();
                        reload = false;
                    }, 100);
                }
                else if(reload && markers.length === 0) {
                    mapService.setMapBoundingBox(map, boundingBox.latitude.lower, boundingBox.longitude.lower, boundingBox.latitude.upper, boundingBox.longitude.upper);
                    markPlaces();
                    reload = false;
                }
            }

            function selectPlaceBasedCrowd(placeBasedCrowd) {
                selectedPlaceBasedCrowd = placeBasedCrowd;
                if (placeBasedCrowd) {
                    app.seeCrowdNavi.pushPage('templates/see-crowd-detail.html', {animation:'lift'});
                }
            }

            function giveFeedback(crowd, isPositive, onSuccess, onFailure) {
                seeCrowdService.giveFeedback(crowd, isPositive, onSuccess, onFailure);
            }

            function getSelectedPlaceBasedCrowd() {
                return selectedPlaceBasedCrowd;
            }

            return {
                loadCrowds: loadCrowds,
                getPlaceBasedCrowds: getPlaceBasedCrowds,
                loadMap: loadMap,
                clearMap: clearMap,
                selectPlaceBasedCrowd: selectPlaceBasedCrowd,
                getSelectedPlaceBasedCrowd: getSelectedPlaceBasedCrowd,
                giveFeedback: giveFeedback
            };
        }
    ]);