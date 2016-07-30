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
    tripData.rego = tripData.rego.toUpperCase();

    store.set('job_' + tripId,tripData);
    store.set('most_recent_trip', tripId);
    store.set('trip_active', true);

    db.setLastRego(tripData.rego);

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

  db.getLastRego = function() {

    var rego = store.get('last_rego');

    return rego;

  };

  db.setLastRego = function( rego ) {

    store.set('last_rego', rego);

  };

  db.setDefaultEndpoint = function(uri) {

    store.set('endpoint', uri);

  };

  db.getDefaultEndpoint = function() {
    return store.get('endpoint');
  };

  db.setDefaultPass = function(pass) {

    store.set('pass', pass);

  };

  db.getDefaultPass = function() {
    return store.get('pass');
  };

  db.clearFinishedTrips = function() {

    var trips = db.getTrips();

    for ( var i=0; i<trips.length; i++ ) {
      if ( trips[i].stat == 'finished' ) {
        db.deleteTrip(trips[i].tripId);
      }
    }

  };

  db.deleteTrip = function(tripId) {
    store.remove('job_' + tripId);
  };

})(window);
