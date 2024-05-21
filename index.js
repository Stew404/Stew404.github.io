function setCurrentLinkStyle(){
    const linkId = location.pathname.slice(1, -5)

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

window.addEventListener("DOMContentLoaded", rewriteLinksDefault)


async function renderPage(url){
    const res = await fetch(url);

    if(res.ok){

        const dom = new DOMParser()

        const data = await res.text()
        const html = dom.parseFromString(data, "text/html");

        history.pushState({}, "", url)
        
        document.querySelector("head").innerHTML = html.head.innerHTML
        document.querySelector("body").outerHTML = html.querySelector("body").outerHTML

        rewriteLinksDefault()
        setCurrentLinkStyle();
    }
}


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

        if(document.querySelector(".timer")){
            renderCurrentTime()
        }

        console.log(sessionStorage.getItem("time"))
    }, 1000)
}

startTimer();

