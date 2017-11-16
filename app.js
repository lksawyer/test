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

//Creates a javascript date for todays date. May be incremented/decremented
var d = new Date ();

//Allows us to increment/decrement day
var dateOffset = 1;

//UTC date
// var currentDateUTC = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
// console.log("UTC" + currentDateUTC);

// Converts current date to midnight
//var timeMin = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours());
//console.log("Time Min" + timeMin);
var googleTimeMin = d.getUTCFullYear() + '-' + (d.getUTCMonth() +1 ) + "-" + (d.getUTCDate() + dateOffset) + 'T00:00:00.000Z'

//Converts current date to 11:59:59:999 pm
//var timeMax = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999);
//console.log("Time Max" + timeMax);
//2017-11-16T04:00:00.000Z toISOSString format
var googleTimeMax = d.getUTCFullYear() + '-' + (d.getUTCMonth() +1 ) + "-" + (d.getUTCDate() + dateOffset) + 'T23:59:59.999Z'

console.log("Min: " + googleTimeMin + ", Max: " + googleTimeMax);

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
  gapi.client.calendar.events.list({
    'calendarId': 'primary',
    //'timeMin': (new Date()).toISOString(),
    'timeMin': googleTimeMin,
    'timeMax' : googleTimeMax,
    'showDeleted': false,
    'singleEvents': true,
    'orderBy': 'startTime'
  }).then(function(response) {
    console.log(response);
    console.log(response.results);
    var events = response.result.items;
    console.log(events);

    //Example Code
    // if (events.length > 0) {
    //   for (i = 0; i < events.length; i++) {
    //     var event = events[i];
    //     var when = event.start.dateTime;
    //     if (!when) {
    //       when = event.start.date;
    //     }
    //     console.log(event.summary + ' (' + when + ')')
    //   }
    // } else {
    //   console.log('No upcoming events found.');
    // }

    //Clears out event-container on sign in
    $("#event-container").empty();

    if (events.length > 0) {
      for (i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }

        //Stores event[i].when, event.[i].summmary, event[i].id in var writeEvent
        var writeEvent = $(

          '<div class="event" data-eventid='+ event.id + '> <div class="event-header"> <i class="fa fa-pencil" aria-hidden="true" data-toggle="tooltip" data-placement="top" title="Edit Event"></i></div><div>' + when + '&nbsp&nbsp|&nbsp&nbsp' + event.summary + '</div><div>'

          );

        //Appends content of writeEvent and summary to generated divs
        $("#event-container").append(writeEvent);      
      }
    } else {

       //Appends 'No upcoming events found.' to #event-container if there are no upcoming events
      $("#event-container").append('No upcoming events found.');
    }

  });
}

