function loadArchive(){

    matchArchive =
    JSON.parse(
        localStorage.getItem("matchArchive")
    ) || [];

}

function saveArchive(){

    localStorage.setItem(
        "matchArchive",
        JSON.stringify(matchArchive)
    );

}

function renderArchive(){

    const container =
    document.getElementById(
        "archiveList"
    );

    if(matchArchive.length === 0){

        container.innerHTML =
        "Nog geen wedstrijden opgeslagen";

        return;

    }

    container.innerHTML =

    matchArchive.map(match =>

    `
    <div
    style="
    border:1px solid #ddd;
    border-radius:8px;
    padding:10px;
    margin-bottom:10px;
    ">

        <strong>
        ${match.homeTeam}
        -
        ${match.awayTeam}
        </strong>

        <br>

        Datum:
        ${match.date}

        <br>

        Eindstand:
        ${match.homeScore}
        -
        ${match.awayScore}

        <br><br>

<button
onclick="downloadArchivedMatch(${match.id})"
style="background:#2e7d32;margin-bottom:8px;">
    📄 Download rapport
</button>

<button
onclick="viewArchivedMatch(${match.id})"
style="
background:#1565c0;
margin-bottom:8px;
">
    👁 Details
</button>

<button
onclick="deleteArchiveMatch(${match.id})"
style="
background:#c62828;
">
    Verwijderen
</button>
    </div>
    `

    ).join("");

}

function showArchive(){

    renderArchive();

    document
    .getElementById("prepScreen")
    .classList.add("hidden");

    document
    .getElementById("archiveScreen")
    .classList.remove("hidden");

scrollToTop();

}

function closeArchive(){

    document
    .getElementById("archiveScreen")
    .classList.add("hidden");

    document
    .getElementById("prepScreen")
    .classList.remove("hidden");

scrollToTop();

}


function deleteArchiveMatch(id){

    if(
        !confirm(
            "Wedstrijd verwijderen?"
        )
    ){
        return;
    }

    matchArchive =
    matchArchive.filter(
        match => match.id !== id
    );

    saveArchive();

    renderArchive();

}



function saveMatchToArchive(){

const match = {

    id: Date.now(),

    date:
    new Date()
    .toLocaleDateString("nl-NL"),

    homeTeam:
    document.getElementById(
        "homeTeamLabel"
    ).innerText,

    awayTeam:
    document.getElementById(
        "awayTeamLabel"
    ).innerText,

    homeScore,

    awayScore,

    players:
    JSON.parse(
        JSON.stringify(players)
    ),
  
  playerAvailable:
  JSON.parse(
         JSON.stringify(playerAvailable)
    ),

playTimes:
JSON.parse(
    JSON.stringify(playTimes)
),

keeperTime:
JSON.parse(
   JSON.stringify(keeperTime)
),

positionTimes:
JSON.parse(
 JSON.stringify(positionTimes)
),

substitutions:
JSON.parse(
 JSON.stringify(substitutionLog)
)

};

matchArchive.unshift(match);

if(matchArchive.length > 50){
    matchArchive.pop();
}

saveArchive();

}

let saveTimeout = null;

function queueSave(){

    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(
        saveMatchState,
        500
    );

}
