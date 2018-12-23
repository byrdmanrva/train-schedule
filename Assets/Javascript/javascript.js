// Setting global variables
var trainName = "";
var destination = "";
var frequency = "";
var nextArrival = "";
var minutesAway = "";
var firstTrain = "";
var currentTime = moment().format('HH:mm');

// Firebase setup
var config = {
    apiKey: "AIzaSyDBAtq5uQ2f0LouJtAilKQGnjMed_OqcWo",
    authDomain: "byrdman-train-schedule.firebaseapp.com",
    databaseURL: "https://byrdman-train-schedule.firebaseio.com",
    projectId: "byrdman-train-schedule",
    storageBucket: "byrdman-train-schedule.appspot.com",
    messagingSenderId: "618744525169"
  };
  
firebase.initializeApp(config);

var database = firebase.database();


$(document).ready(function () {
    // Displays current time
    $("#current-time").text("Current time: " + currentTime);
    $("#submit-button").on("click", function() {
        // When the submit button is clicked, the following code is run
        event.preventDefault();
        // Obtaining the values supplied by the user and setting them to blank global variables
        trainName = $("#train-name").val();
        destination = $("#destination").val();
        firstTrain = $("#first-train").val();
        frequency = $("#frequency").val();
        // Math to determine next train's arrival time along with how long in minutes until that arrival time
        var firstTimeConverted = moment(firstTrain, "HH:mm");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % frequency;
        var tMinutesTillTrain = frequency - tRemainder;
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        var nextTrainFormat = (moment(nextTrain).format("HH:mm"));
        var nextTrainString = nextTrainFormat.toString();
        database.ref().push({
            train: trainName,
            destination: destination,
            time: firstTrain,
            frequency: frequency,
            next: nextTrainString,
            minutes: tMinutesTillTrain,
        });
    });
});

// When a child is added, create and append new div with the information from firebase
database.ref().on("child_added", function(response){
    $("#train-name-new").append("<div>" + response.val().train);
    $("#destination-new").append("<div>" + response.val().destination);
    $("#frequency-new").append("<div>" + response.val().frequency + " minutes");
    $("#next-arrival-new").append("<div>" + response.val().next);
    $("#minutes-away-new").append("<div>" + response.val().minutes);
})