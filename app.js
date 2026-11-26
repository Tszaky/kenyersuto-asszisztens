
// ======================
// KÉPEK
// ======================

const slideshowImages = [
    "Hajtogatas_1.png",
    "Hajtogatas_4.png",
    "Hajtogatas_7.png"
];

// ======================
// MUNKAFOLYAMAT
// percekben
// ======================

const workflow = [

    {
        name: "Pihentetés 1",
        duration: 30
    },

    {
        name: "Hajtogatás 1 + Pihentetés 2",
        duration: 32
    },

    {
        name: "Hajtogatás 2 + Pihentetés 3",
        duration: 32
    },

    {
        name: "Hajtogatás 3 + Formázás + Szakajtós kelesztés",
        duration: 34
    },

    {
        name: "Sütés fedett fazékban",
        duration: 45
    },

    {
        name: "Kivétel fazékból + Sütés rácson",
        duration: 10
    },

    {
        name: "Kész",
        duration: 0
    }

];

// ======================
// KENYEREK
// ======================

const breads = [
    {
        id: 1,
        name: "Kenyér #1",
        currentStep: 5,
        remainingSeconds: 480,
        started: true,
        completed: false
    },

    {
        id: 2,
        name: "Kenyér #2",
        currentStep: 1,
        remainingSeconds: 120,
        started: true,
        completed: false
    },

    {
        id: 3,
        name: "Kenyér #3",
        currentStep: 0,
        remainingSeconds: 0,
        started: false,
        completed: false
    }

];

// ======================
// SEGÉDFÜGGVÉNY
// ======================

function formatTime(seconds){

    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return String(mins).padStart(2, "0")
        + ":"
        + String(secs).padStart(2, "0");

}
// ======================
// ÁLLAPOT MENTÉSE
// ======================

function saveState(){

    localStorage.setItem(
        "breadState",
        JSON.stringify(breads)
    );

}


// ======================
// ÁLLAPOT BETÖLTÉSE
// ======================

function loadState(){

    const saved =
        localStorage.getItem(
            "breadState"
        );

    if(!saved){
        return;
    }

    const loadedBreads =
        JSON.parse(saved);

    breads.forEach((bread, index) => {

        bread.currentStep =
            loadedBreads[index].currentStep;

        bread.remainingSeconds =
            loadedBreads[index].remainingSeconds;

        bread.started =
            loadedBreads[index].started;

        bread.completed =
            loadedBreads[index].completed;

    });
console.log("BETÖLTVE", breads);
}
// ======================
// ELŐREHALADÁS
// ======================

function getProgress(bread){

    const totalSteps =
        workflow.length - 1;

    return Math.round(
        (bread.currentStep / totalSteps)
        * 100
    );

}
// ======================
// TELJES HÁTRALÉVŐ IDŐ
// ======================

function getTotalRemainingMinutes(bread){

    let total =
        Math.ceil(
            bread.remainingSeconds / 60
        );

    for(
        let i = bread.currentStep + 1;
        i < workflow.length;
        i++
    ){
        total += workflow[i].duration;
    }

    return total;

}
// ======================
// MUNKAFOLYAMAT VEZÉRLÉS
// ======================

function getNextBread(){

    const active =
        breads.filter(
            bread =>
                bread.started &&
                !bread.completed
        );

    active.sort(
        (a,b) =>
            a.remainingSeconds -
            b.remainingSeconds
    );

    return active[0];

}


function advanceBread(bread){

    bread.currentStep++;

    if(
        bread.currentStep >= workflow.length
    ){

        bread.currentStep =
            workflow.length - 1;

        bread.completed = true;

        bread.remainingSeconds = 0;

        return;
    }

    bread.remainingSeconds =
        workflow[
            bread.currentStep
        ].duration * 60;

}
function resetBread(bread){

    bread.currentStep = 0;

    bread.remainingSeconds = 0;

    bread.started = false;

    bread.completed = false;

}
function resetAllBreads(){

    breads.forEach(bread => {

        resetBread(bread);

    });

    saveState();

}
// ======================
// KÖVETKEZŐ TEENDŐ PANEL
// ======================

function updateNextTask(){

    const countdown =
        document.getElementById(
            "mainCountdown"
        );

    const taskBread =
        document.querySelector(
            ".next-bread"
        );

    const taskProcess =
        document.querySelector(
            ".next-process"
        );

    let nextBread = null;

    breads.forEach(bread => {

        if(
            bread.remainingSeconds > 0 &&
            (
                nextBread === null ||
                bread.remainingSeconds <
                nextBread.remainingSeconds
            )
        ){
            nextBread = bread;
        }

    });

    if(!nextBread){

        if(countdown){
            countdown.textContent =
                "--:--";
        }

        if(taskBread){
            taskBread.textContent =
                "🍞 Nincs aktív kenyér";
        }

        if(taskProcess){
            taskProcess.textContent =
                "Várakozás";
        }

        return;

    }

    if(countdown){

        countdown.textContent =
            formatTime(
                nextBread.remainingSeconds
            );

    }

    if(taskBread){

        taskBread.textContent =
            "🍞 " +
            nextBread.name;

    }

    if(taskProcess){

        taskProcess.textContent =
            workflow[
                nextBread.currentStep
            ].name;

    }

}
// ======================
// SÜTŐ PANEL
// ======================

function updateOvenPanel(){

    const ovenStatus =
        document.getElementById(
            "ovenStatus"
        );

    const ovenNextTime =
        document.getElementById(
            "ovenNextTime"
        );

const activeBread =
    breads.find(
        bread =>

            bread.started &&
            !bread.completed &&

            (
                bread.currentStep === 4 ||
                bread.currentStep === 5
            )

    );

    if(!activeBread){

        if(ovenStatus){
            ovenStatus.textContent =
                "Szabad";
        }

        if(ovenNextTime){
            ovenNextTime.textContent =
                "-";
        }

        return;

    }

    if(ovenStatus){
        ovenStatus.textContent =
            "Foglalt";
    }

}
// ======================
// KÁRTYÁK FRISSÍTÉSE
// ======================

function refreshCards(){

    breads.forEach((bread) => {

        const card =
            document.getElementById(
                `bread${bread.id}`
            );

        if(!card){
            return;
        }

        const processTitle =
            card.querySelector(
                ".process-title"
            );

        const remainingTime =
            card.querySelector(
                ".remaining-time"
            );

        const finishTime =
            card.querySelector(
                ".finish-time"
            );

        const progressBar =
            card.querySelector(
                ".progress-bar"
            );

        const workflowContainer =
            card.querySelector(
                ".workflow"
            );
        const startButton =
            card.querySelector(
                ".start-btn"
            );

        // Folyamat neve

        if(processTitle){

            if(!bread.started){

                processTitle.textContent =
                    "Még nem indult";

            }
            else{

                processTitle.textContent =
                    workflow[
                        bread.currentStep
                    ].name;

            }

        }


        // Hátralévő idő

        if(remainingTime){

            if(!bread.started){

                remainingTime.textContent = "";

            }
            else{

                remainingTime.textContent =
                    "⏳ " +
                    formatTime(
                        bread.remainingSeconds
                    );

            }

        }


        // Teljes hátralévő idő

        if(finishTime){

            if(!bread.started){

                finishTime.textContent =
                    "🏁 --:--";

            }
            else{

                finishTime.textContent =
                    "🏁 " +
                    getTotalRemainingMinutes(
                        bread
                    ) +
                    " perc";

            }

        }


        // Progress bar

        if(progressBar){

            progressBar.style.width =
                getProgress(bread) + "%";

        }


        // Workflow lista

        if(workflowContainer){

            workflowContainer.innerHTML = "";

            if(!bread.started){

                workflowContainer.innerHTML =
                    "<div>⚪ Még nem indult</div>";

            }
            else{

                workflow.forEach(
                    (step, stepIndex) => {

                        const item =
                            document.createElement(
                                "div"
                            );

                        if(
                            stepIndex <
                            bread.currentStep
                        ){

                            item.textContent =
                                "✅ " +
                                step.name;

                            item.className =
                                "done";

                        }
                        else if(
                            stepIndex ===
                            bread.currentStep
                        ){

                            item.textContent =
                                "⏳ " +
                                step.name;

                            item.className =
                                "current";

                        }
                        else{

                            item.textContent =
                                "⚪ " +
                                step.name;

                        }

                        workflowContainer
                            .appendChild(
                                item
                            );

                    }
                );

            }

        }

    });

}

// ======================
// VISSZASZÁMLÁLÓ
// ======================

setInterval(() => {

    breads.forEach(bread => {

        if(
            bread.started &&
            !bread.completed &&
            bread.remainingSeconds > 0
        ){

            bread.remainingSeconds--;

        }

    });

    saveState();

    updateNextTask();

    updateOvenPanel();

    refreshCards();

}, 1000);

// ======================
// KÉSZ GOMB
// ======================

const completeBtn =
    document.getElementById(
        "completeTaskBtn"
    );

if(completeBtn){

    completeBtn.addEventListener(
        "click",
        () => {

            const nextBread =
                getNextBread();

            if(!nextBread){
                return;
            }

            advanceBread(nextBread);

            updateNextTask();

            updateOvenPanel();

            refreshCards();

        }
    );

}
const resetAllBtn =
    document.getElementById(
        "resetAllBtn"
    );

if(resetAllBtn){

    resetAllBtn.addEventListener(
        "click",
        () => {

            if(
                confirm(
                    "Biztosan törlöd az összes kenyér állapotát?"
                )
            ){

                resetAllBreads();

                updateNextTask();

                updateOvenPanel();
                
                refreshCards();

            }

        }
    );

}
// ======================
// DIAVETÍTÉS
// ======================

let imageIndex = 0;

function rotateSlides(){

    imageIndex++;

    if(
        imageIndex >=
        slideshowImages.length
    ){
        imageIndex = 0;
    }

    const img1 =
        document.getElementById(
            "bread1Image"
        );

    const img2 =
        document.getElementById(
            "bread2Image"
        );

    if(img1){

        img1.src =
            slideshowImages[imageIndex];

    }

    if(img2){

        img2.src =
            slideshowImages[imageIndex];

    }

}

setInterval(
    rotateSlides,
    4000
);

// ======================
// INDULÁS
// ======================
loadState();

updateNextTask();

updateOvenPanel(); 
refreshCards();
// ======================
// START GOMBOK
// ======================

document
    .querySelectorAll(".start-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const bread =
                    breads.find(
                        b => !b.started
                    );

                if(!bread){
                    return;
                }

                bread.started = true;

                bread.currentStep = 0;

                bread.remainingSeconds =
                    workflow[0].duration * 60;

saveState();

updateNextTask();
updateOvenPanel();                
refreshCards();

            }
        );

    });

