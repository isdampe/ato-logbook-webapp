(function(window){

  var db = this;
  window.db = db;

  db.insertNewTrip = function(tripData) {

    //Generate a trip ID.
    var tripId = new Date().getTime();

    //Adds the trip to local storage.
    tripData.position = "local";
    tripData.lastUpdate = new Date().getTime();
    tripData.tripId = tripId;
    tripData.stat = "begin";

    store.set('job_' + tripId,tripData);
    store.set('most_recent_trip', tripId);
    store.set('trip_active', true);

    return tripId;

  };

  db.getLatestTrip = function() {

    var most_recent_trip = store.get('most_recent_trip');
    if (! most_recent_trip ) {
      return false;
    }

    var tripData = db.getTripById(most_recent_trip);
    if (! tripData ) {
      return false;
    }

    return tripData;

  };

  db.deleteTrip = function(tripId) {

    store.remove('job_' + tripId);
    db.clearActiveTrip();

  };

  db.clearActiveTrip = function() {
    store.remove('trip_active');
    store.remove('most_recent_trip');
  };

  db.finishTrip = function(tripId,data) {

    var tripData = db.getTripById(tripId);
    tripData.lastUpdate = new Date().getTime();
    tripData.end_date = data.end_date;
    tripData.end_odo = data.end_odo;
    tripData.stat = "finished";
    tripData.distance = tripData.end_odo - tripData.start_odo;

    store.set('job_' + tripId, tripData);

    db.clearActiveTrip();
    return true;

  };

  db.getTripById = function(tripId) {

    return store.get('job_' + tripId) || false;

  };

  db.getTrips = function() {

    var al = store.getAll();
    var trips = [];

    for ( key in al ) {
      if (! al.hasOwnProperty(key) ) continue;

      if ( key.substring(0,4) == "job_" ) {
        trips.push(al[key]);
      }

    }

    return trips;

  };

})(window);
