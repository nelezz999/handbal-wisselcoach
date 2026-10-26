function saveMatchState(){

    const state = {

timerRunning: timerInterval !== null,

matchSeconds,
homeScore,
awayScore,

players,
playerAvailable,
playerHandedness,
playerKeepers,

playTimes,
keeperTime,
positionTimes,

currentAdvice,

currentLineup,
substitutionLog,
benchCount,

        homeTeam:
            document.getElementById("homeTeamLabel").innerText,

        awayTeam:
            document.getElementById("awayTeamLabel").innerText,

homeTeamInput:
    document.getElementById("homeTeamName").value,

awayTeamInput:
    document.getElementById("awayTeamName").value

    };

    localStorage.setItem(
        "activeMatch",
        JSON.stringify(state)
    );
}

function restoreMatchState(){

    const saved =
    localStorage.getItem("activeMatch");

    if(!saved){
        return;
    }

    const state =
    JSON.parse(saved);

    matchSeconds = state.matchSeconds || 0;
    homeScore = state.homeScore || 0;
    awayScore = state.awayScore || 0;

document.getElementById("homeTeamLabel").innerText =
    state.homeTeam || "Thuis";

document.getElementById("awayTeamLabel").innerText =
    state.awayTeam || "Uit";

document.getElementById("homeTeamName").value =
    state.homeTeamInput || "";

document.getElementById("awayTeamName").value =
    state.awayTeamInput || "";

players = state.players || [];
playerAvailable = state.playerAvailable || {};
playerHandedness = state.playerHandedness || {};
playerKeepers = state.playerKeepers || {};
playTimes = state.playTimes || {};
keeperTime = state.keeperTime || {};
positionTimes = state.positionTimes || {};
currentLineup = state.currentLineup || {};
substitutionLog = state.substitutionLog || [];
benchCount = state.benchCount || {};
currentAdvice = state.currentAdvice || [];

    if(
        confirm(
            "Herstel vorige wedstrijd?"
        )
    ){

        document.getElementById("homeScore").innerText =
        homeScore;

        document.getElementById("awayScore").innerText =
        awayScore;

        document.getElementById("prepScreen")
        .classList.add("hidden");

        document.getElementById("matchScreen")
        .classList.remove("hidden");

scrollToTop();
renderPlayers();
renderSwitchCompass();

updateTimer();
updateFieldDisplay();
renderSubstitutionHistory();
renderPlayingTimes();
calculateSubAdvice();
updateFairPlay();
updateNextSwitchTimer();

if(
    state.timerRunning &&
    matchSeconds > 0 &&
    matchSeconds < 2400 &&
    Object.values(currentLineup).filter(Boolean).length === 6 &&
    currentLineup.keeper
){
    startTimer();
}
else{
    document.getElementById("timerToggleBtn").innerHTML =
    "▶ Start";
}

}

else{

    localStorage.removeItem(
        "activeMatch"
    );

    location.reload();

}

} 
