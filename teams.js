function addPlayer(){

    const name =
    document.getElementById("playerName")
    .value
    .trim();

    if(name === ""){
        return;
    }

    if(
        players.some(
            player =>
            player.toLowerCase() ===
            name.toLowerCase()
        )
    ){
        alert("Speelster bestaat al");
        return;
    }

    if(players.length >= 15){

        alert("Maximaal 15 speelsters");

        return;
    }

    playerAvailable[name] = true;

    players.push(name);

    playerHandedness[name] = "right";

    playerKeepers[name] = false;

    document.getElementById(
        "playerName"
    ).value = "";

renderPlayers();
saveTeam();
}

function saveTeam(showMessage = false){

const teamName =
document.getElementById("teamName")
.value
.trim()
.toUpperCase();

    if(!teamName){

        alert("Geef een teamnaam op");

        return;
    }

    const teamData = {

	teamName,

        players,

        playerHandedness,

        playerKeepers,

        playerAvailable

    };

    localStorage.setItem(

        "team_" + teamName,

        JSON.stringify(teamData)

    );

    refreshTeamList();

    document.getElementById(
       "teamSelect"
    ).value = teamName;

document.getElementById(
    "selectedTeamName"
).innerText =
"Team: " + teamName;

if(showMessage){

    showAlertBanner(
        "✅ Team " + teamName + " opgeslagen"
    );

}

}

function deleteTeam(){

    const teamName =
    document.getElementById("teamSelect").value;

    if(!teamName){

        alert("Selecteer eerst een team");

        return;
    }

    if(
        !confirm(
            "Team " + teamName + " verwijderen?"
        )
    ){
        return;
    }

localStorage.removeItem(
    "team_" + teamName
);

localStorage.removeItem(
    "activeMatch"
);

    refreshTeamList();

players = [];
playerHandedness = {};
playerKeepers = {};
playerAvailable = {};
playTimes = {};
benchCount = {};
keeperTime = {};
positionTimes = {};
substitutionLog = [];
currentLineup = {};
currentAdvice = [];
renderPlayers();

document.getElementById("playerProfiles")
.innerHTML =
"Nog geen speelsters";

document.getElementById("attendanceList")
.innerHTML =
"Nog geen speelsters";

renderSwitchCompass();

document.getElementById(
    "selectedTeamName"
).innerText =
"Geen team geladen";

document.getElementById(
    "teamSelect"
).value = "";

document.getElementById(
    "teamName"
).value = "";

document.getElementById("matchScreen")
.classList.add("hidden");

document.getElementById("prepScreen")
.classList.remove("hidden");

}

function loadSelectedTeam(){

    const teamName =
    document.getElementById(
        "teamSelect"
    ).value;

    // Nieuw team aanmaken
    if(teamName === "NEW_TEAM"){

        const newTeam =
        prompt("Teamnaam");

        if(!newTeam){

            document.getElementById(
                "teamSelect"
            ).value = "";

            return;
        }

        document.getElementById(
            "teamName"
        ).value =
        newTeam.trim().toUpperCase();

        saveTeam(true);

        return;
    }

    if(!teamName){
        return;
    }

    const data =
    localStorage.getItem(
        "team_" + teamName
    );

    if(!data){
        return;
    }

    const team =
    JSON.parse(data);

    players =
    team.players || [];

    playerHandedness =
    team.playerHandedness || {};

    playerKeepers =
    team.playerKeepers || {};

    playerAvailable =
    team.playerAvailable || {};

    playTimes = {};
    benchCount = {};
    keeperTime = {};
    positionTimes = {};
    substitutionLog = [];
    currentLineup = {};

    document.getElementById(
        "teamName"
    ).value = teamName;

    document.getElementById(
        "activeTeamName"
    ).innerText =
    "Team: " + teamName;

    document.getElementById(
        "selectedTeamName"
    ).innerText =
    "Team: " + teamName;

    renderPlayers();

    document
    .getElementById("selectionContent")
    .classList.add("hidden");

    document
    .getElementById("profilesContent")
    .classList.add("hidden");

    renderSwitchCompass();

}

function refreshTeamList(){

    const select =
    document.getElementById("teamSelect");

   let html = `
<option value="">
-- Kies team --
</option>

<option value="NEW_TEAM">
Nieuw team...
</option>
`;

    const teams = [];

    for(let i = 0; i < localStorage.length; i++){

        const key =
        localStorage.key(i);

        if(key.startsWith("team_")){

            teams.push(
                key.replace("team_","")
            );
        }
    }

    teams.sort();

    teams.forEach(team => {

        html += `
        <option value="${team}">
            ${team}
        </option>`;
    });

    select.innerHTML = html;
}

function renderPlayers(){

    renderTeam();

    renderProfiles();

    renderAttendance();
}

function renderAttendance(){

    let html = "";

    players.forEach(player => {

        html += `

        <label>

            <input
            type="checkbox"

            ${playerAvailable[player]
            ? "checked"
            : ""}

onchange="
playerAvailable['${player}']
= this.checked;

renderSwitchCompass();

saveTeam();
"
	    >

            ${player}

        </label>

        <br>

        `;

    });

    document
    .getElementById(
        "attendanceList"
    )
    .innerHTML = html;
}

function renderProfiles(){

let html = "";

players.forEach(player => {

html += `

<div class="profile-card">

<strong>${player}</strong>

<div style="
display:flex;
gap:8px;
margin-top:10px;
">

<button
style="
background:#1565c0;
flex:1;
padding:6px 8px;
font-size:13px;
"
onclick="
playerHandedness['${player}']=
playerHandedness['${player}']==='right'
? 'left'
: 'right';

renderProfiles();
saveTeam();
"
>
${playerHandedness[player]==='left'
? 'Linkshandig'
: 'Rechtshandig'}
</button>

<button
style="
background:${playerKeepers[player] ? '#2e7d32' : '#757575'};
flex:1;
padding:6px 8px;
font-size:13px;
"
onclick="
playerKeepers['${player}']=!playerKeepers['${player}'];

renderProfiles();
saveTeam();
"
>
${playerKeepers[player]
? 'Keeper'
: 'Geen keeper'}
</button>

</div>

</div>

`;
        
});

    document.getElementById(
        "playerProfiles"
    ).innerHTML = html;
}

function removePlayer(index){

    const removedPlayer =
    players[index];

delete playerHandedness[removedPlayer];
delete playerKeepers[removedPlayer];
delete playerAvailable[removedPlayer];
delete playTimes[removedPlayer];
delete benchCount[removedPlayer];
delete keeperTime[removedPlayer];
delete positionTimes[removedPlayer];

currentAdvice =
currentAdvice.filter(
    advice =>
    advice.incoming !== removedPlayer &&
    advice.outgoing !== removedPlayer
);

Object.keys(currentLineup)
.forEach(position => {

    if(currentLineup[position] === removedPlayer){

        currentLineup[position] = "";

    }

});


players.splice(index,1);

renderPlayers();

updateFieldDisplay();
renderSubstitutionHistory();
saveTeam();

}

function renderTeam(){
    let html="";

    players.forEach((player,index)=>{

    html+=`
    <div class="player-line">

        ${player}

<button
id="removePlayerBtn_${index}"
class="remove-player-btn"
onclick="
buttonFeedback('removePlayerBtn_${index}');
setTimeout(() => {
    removePlayer(${index});
},150);
">
✖
</button>

</div>
    `;
});

    document.getElementById("playerList").innerHTML=html;
}

