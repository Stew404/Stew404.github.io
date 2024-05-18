function setCurrentLinkStyle(){
    const linkId = location.pathname.slice(1, -5)

    const linkElem = document.querySelector(`.navigation-list a#${linkId}`);
    
    linkElem.classList.add("navigation-link_current");
}

setCurrentLinkStyle();