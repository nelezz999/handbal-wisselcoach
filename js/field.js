function updateFieldDisplay(){

const emptyIcon =
'<span style="color:#90a4ae;font-size:28px;font-weight:300;">+</span>';

    // Veldposities tonen

document.getElementById("mKeeper").innerHTML =
currentLineup.keeper || emptyIcon;

document.getElementById("mPivot").innerHTML =
currentLineup.pivot || emptyIcon;

document.getElementById("mLO").innerHTML =
currentLineup.leftBack || emptyIcon;

document.getElementById("mRO").innerHTML =
currentLineup.rightBack || emptyIcon;

document.getElementById("mLH").innerHTML =
currentLineup.leftCorner || emptyIcon;

document.getElementById("mRH").innerHTML =
currentLineup.rightCorner || emptyIcon;

    // Bankspelers bepalen

const fieldPlayers =
Object.values(currentLineup)
.filter(Boolean);

const benchPlayers =
players.filter(
player =>
playerAvailable[player] &&
!fieldPlayers.includes(player)
    
);

    document
    .getElementById("benchPlayers")
    .innerHTML =

    benchPlayers.length

    ? benchPlayers.map(player =>

        `<span class="bench-chip">
        ${player}
        </span>`

      ).join("")

    : "Geen bankspelers";

}

function editPosition(position){

    editingPosition = position;

    const currentPlayer =
    currentLineup[position] || "";

let html =
`
<div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    margin-bottom:15px;
">

    <strong>
        ${getPositionLabel(position)}
    </strong>

<button
    onclick="closePositionEditor()"
    style="
        width:32px;
        height:32px;
        padding:0;
        background:transparent;
        color:#666;
        border:none;
        font-size:24px;
        font-weight:bold;
    "
>
    ×
</button>

</div>
`;

if(currentPlayer){

html += `
<div style="
margin-bottom:12px;
color:#1565c0;
font-weight:bold;
">
${currentPlayer} (huidig)
</div>`;
}

const benchPlayers =
players.filter(player =>
    playerAvailable[player] &&
    !Object.values(currentLineup).includes(player)
);

const fieldPlayers =
players.filter(player =>
    playerAvailable[player] &&
    Object.values(currentLineup).includes(player) &&
    player !== currentPlayer
);

if(
    benchPlayers.length === 0 &&
    fieldPlayers.length === 0
){
    html += `
    <p>Geen beschikbare speelsters.</p>
    `;
}

html += `
<h3 style="
color:#43a047;
margin:15px 0 10px 0;
">
🟢 Bankspelers
</h3>
`;

benchPlayers.forEach(player => {

    html += `
    <button
        style="
            margin-bottom:8px;
            width:100%;
            text-align:left;

            background:#e8f5e9;
            color:#2e7d32;
            border:1px solid #81c784;
        "
        onclick="selectPlayerForPosition('${player}')"
    >
        ${player}
${playerKeepers[player] ? " • KP" : ""}
${playerHandedness[player] === "left" ? " • Links" : ""}
    </button>`;
});

html += `
<h3 style="
color:#1565c0;
margin:15px 0 10px 0;
">
🔵 Veldspelers
</h3>
`;

fieldPlayers.forEach(player => {

    const playerPosition =
    Object.keys(currentLineup).find(
        pos => currentLineup[pos] === player
    );

    const labels = {
        keeper:"KP",
        pivot:"CIR",
        leftBack:"LO",
        rightBack:"RO",
        leftCorner:"LH",
        rightCorner:"RH"
    };

    html += `
    <button
        style="
            margin-bottom:8px;
            width:100%;
            text-align:left;

            background:#e3f2fd;
            color:#1565c0;
            border:1px solid #64b5f6;
        "
        onclick="selectPlayerForPosition('${player}')"
    >
        ${player}
${playerKeepers[player] ? " • KP" : ""}
${playerHandedness[player] === "left" ? " • Links" : ""}
• ${labels[playerPosition]}

    </button>`;
});

    html += `
    <button
        onclick="closePositionEditor()"
        style="
            background:#757575;
            margin-top:10px;
        "
    >
        Sluiten
    </button>`;

const editor =
document.getElementById("positionEditor");

editor.innerHTML = html;

editor.classList.remove("hidden");

editor.scrollTop = 0;

}

function closePositionEditor(){

    document.getElementById("positionEditor")
    .classList.add("hidden");

    editingPosition = null;
}

function selectPlayerForPosition(player){

    const existingPosition =
    Object.keys(currentLineup).find(
        pos => currentLineup[pos] === player
    );

    const outgoing =
    currentLineup[editingPosition] || "";

    // Veldspeelster verplaatst naar LEGE positie
    if(
        existingPosition &&
        existingPosition !== editingPosition &&
        !outgoing
    ){

        substitutionLog.unshift({

            type: "positionChange",

            minute:
            String(
                Math.floor(matchSeconds / 60)
            ).padStart(2,"0") + "'",

            player: player,

            from:
            getPositionLabel(existingPosition),

            to:
            getPositionLabel(editingPosition)

        });

        currentLineup[existingPosition] = "";

    }

    // Veldspeelster verplaatst naar BEZETTE positie
    else if(
        existingPosition &&
        existingPosition !== editingPosition &&
        outgoing
    ){

        substitutionLog.unshift({

            type: "substitution",

            minute:
            String(
                Math.floor(matchSeconds / 60)
            ).padStart(2,"0") + "'",

            position:
            getPositionLabel(editingPosition),

            incoming: player,
            outgoing: outgoing

        });

        currentLineup[existingPosition] = "";

    }

    // Bankspeler vult lege positie
    else if(
        !existingPosition &&
        !outgoing &&
        matchSeconds > 0
    ){

        substitutionLog.unshift({

            type: "lineupFill",

            minute:
            String(
                Math.floor(matchSeconds / 60)
            ).padStart(2,"0") + "'",

            position:
            getPositionLabel(editingPosition),

            incoming: player

        });

    }

    // Normale wissel
    else if(
        !existingPosition &&
        outgoing &&
        outgoing !== player
    ){

        substitutionLog.unshift({

            type: "substitution",

            minute:
            String(
                Math.floor(matchSeconds / 60)
            ).padStart(2,"0") + "'",

            position:
            getPositionLabel(editingPosition),

            incoming: player,
            outgoing: outgoing

        });

    }

    currentLineup[editingPosition] = player;

    renderSubstitutionHistory();

    currentAdvice =
    currentAdvice.filter(
        advice =>
        !(
            advice.incoming === player &&
            advice.position === editingPosition
        )
    );

    updateFieldDisplay();
    calculateSubAdvice();
    updateFairPlay();
    queueSave();
    closePositionEditor();

}

function getPositionLabel(position){

    const labels = {

        keeper: "Keeper",
        pivot: "Cirkellijn",
        leftBack: "Linkeropbouw",
        rightBack: "Rechteropbouw",
        leftCorner: "Linkerhoek",
        rightCorner: "Rechterhoek"

    };

    return labels[position] || position;
}
