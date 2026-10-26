function downloadMatchReport(){

    const today =
    new Date().toLocaleDateString("nl-NL");

    const homeTeam =
    document.getElementById(
        "homeTeamLabel"
    ).innerText;

    const awayTeam =
    document.getElementById(
        "awayTeamLabel"
    ).innerText;

    const availablePlayers =
    players.filter(
        player => playerAvailable[player]
    );

    const labels = {
        keeper:"KP",
        pivot:"CIR",
        leftBack:"LO",
        rightBack:"RO",
        leftCorner:"LH",
        rightCorner:"RH"
    };

    let playTimesHtml = "";

    availablePlayers.forEach(player => {

        const totalMinutes =
        Math.floor(
            getTotalPlayTime(player) / 60
        );

        let positions = [];

        Object.entries(
            positionTimes[player] || {}
        ).forEach(([position,time]) => {

            if(time > 0){

                positions.push(
                    labels[position] +
                    " (" +
                    Math.floor(time / 60) +
                    "m)"
                );

            }

        });

        playTimesHtml += `
        <tr>
            <td>${player}</td>
            <td>${totalMinutes} min</td>
            <td>${positions.join(" • ")}</td>
        </tr>
        `;

    });

    const allTimes =
    availablePlayers.map(
        player => getTotalPlayTime(player)
    );

    const maxPlay =
    allTimes.length
    ? Math.max(...allTimes)
    : 0;

    const minPlay =
    allTimes.length
    ? Math.min(...allTimes)
    : 0;

    const fairPlayDiff =
    Math.floor(
        (maxPlay - minPlay) / 60
    );

    let fairPlayLabel =
    "Goed verdeeld";

    if(fairPlayDiff >= 10){
        fairPlayLabel =
        "Groot verschil";
    }
    else if(fairPlayDiff >= 5){
        fairPlayLabel =
        "Let op";
    }

    const highestPlayer =
    availablePlayers.find(
        player =>
        getTotalPlayTime(player) === maxPlay
    ) || "-";

    const lowestPlayer =
    availablePlayers.find(
        player =>
        getTotalPlayTime(player) === minPlay
    ) || "-";

    // =====================================================
    // Positieverdeling
    // =====================================================

    let positionSummaryHtml = "";

    Object.entries(labels)
    .forEach(([position,label]) => {

        const entries = [];

        availablePlayers.forEach(player => {

            const seconds =
            (positionTimes[player] || {})[position] || 0;

            if(seconds > 0){

                entries.push(
                    `${player} - ${Math.floor(seconds/60)} min`
                );

            }

        });

        if(entries.length){

            positionSummaryHtml += `
            <h3>${label}</h3>
            <ul>
                ${entries.map(
                    entry => `<li>${entry}</li>`
                ).join("")}
            </ul>
            `;
        }

    });

    // =====================================================
    // Wisselhistorie
    // =====================================================

    let substitutionsHtml = "";

    if(substitutionLog.length){

        substitutionsHtml =
        substitutionLog
        .slice()
        .reverse()
        .map(item => {

            if(item.type === "positionChange"){

                return `
                <tr>
                    <td>${item.minute}</td>
                    <td>${item.player}</td>
                    <td>${item.from}</td>
                    <td>${item.to}</td>
                </tr>
                `;
            }

            if(item.type === "lineupFill"){

                return `
                <tr>
                    <td>${item.minute}</td>
                    <td>${item.position}</td>
                    <td>${item.incoming}</td>
                    <td>-</td>
                </tr>
                `;
            }

            return `
            <tr>
                <td>${item.minute}</td>
                <td>${item.position}</td>
                <td>${item.incoming}</td>
                <td>${item.outgoing}</td>
            </tr>
            `;

        }).join("");

    }
    else{

        substitutionsHtml = `
        <tr>
            <td colspan="4">
                Geen wissels
            </td>
        </tr>
        `;
    }

    const report = `
<!DOCTYPE html>
<html lang="nl">

<head>

<meta charset="UTF-8">

<title>Wedstrijdrapport</title>

<style>

body{
    font-family:Arial,sans-serif;
    max-width:1000px;
    margin:auto;
    padding:20px;
}

h1{
    color:#002B5C;
    border-bottom:3px solid #FF7A00;
    padding-bottom:8px;
}

h2{
    color:#002B5C;
    border-bottom:2px solid #FF7A00;
    padding-bottom:4px;
    margin-top:30px;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
    margin-bottom:15px;
}

th,td{
    border:1px solid #d0d7de;
    padding:8px;
    text-align:left;
}

th{
    background:#eef2f7;
}

.result{
    font-size:24px;
    font-weight:bold;
    color:#002B5C;
    margin-bottom:20px;
}

.summary{
    background:#f7f9fc;
    padding:12px;
    border-radius:8px;
    margin-top:10px;
}

</style>

</head>

<body>

<h1>Handbal WisselCoach - Wedstrijdrapport</h1>

<div class="result">
${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}
</div>

<p>
<strong>Datum:</strong> ${today}
<br>
<strong>Aanwezig:</strong>
${availablePlayers.length} speelsters
</p>

<h2>Speeltijden</h2>

<table>

<tr>
    <th>Speelster</th>
    <th>Totaal</th>
    <th>Posities</th>
</tr>

${playTimesHtml}

</table>

<div class="summary">

<strong>
Fair Play: ${fairPlayLabel}
</strong>

<br><br>

Hoogste speeltijd:
${highestPlayer}
(${Math.floor(maxPlay/60)} min)

<br>

Laagste speeltijd:
${lowestPlayer}
(${Math.floor(minPlay/60)} min)

<br>

Verschil:
${fairPlayDiff} min

</div>

<h2>Positieverdeling</h2>

${positionSummaryHtml}

<h2>Wisselhistorie</h2>

<table>

<tr>
    <th>Minuut</th>
    <th>Positie / Speelster</th>
    <th>IN / Van</th>
    <th>UIT / Naar</th>
</tr>

${substitutionsHtml}

</table>

</body>

</html>
`;

    const blob =
    new Blob(
        [report],
        {type:"text/html"}
    );

    const link =
    document.createElement("a");

    link.href =
    URL.createObjectURL(blob);

    const safeHome =
    homeTeam.replace(/\s+/g,"_");

    const safeAway =
    awayTeam.replace(/\s+/g,"_");

    link.download =
    `Wedstrijdrapport_${safeHome}_${safeAway}.html`;

    link.click();

    URL.revokeObjectURL(link.href);

}

function downloadArchivedMatch(id){

    const match =
    matchArchive.find(m => m.id === id);

    if(!match){
        return;
    }

    let playTimesHtml = "";

    Object.keys(match.playTimes || {})
    .forEach(player => {

        const minutes =
        Math.floor(
            (match.playTimes[player] || 0) / 60
        );

const keeperMinutes =
Math.floor(
    (match.keeperTime?.[player] || 0) / 60
);

        const labels = {
            keeper:"KP",
            pivot:"CIR",
            leftBack:"LO",
            rightBack:"RO",
            leftCorner:"LH",
            rightCorner:"RH"
        };

        const playerPositions =
        (match.positionTimes || {})[player] || {};

        let positions = [];

        Object.entries(playerPositions)
        .forEach(([position,time]) => {

            if(time > 0){

                positions.push(
                    labels[position] +
                    " (" +
                    Math.floor(time/60) +
                    "m)"
                );

            }

        });

        playTimesHtml += `
        <tr>
            <td>${player}</td>
<td>
    ${minutes} min
    ${
        keeperMinutes > 0
        ? `<br><small> ${keeperMinutes} min keeper</small>`
        : ""
    }
</td>
            <td>${positions.join(", ")}</td>
        </tr>
        `;
    });

    let substitutionsHtml = "";

    if(match.substitutions &&
       match.substitutions.length){

        substitutionsHtml =
        match.substitutions
        .slice()
        .reverse()
        .map(sub => `
            <tr>
                <td>${sub.minute}</td>
                <td>${sub.position}</td>
                <td>${sub.incoming}</td>
                <td>${sub.outgoing}</td>
            </tr>
        `)
        .join("");

    } else {

        substitutionsHtml = `
        <tr>
            <td colspan="4">
                Geen wissels
            </td>
        </tr>
        `;
    }

    const allTimes =
    Object.values(match.playTimes || {});

    const maxPlay =
    allTimes.length
    ? Math.max(...allTimes)
    : 0;

    const minPlay =
    allTimes.length
    ? Math.min(...allTimes)
    : 0;

    const fairPlayDiff =
    Math.floor((maxPlay - minPlay) / 60);

    let fairPlayLabel =
    "🟢 Goed verdeeld";

    if(fairPlayDiff >= 10){

        fairPlayLabel =
        "🔴 Groot verschil";

    } else if(fairPlayDiff >= 5){

        fairPlayLabel =
        "🟠 Let op";
    }

    const report = `
<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">

<title>Wedstrijdrapport</title>

<style>

h1,h2{
    color:#002B5C;
}

table{
    width:100%;
    border-collapse:collapse;
    margin-bottom:20px;
}

th,td{
    border:1px solid #ccc;
    padding:8px;
    text-align:left;
}

th{
    background:#eef2f7;
}

.result{
    font-size:22px;
    font-weight:bold;
    margin-bottom:20px;
}

</style>

</head>

<!-- ===================================================== -->
<!-- HTML STRUCTUUR -->
<!-- ===================================================== -->

<body>

<h1>🏐 Wedstrijdrapport</h1>

<p>
<strong>Datum:</strong>
${match.date}
</p>

<p>
<strong>Wedstrijd:</strong>
${match.homeTeam}
-
${match.awayTeam}
</p>

<div class="result">
${match.homeTeam}
${match.homeScore}
-
${match.awayScore}
${match.awayTeam}
</div>

<h2>Speeltijden</h2>

<table>

<tr>
    <th>Speelster</th>
    <th>Speeltijd</th>
    <th>Posities</th>
</tr>

${playTimesHtml}

</table>

<h2>Wisselhistorie</h2>

<table>

<tr>
    <th>Moment</th>
    <th>Positie</th>
    <th>IN</th>
    <th>UIT</th>
</tr>

${substitutionsHtml}

</table>

<h2>Fair Play Analyse</h2>

<p>

<strong>Status:</strong>
${fairPlayLabel}

<br><br>

Max speeltijd:
${Math.floor(maxPlay/60)} min

<br>

Min speeltijd:
${Math.floor(minPlay/60)} min

<br>

Verschil:
${fairPlayDiff} min

</p>

</body>
</html>
`;

    const blob =
    new Blob(
        [report],
        {type:"text/html"}
    );

    const url =
    URL.createObjectURL(blob);

    const a =
    document.createElement("a");

    a.href = url;

const safeHome =
match.homeTeam.replace(/[^\w\-]/g, "_");

const safeAway =
match.awayTeam.replace(/[^\w\-]/g, "_");

a.download =
`Wedstrijdrapport_${safeHome}_${safeAway}.html`;

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);

}

function viewArchivedMatch(id){

    const match =
    matchArchive.find(
        m => m.id === id
    );

    if(!match){
        return;
    }

    let playTimesHtml = "";

    Object.keys(match.playTimes || {})

    .forEach(player => {

        const minutes =
        Math.floor(
            match.playTimes[player] / 60
        );

        let positions = [];

        const labels = {
            keeper:"KP",
            pivot:"CIR",
            leftBack:"LO",
            rightBack:"RO",
            leftCorner:"LH",
            rightCorner:"RH"
        };

const playerPositions =
(match.positionTimes || {})[player] || {};

        Object.entries(playerPositions)
        .forEach(([position,time]) => {

            if(time > 0){

                positions.push(
                    labels[position] +
                    " (" +
                    Math.floor(time/60) +
                    "m)"
                );

            }

        });

        playTimesHtml += `
        <tr>
            <td>${player}</td>
            <td>${minutes} min</td>
            <td>${positions.join(", ")}</td>
        </tr>
        `;
    });

    let substitutionsHtml = "";

    if(match.substitutions && match.substitutions.length){

        substitutionsHtml =
        match.substitutions
        .slice()
        .reverse()
        .map(sub => `
            <tr>
                <td>${sub.minute}</td>
                <td>${sub.position}</td>
                <td>${sub.incoming}</td>
                <td>${sub.outgoing}</td>
            </tr>
        `).join("");

    } else {

        substitutionsHtml =
        `
        <tr>
            <td colspan="4">
                Geen wissels
            </td>
        </tr>
        `;
    }

   document.getElementById(
    "archiveDetailContent"
).innerHTML = `

<style>

#archiveDetailContent table{
    width:100%;
    border-collapse:collapse;
    table-layout:fixed;
}

#archiveDetailContent th,
#archiveDetailContent td{
    border:1px solid #ddd;
    padding:8px;
    text-align:left;
    vertical-align:top;
}

#archiveDetailContent th{
    background:#eef2f7;
}

</style>

<h2>
${match.homeTeam}
-
${match.awayTeam}
</h2>

    <p>
    <strong>Datum:</strong>
    ${match.date}
    </p>

    <p>
    <strong>Eindstand:</strong>
    ${match.homeScore}
    -
    ${match.awayScore}
    </p>

    <h3>Speeltijden</h3>

<table style="margin-bottom:20px;">

<tr>
    <th style="width:150px;">Speelster</th>
    <th style="width:100px;">Tijd</th>
    <th>Posities</th>
</tr>

${playTimesHtml}

</table>

    <h3>Wisselhistorie</h3>

<table style="margin-bottom:20px;">

<tr>
    <th style="width:80px;">Moment</th>
    <th style="width:120px;">Positie</th>
    <th style="width:90px;">IN</th>
    <th style="width:90px;">UIT</th>
</tr>

${substitutionsHtml}

</table>

    `;

    document
    .getElementById(
        "archiveDetailModal"
    )
    .classList.remove("hidden");

}

function closeArchiveDetails(){

    document
    .getElementById(
        "archiveDetailModal"
    )
    .classList.add("hidden");

}

