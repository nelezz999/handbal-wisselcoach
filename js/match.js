function startMatch(){

if(
    Object.values(currentLineup)
    .filter(Boolean)
    .length === 6
){
    document.getElementById("prepScreen").classList.add("hidden");
    document.getElementById("matchScreen").classList.remove("hidden");
    return;
}

homeScore = 0;
awayScore = 0;

document.getElementById("homeTeamLabel").innerText =
document.getElementById("homeTeamName").value || "Thuis";

document.getElementById("awayTeamLabel").innerText =
document.getElementById("awayTeamName").value || "Uit";

document.getElementById("homeScore").innerText = 0;
document.getElementById("awayScore").innerText = 0;

document.getElementById("substitutionHistory").innerHTML =
"Nog geen wissels";

document.getElementById("subAdvice").innerHTML =
"Coachadvies verschijnt na voldoende speeltijd.";

document.getElementById("alertBanner").style.display = "none";

matchSeconds = 0;

matchArchived = false;

currentLineup = {};
pauseTimer();

document
.getElementById("downloadReportBtn")
.classList.add("hidden");

playTimes = {};
benchCount = {};
substitutionLog = [];
keeperTime = {};
positionTimes = {};

document
.getElementById("timer")
.innerText = "00:00";

document.getElementById(
"matchPhase"
).innerText = "1e Helft";

const availablePlayers =

players.filter(
    player =>
    playerAvailable[player]
);

if(availablePlayers.length < 6){

    alert(
    "Minimaal 6 aanwezige speelsters nodig"
    );

    return;
}

const availableKeepers =
players.filter(
    player =>
    playerKeepers[player] &&
    playerAvailable[player]
);

if(availableKeepers.length === 0){

    alert(
        "Minimaal één beschikbare keeper vereist"
    );

    return;
}

document.getElementById("prepScreen")
.classList.add("hidden");

document.getElementById("matchScreen")
.classList.remove("hidden");

scrollToTop();

updateFieldDisplay();
renderPlayingTimes();
renderSwitchCompass();
renderSubstitutionHistory();
calculateSubAdvice();
updateFairPlay();
updateNextSwitchTimer();  


}

function resetMatch(){

    if(
        !confirm(
            "Wedstrijd resetten?\n\nHuidige wedstrijdgegevens gaan verloren."
        )
    ){
        return;
    }

    homeScore = 0;
    awayScore = 0;

matchSeconds = 0;
matchArchived = false;

localStorage.removeItem(
    "activeMatch"
);

pauseTimer();

playTimes = {};
benchCount = {};
keeperTime = {};
substitutionLog = [];
currentLineup = {};
positionTimes = {};
currentAdvice = [];

document.getElementById("homeScore").innerText = "0";
document.getElementById("awayScore").innerText = "0";

document.getElementById("timer").innerText = "00:00";

document.getElementById("matchPhase").innerText =
	"1e Helft";

document.getElementById("substitutionHistory").innerHTML =
	"Nog geen wissels";

document.getElementById("subAdvice").innerHTML =
"Coachadvies verschijnt na voldoende speeltijd.";

document.getElementById("playTimesView").innerHTML =
    	"Nog geen speeltijden";

document.getElementById("benchPlayers").innerHTML = "";

document.getElementById("homeTeamLabel").innerText = "Thuis";

document.getElementById("awayTeamLabel").innerText = "Uit";

const fairPlay =
document.getElementById("fairPlayStatus");

fairPlay.innerHTML =
"🟢 Team is in balans";

fairPlay.style.color = "green";

updateFieldDisplay();
renderPlayingTimes();
renderSubstitutionHistory();
renderSwitchCompass();
updateFairPlay();

const timerButton =
document.getElementById(
    "timerToggleBtn"
);

if(timerButton){

    timerButton.innerHTML =
    "▶ Start";

}

}

function goalHome(){

buttonFeedback(
    "homePlusBtn"
);

    homeScore++;

    document
    .getElementById("homeScore")
    .innerText =
    homeScore;

    queueSave();
}

function goalAway(){

buttonFeedback(
    "awayPlusBtn"
);

    awayScore++;

    document
    .getElementById("awayScore")
    .innerText =
    awayScore;

    queueSave();
}

function undoHomeGoal(){

    if(homeScore > 0){

buttonFeedback(
    "homeMinusBtn"
);

        homeScore--;

        document
        .getElementById("homeScore")
        .innerText =
        homeScore;

        queueSave();
    }
}

function undoAwayGoal(){

    if(awayScore > 0){

        buttonFeedback(
            "awayMinusBtn"
        );

        awayScore--;

        document
        .getElementById("awayScore")
        .innerText =
        awayScore;

        queueSave();
    }
}

function toggleTimer(){

    buttonFeedback(
        "timerToggleBtn"
    );

    if(timerInterval){

        pauseTimer();

    } else {

        startTimer();

    }

}

function startTimer(){

const filledPositions =
Object.values(currentLineup)
.filter(player => player)
.length;

if(filledPositions < 6){

    alert(
        "Vul eerst alle 6 posities van de opstelling in."
    );

    return;
}

if(!currentLineup.keeper){

    alert(
        "Selecteer eerst een keeper."
    );

    return;
}

    if(matchSeconds < 1200){

        document.getElementById(
            "matchPhase"
        ).innerText = "1e Helft";

    } else {

        document.getElementById(
            "matchPhase"
        ).innerText = "2e Helft";
    }

if(timerInterval){
    return;
}

document.getElementById(
    "timerToggleBtn"
).innerHTML =
"⏸ Pauze";
    
timerInterval = setInterval(() => {

    matchSeconds++;

    updateTimer();

    updatePlayingTimes();

    updateNextSwitchTimer();

    if(matchSeconds % 60 === 0){
        saveMatchState();
    }

},1000);

}

function pauseTimer(){

    clearInterval(timerInterval);

    timerInterval = null;

    saveMatchState();

    document.getElementById(
        "timerToggleBtn"
    ).innerHTML =
    "▶ Start";

}

function updateTimer(){

const minutes =
Math.floor(matchSeconds/60);

const seconds =
matchSeconds % 60;

document
.getElementById("timer")
.innerText =

String(minutes)
.padStart(2,"0")

+

":"

+

String(seconds)
.padStart(2,"0");

if(matchSeconds === 600){

    pauseTimer();

    document.getElementById(
        "matchPhase"
    ).innerText = "Time-Out";

    showAlertBanner(
        "⏰ Time-Out"
    );

}

if(matchSeconds === 1200){

showAlertBanner(
        "⏰ Rust"
);

pauseTimer();

document.getElementById(
        "matchPhase"
).innerText = "Rust";

         alert("⏰ Rust");

}

if(matchSeconds === 1800){

    pauseTimer();

document.getElementById(
    "matchPhase"
).innerText = "Time-Out";

showAlertBanner(
        "⏰ Time-Out"
    );

}

if(matchSeconds === 2400){

pauseTimer();

document.getElementById(
        "matchPhase"
).innerText = "Einde";

        alert(
"🏁 Wedstrijd afgelopen\n\nDownload het wedstrijdrapport."
);

if(!matchArchived){

    saveMatchToArchive();

    localStorage.removeItem(
        "activeMatch"
    );

    matchArchived = true;

}

document
.getElementById("downloadReportBtn")
.classList.remove("hidden");

}

}

function updatePlayingTimes(){

    const activePlayers =
    Object.values(currentLineup);

    activePlayers.forEach(player => {

    playTimes[player] =
    (playTimes[player] || 0) + 1;

});

    const currentKeeper =
    currentLineup.keeper;

    if(currentKeeper){

        keeperTime[currentKeeper] =
        (keeperTime[currentKeeper] || 0) + 1;

    }

Object.entries(currentLineup)
.forEach(([position,player]) => {

    if(player){

        if(!positionTimes[player]){
    positionTimes[player] = {
        keeper:0,
        pivot:0,
        leftBack:0,
        rightBack:0,
        leftCorner:0,
        rightCorner:0
    };
}

positionTimes[player][position]++;


    }

});

    renderPlayingTimes();
    calculateSubAdvice();
    updateFairPlay();

}

function renderPlayingTimes(){

    let html = "";

html += `
<div style="
display:grid;
grid-template-columns:120px 60px 1fr;
gap:10px;
font-weight:bold;
border-bottom:1px solid #ddd;
padding-bottom:4px;
margin-bottom:6px;
color:#002B5C;
">
<span>Speelster</span>
<span>Tijd</span>
<span>Posities</span>

</div>
`;

const values =
players
.filter(player => playerAvailable[player])
.map(player => getTotalPlayTime(player));

const maxTime =
Math.max(...values, 0);

    players
   .filter(player => playerAvailable[player])
   .forEach(player => {

    	const seconds =
	getTotalPlayTime(player);

const minutes =
Math.floor(seconds / 60);

        let color = "#4caf50";

        if(
            maxTime - seconds > 300
        ){
            color = "#f44336";
        }
        else if(
            maxTime - seconds > 120
        ){
            color = "#ff9800";
        }

const labels = {
    keeper:"KP",
    pivot:"CIR",
    leftBack:"LO",
    rightBack:"RO",
    leftCorner:"LH",
    rightCorner:"RH"
};

const currentPosition =
Object.keys(currentLineup)
.find(
    pos => currentLineup[pos] === player
);

let currentPositionText = "";
let previousPositions = [];

Object.entries(positionTimes[player] || {})
.forEach(([position,time]) => {

    if(time <= 0){
        return;
    }

    if(position === currentPosition){

        currentPositionText =
        labels[position];

    } else {

        previousPositions.push(
            labels[position]
        );

    }

});

html += `

<div
style="
display:grid;
grid-template-columns:120px 60px 1fr;
gap:10px;
color:${color};
font-weight:bold;
font-size:14px;
margin-bottom:6px;
">

<span>${player}</span>

<span>
    ${minutes} min
</span>

<span>${currentPositionText}

        <span style="
            font-size:11px;
            color:#888;
            font-weight:normal;
        ">
            ${
                previousPositions.length
                ? " · " + previousPositions.join(" · ")
                : ""
            }
        </span>
    </span>

</div>

`;    });

    document
    .getElementById("playTimesView")
    .innerHTML = html;
}

function renderSwitchCompass(){

    let html = "";

    const availableCount =

    players.filter(
        player => playerAvailable[player]
    ).length;

    if(availableCount === 10){

        html = `
        <b>10 speelsters</b>
        <br><br>
        2 wissels elke 5 minuten
        `;
    }

    else if(availableCount === 9){

        html = `
        <b>9 speelsters</b>
        <br><br>
        3 wissels elke 5 minuten
        `;
    }

    else if(availableCount === 8){

        html = `
        <b>8 speelsters</b>
        <br><br>
        2 wissels elke 5 minuten
        `;
    }

    else{

        html =
        "Beschikbaar bij 8, 9 of 10 aanwezige speelsters";
    }

    document
    .getElementById("switchCompass")
    .innerHTML = html;
}

function renderSubstitutionHistory(){

    if(substitutionLog.length === 0){

        document
        .getElementById("substitutionHistory")
        .innerHTML =
        "Nog geen wissels";

        return;
    }

    document
    .getElementById("substitutionHistory")
    .innerHTML =

    substitutionLog.map(item => {

        // Positiewijziging
        if(item.type === "positionChange"){

            return `
            <div class="history-row">

                <span class="history-minute">
                    ${item.minute}
                </span>

                <span class="history-position">
                    ${item.player}
                </span>

                <span class="history-in">
                    ${item.from}
                </span>

                <span class="history-out">
                    ${item.to}
                </span>

            </div>
            `;
        }

        // Lege positie ingevuld vanaf bank
        if(item.type === "lineupFill"){

            return `
            <div class="history-row">

                <span class="history-minute">
                    ${item.minute}
                </span>

                <span class="history-position">
                    ${item.position}
                </span>

                <span class="history-in">
                    IN: ${item.incoming}
                </span>

                <span class="history-out">
                    -
                </span>

            </div>
            `;
        }

        // Normale wissel
        return `
        <div class="history-row">

            <span class="history-minute">
                ${item.minute}
            </span>

            <span class="history-position">
                ${item.position}
            </span>

            <span class="history-in">
                IN: ${item.incoming}
            </span>

            <span class="history-out">
                UIT: ${item.outgoing}
            </span>

        </div>
        `;

    }).join("");

}

function calculateSubAdvice(){

    if(matchSeconds < 60){

        document.getElementById("subAdvice").innerHTML =
        "Wisseladvies beschikbaar vanaf 1 minuut speeltijd";

        return;
    }

const activePlayers =

Object.entries(currentLineup)
.filter(([position]) => position !== "keeper")
.map(([,player]) => player)
.filter(Boolean);

    const benchPlayers =
    players.filter(
        player =>
        playerAvailable[player] &&
        !Object.values(currentLineup)
.includes(player)
    );

    if(benchPlayers.length === 0){

        document.getElementById("subAdvice").innerHTML =
        "Geen bankspelers beschikbaar";

        return;
    }

    const availablePlayers =
    players.filter(
        player => playerAvailable[player]
    );

    const allTimes =
    availablePlayers.map(
        player => getTotalPlayTime(player)
    );

    const maxTime =
    Math.max(...allTimes);

    const minTime =
    Math.min(...allTimes);

    const difference =
    maxTime - minTime;

    if(difference < 90){

        document.getElementById("subAdvice").innerHTML = `
            <div style="
                color:#2e7d32;
                font-weight:bold;
                margin-bottom:10px;
            ">
                Speeltijden zijn goed in balans
            </div>

            Geen wisseladvies nodig.
        `;

        return;
    }

    const sortedFieldPlayers =
    activePlayers
    .slice()
    .sort(
        (a,b) =>
        getTotalPlayTime(b) -
        getTotalPlayTime(a)
    );

    const sortedBenchPlayers =
    benchPlayers
    .slice()
    .sort(
        (a,b) =>
        getTotalPlayTime(a) -
        getTotalPlayTime(b)
    );

    let adviceCount = 1;

    const availableCount =
    availablePlayers.length;

    if(availableCount === 8){
        adviceCount = 2;
    }

    if(availableCount === 9){
        adviceCount = 3;
    }

    if(availableCount >= 10){
        adviceCount = 2;
    }

    currentAdvice = [];

    let adviceHtml = `
    <b>Geadviseerde wissels</b>
    <br><br>
    `;

    for(
        let i = 0;
        i < Math.min(
            adviceCount,
            sortedFieldPlayers.length,
            sortedBenchPlayers.length
        );
        i++
    ){

const outgoing =
sortedFieldPlayers[i];

const incoming =
sortedBenchPlayers[i];

const playGap =
getTotalPlayTime(outgoing) -
getTotalPlayTime(incoming);

if(playGap < 120){
    continue;
}

        const position =
        Object.keys(currentLineup)
        .find(
            pos =>
            currentLineup[pos] === outgoing
        );

        currentAdvice.push({
            incoming,
            outgoing,
            position
        });

        adviceHtml += `
        <div style="
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin-bottom:10px;
            padding:8px;
            background:#f7f9fc;
            border-radius:8px;
        ">

            <div>
                ${incoming}
                → voor
                ${outgoing}
                (${getPositionLabel(position)})
                <br>
                <small style="color:#666;">
                    ${Math.floor(getTotalPlayTime(incoming)/60)} min
                    ↔
                    ${Math.floor(getTotalPlayTime(outgoing)/60)} min
                </small>
            </div>

<button
id="adviceBtn_${i}"
style="
    width:auto;
    min-width:50px;
    padding:6px 10px;
"
onclick="
    buttonFeedback('adviceBtn_${i}');

    setTimeout(() => {

        editingPosition='${position}';
        selectPlayerForPosition('${incoming}');

    }, 150);
"
>
✓
</button>

</div>

`;

}

if(currentAdvice.length === 0){

    document.getElementById("subAdvice").innerHTML = `
        <div style="
            color:#2e7d32;
            font-weight:bold;
        ">
            Geen wissels nodig op dit moment.
        </div>
    `;

    return;
}

document.getElementById("subAdvice").innerHTML =
adviceHtml;

}

function updateFairPlay(){

const times =
players
.filter(player =>
    playerAvailable[player]
)
.map(player => getTotalPlayTime(player));

if(times.length < 2){

    document.getElementById(
        "fairPlayStatus"
    ).innerHTML =
    "🟢 Nog onvoldoende speeltijd";

    return;
}

    const max =
    Math.max(...times);

    const min =
    Math.min(...times);

const diffSeconds = max - min;
const diffMinutes =
Math.round(diffSeconds / 60);

    const status =
    document.getElementById(
        "fairPlayStatus"
    );

if(matchSeconds < 1200){

    status.innerHTML =
    "Fair Play beoordeling start na rust";

    status.style.color = "#1565c0";

    return;
}

    if(diffSeconds >= 600){

    status.innerHTML =
    "🔴 Groot verschil: " +
    diffMinutes +
    " minuten";

    status.style.color = "red";

}
else if(diffSeconds >= 300){

    status.innerHTML =
    "🟠 Let op: " +
    diffMinutes +
    " minuten verschil";

    status.style.color = "orange";

}
else{

    status.innerHTML =
    "🟢 Speeltijden zijn in balans";

    status.style.color = "green";

}

}

function updateNextSwitchTimer(){

    const switchMoments = [

        { time: 300,  label: "05:00" },
        { time: 600,  label: "10:00 (Time-out)" },
        { time: 900,  label: "15:00" },
        { time: 1200, label: "20:00 (Rust)" },

        { time: 1500, label: "25:00" },
        { time: 1800, label: "30:00 (Time-out)" },
        { time: 2100, label: "35:00" },
        { time: 2400, label: "40:00 (Einde)" }

    ];

    const card =
    document.getElementById("nextSwitchTimer");

    const nextMoment =
    switchMoments.find(
        moment => matchSeconds < moment.time
    );

    if(!nextMoment){

        card.innerHTML =
        "🏁 Wedstrijd afgelopen";

        card.style.background = "#eeeeee";
        card.style.color = "#424242";

        return;
    }

    const remaining =
    nextMoment.time - matchSeconds;

    card.innerHTML =
    `⏱ Wisselmoment op ${nextMoment.label}`;

    // Normaal
    card.style.background = "#e8f5e9";
    card.style.color = "#2e7d32";

    // Laatste 2 minuten = oranje
    if(remaining <= 120 && remaining > 60){

        card.style.background = "#fff3e0";
        card.style.color = "#ef6c00";

    }

    // Laatste minuut = rood
    if(remaining <= 60){

        card.style.background = "#ffebee";
        card.style.color = "#c62828";

    }

}


