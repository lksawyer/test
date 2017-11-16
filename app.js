// Client ID and API key from the Developer Console
var CLIENT_ID = '908655633390-bipca08v5p9tkot7cjul1pgtcbd4ts10.apps.googleusercontent.com';
var API_KEY = 'AIzaSyCcz_rY6GhH9tTnejrKQgbxXu7y8CM2Fjg';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

var authorizeButton = document.getElementById('signin-button');
var signoutButton = document.getElementById('signout-button');

/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    listUpcomingEvents();
    // ajaxCall();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

//API Calls
//=========================

//Setup Variables
//=========================

//Creates a javascript date for todays date. May be incremented/decremented

var currentDate = new Date().getTime();
console.log(currentDate); 
// Hours part from the timestamp
var hours = currentDate.getHours();
// Minutes part from the timestamp
var minutes = "0" + currentDate.getMinutes();
// Seconds part from the timestamp
var seconds = "0" + currentDate.getSeconds();

// Will display time in 10:30:23 format
var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
console.log(formattedTime);


// Convertes current date to formatt that can be used in API calls
var currentDateGoogle = currentDate.toISOString();
console.log(currentDateGoogle);

// Convertes current date to midnight
var timeMin = currentDate.setHours(0,0,0);
console.log(timeMin);

//Converts current dat to 11:59:59:999 pm
var timeMax = currentDate.setHours(23,59,59,999);
console.log(timeMax);

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    //'timeMin': (new Date()).toISOString(),
    'timeMin': "2017-11-15T00:00:00.000Z",
    'timeMax' : "2017-11-15T23:59:59.999Z",
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    var events = response.result.items;
    console.log(events);

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        console.log(event.summary + ' (' + when + ')')
      }
    } else {
      console.log('No upcoming events found.');
    }
  });
}

// //Setup Variables
// //=========================

// var queryBaseURL = "https://www.googleapis.com/calendar/v3/calendars/primary/events";

// //Functions
// //=========================


// function ajaxCall (button) {
  
//   $.ajax({url:queryBaseURL, method: "GET"})
//     .done( function (giphyData) {
//       console.log("Inside API Call");
//       console.log(giphyData);
//       // for(i=0; i<giphyData.data.length; i++) {


//       // };
//     });

// };

