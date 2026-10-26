function buttonFeedback(buttonId){

    const button =
    document.getElementById(buttonId);

    if(!button){
        return;
    }

    button.classList.remove(
        "button-feedback"
    );

    void button.offsetWidth;

    button.classList.add(
        "button-feedback"
    );

    setTimeout(() => {

        button.classList.remove(
            "button-feedback"
        );

    }, 150);

}

function scrollToTop(){

    setTimeout(() => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 50);

}

function toggleCard(id){

    document
    .getElementById(id)
    .classList.toggle("hidden");

}

function showInfoModal(){

    document.getElementById(
        "infoModal"
    ).style.display = "block";

}

function closeInfoModal(){

    document.getElementById(
        "infoModal"
    ).style.display = "none";

}

function showAlertBanner(message){

    const banner =
    document.getElementById("alertBanner");

    if(!banner){
        console.error("alertBanner niet gevonden");
        return;
    }

    banner.innerHTML = message;
    banner.style.display = "block";

    clearTimeout(alertTimeout);

    alertTimeout = setTimeout(() => {

        banner.style.display = "none";

    }, 5000);

}