
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
        name: "Sütő előkészítés",
        duration: 5
    },

    {
        name: "Fazékba helyezés",
        duration: 1
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
        currentStep: 7,
        remainingSeconds: 8 * 60
    },

    {
        id: 2,
        name: "Kenyér #2",
        currentStep: 1,
        remainingSeconds: 2 * 60
    },

    {
        id: 3,
        name: "Kenyér #3",
        currentStep: 0,
        remainingSeconds: 0
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
// TELJES HÁTRALÉVŐ IDŐ
// ======================

function getTotalRemainingMinutes(bread){

    let total = Math.ceil(
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
// KÖVETKEZŐ TEENDŐ PANEL
// ======================

function updateNextTask(){

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
        return;
    }

    const countdown =
        document.getElementById("mainCountdown");

    if(countdown){

        countdown.textContent =
            formatTime(nextBread.remainingSeconds);

    }

    const taskBread =
        document.querySelector(".next-bread");

    const taskProcess =
        document.querySelector(".next-process");

    if(taskBread){

        taskBread.textContent =
            "🍞 " + nextBread.name;

    }

    if(taskProcess){

        taskProcess.textContent =
            workflow[nextBread.currentStep].name;

    }

}

// ======================
// VISSZASZÁMLÁLÓ
// ======================

setInterval(() => {

    breads.forEach(bread => {

        if(
            bread.remainingSeconds > 0
        ){

            bread.remainingSeconds--;

        }

    });

    updateNextTask();

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
                return;
            }

            nextBread.currentStep++;

            if(
                nextBread.currentStep
                >= workflow.length
            ){
                nextBread.currentStep =
                    workflow.length - 1;

                nextBread.remainingSeconds = 0;

                updateNextTask();

                return;
            }

            nextBread.remainingSeconds =
                workflow[
                    nextBread.currentStep
                ].duration * 60;

            updateNextTask();

            alert(
                nextBread.name +
                " -> " +
                workflow[
                    nextBread.currentStep
                ].name
            );

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

updateNextTask();
