/*
Handbal WisselCoach v1.3
© 2026 Niels te Heemskerk
Alle rechten voorbehouden.
Ongeoorloofde reproductie of verspreiding is verboden.
*/

let players=[];

let homeScore = 0;
let awayScore = 0;

let playerHandedness = {};
let playerKeepers = {};

let matchSeconds = 0;
let timerInterval = null;

let benchCount = {};
let playTimes = {};
let keeperTime = {};
let positionTimes = {};
let currentLineup = {};
let substitutionLog = [];
let playerAvailable = {};
let currentAdvice = [];

let matchArchive = [];
let matchArchived = false;
let alertTimeout = null;
let editingPosition = null;


function backToSetup(){

    buttonFeedback(
        "prepBtn"
    );

    setTimeout(() => {

        document
        .getElementById("matchScreen")
        .classList.add("hidden");

        document
        .getElementById("prepScreen")
        .classList.remove("hidden");

        scrollToTop();

        queueSave();

    }, 120);

}

window.onload = function () {

    refreshTeamList();

    loadArchive();

    restoreMatchState();

    if(!localStorage.getItem("coachInfoSeen")){

        showInfoModal();

        localStorage.setItem(
            "coachInfoSeen",
            "true"
        );

    }

};

if ("serviceWorker" in navigator) {

    navigator.serviceWorker.register("sw.js");

}
