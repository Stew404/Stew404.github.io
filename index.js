function setCurrentLinkStyle(){
    const linkId = location.pathname.slice(1, -5)

    console.log(linkId)

    const linkElem = document.querySelector(`.navigation-list a#${linkId}`);
    
    linkElem.classList.add("navigation-link_current");

}

function rewriteLinksDefault(){
    const navLinks = document.querySelectorAll(".navigation-list a")

    navLinks.forEach(element => {
        element.addEventListener("click", (e)=>{
            e.preventDefault();
            renderPage(element.href)
        })
    });
}

function initMap(){
    ymaps.ready(init);
    
    function init(){

        document.querySelector(".map").innerHTML = ""
        let map = new ymaps.Map(document.querySelector(".map"), {
            center: [59.932031, 30.355628],
            // Уровень масштабирования. Допустимые значения:
            // от 0 (весь мир) до 19.
            zoom: 15
        });
    }
}

window.addEventListener("DOMContentLoaded", ()=>{
    rewriteLinksDefault()

    const pageId = location.pathname.slice(1, -5)
    if(pageId === "map"){
        initMap()
    }
})


async function renderPage(url){
    const res = await fetch(url);

    if(res.ok){

        const dom = new DOMParser()

        const data = await res.text()
        const html = dom.parseFromString(data, "text/html");

        history.pushState({}, "", url)
        
        document.querySelector("body").outerHTML = html.querySelector("body").outerHTML

        rewriteLinksDefault()
        setCurrentLinkStyle();

        document.dispatchEvent(new CustomEvent("pagerendered", {
            detail: {
                url: url
            }
        }))
    }
}

document.addEventListener("pagerendered", async (e)=>{
    const pageId = new URL(e.detail.url).pathname.slice(1, -5)

    if(pageId === "timer"){
        const renderCurrentTime = createCurrentTime();
        renderCurrentTime()
    }

    if(pageId === "map"){
        initMap()
    }
})

function handleTimerUpdate() {

    let renderCurrentTime;

    document.addEventListener("timerupdated", ()=>{
        const pageId = location.pathname.slice(1, -5)
    
        if(pageId === "timer"){
            renderCurrentTime = renderCurrentTime ? renderCurrentTime : createCurrentTime();
            renderCurrentTime()
        } else {
            renderCurrentTime = null;
        }
    })
}

handleTimerUpdate();



function createCurrentTime(){
    const hoursElem = document.querySelector(".timer .hours")
    const minutesElem = document.querySelector(".timer .minutes")
    const secondsElem = document.querySelector(".timer .seconds")

    return ()=>{
        const time = sessionStorage.getItem("time")
        const seconds = time % 60
        const minutes = Math.floor(time / 60) % 60;
        const hours = Math.floor(time / 3600);
        secondsElem.innerHTML = seconds < 10 ? `0${seconds}` : seconds;
        minutesElem.innerHTML = minutes < 10 ? `0${minutes}` : minutes;
        hoursElem.innerHTML = hours < 10 ? `0${hours}` : hours;
    }
}


const renderCurrentTime = createCurrentTime();
function startTimer() {
    let time = 0
    setInterval(()=>{
        sessionStorage.setItem("time", ++time)

        document.dispatchEvent(new CustomEvent("timerupdated"))
    }, 1000)
}

startTimer();

