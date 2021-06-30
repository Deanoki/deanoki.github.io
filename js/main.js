/* Navigator section */
(() =>{
    const hamburgerBtn = document.querySelector(".hamburger-btn"),
    navMenu = document.querySelector(".nav-menu"),
    closeNavBtn = navMenu.querySelector(".close-nav-menu");

    hamburgerBtn.addEventListener("click", showNavMenu);
    closeNavBtn.addEventListener("click", hideNavMenu);

    function showNavMenu(){
        navMenu.classList.add("open");
        bodyScrollingToggle();
    }
    
    function hideNavMenu(){
        navMenu.classList.remove("open");
        fadeOutEffect();
        bodyScrollingToggle();
    }

    function fadeOutEffect(){
       document.querySelector(".fade-out-effect").classList.add("active");
       setTimeout(() =>{
        document.querySelector(".fade-out-effect").classList.remove("active");
       },300)
    }
    
    document.addEventListener("click", (event) =>{
        if(event.target.classList.contains('link-item')){
            /* make sure event.target.hash has a value before overriding default behavior  */
            if(event.target.hash !==""){
                //prevent default anchor click behavior
                event.preventDefault();
                const hash = event.target.hash;
                
                //deactivate exisiting active 'section'
                document.querySelector(".section.active").classList.add("hide");
                document.querySelector(".section.active").classList.remove("active");
               
                //activate new 'section'
                document.querySelector(hash).classList.add("active");
                document.querySelector(hash).classList.remove("hide");

                /* Deactivate exisiting active navigation menu 'link-item' */
                navMenu.querySelector(".active").classList.add("outer-shadow", "hover-in-shadow");
                navMenu.querySelector(".active").classList.remove("active", "inner-shadow");

                /* if clicked 'link-item-is-contained-withing-the-navigation-menu'  */
                if(navMenu.classList.contains("open")){
                    //activate new navigation menu 'link-item'
                    event.target.classList.add("active","inner-shadow");
                    event.target.classList.remove("outer-shadow","hover-in-shadow");
                    //hide navigation menu
                    hideNavMenu();
                    console.log("clicked 'link-item-is-contained-withing-the-navigation-menu'");
                }              
                else{
                    let navItems = navMenu.querySelectorAll(".link-item");
                    navItems.forEach((item) =>{
                        if(hash === item.hash){
                            //activate new navigation menu 'link-item'
                            item.classList.add("active", "inner-shadow");
                            item.classList.remove("outer-shadow", "hover-in-shadow");
                        }
                    })
                    fadeOutEffect();
                }
                // add hash (#) to url 
                window.location.hash = hash;
            }
        }
        
    })

})();

/*------------ about section tabs ------------*/
(() => {
    const aboutSection = document.querySelector(".about-section"),
        tabsContainer = document.querySelector(".about-tabs");

    tabsContainer.addEventListener("click", (event) => {
        //jika event.target berisikan kelas 'tab-item' dan bukan berisikan kelas active
        if (event.target.classList.contains("tab-item") && !
            event.target.classList.contains("active")) {
            const target = event.target.getAttribute("data-target");
            //deactivate existing active tab-item
            tabsContainer.querySelector(".active").classList.remove("outer-shadow", "active");
            //activate new tab-item
            event.target.classList.add("active", "outer-shadow");
            //deactivate existing active tab-content
            aboutSection.querySelector(".tab-content.active").classList.remove("active");
            //activate new 'tab-content'
            aboutSection.querySelector(target).classList.add("active");
        }
    })
})();

function bodyScrollingToggle() {
    document.body.classList.toggle("hidden-scrolling");
}

/* ------------- portofolio filter dan popup -------------- */
(() => {
    const filterContainer = document.querySelector(".portofolio-filter"),
    portofolioItemsContainer = document.querySelector(".portofolio-items"),
    portofolioItems = document.querySelectorAll(".portofolio-item"),
    popup = document.querySelector(".portofolio-popup"),
    prevBtn = popup.querySelector(".pp-prev"),
    nextBtn = popup.querySelector(".pp-next"),
    closeBtn = popup.querySelector(".pp-close"),
    projectDetailsContainer = popup.querySelector(".pp-details"),
    projectDetailsBtn = popup.querySelector(".pp-project-details-btn");
    let itemIndex, slideIndex, screenshots;

    /*--------- filter  portofolio items---------------*/

    filterContainer.addEventListener("click", (event)=>{
        if(event.target.classList.contains("filter-item") && !
        event.target.classList.contains("active")){
           //deactivate exisiting active filter item
           filterContainer.querySelector(".active").classList.remove("outer-shadow", "active");
           // zctivate new filter item
           event.target.classList.add("active", "outer-shadow");
           const target =  event.target.getAttribute("data-target");
           portofolioItems.forEach((item) =>{
               if(target === item.getAttribute("data-category") || target === "All"){
                   item.classList.remove("hide");
                   item.classList.add("show");                   
               } else{
                item.classList.remove("show");
                item.classList.add("hide");   
               }
           })
        }
    })

    portofolioItemsContainer.addEventListener("click", (event) =>{
        if(event.target.closest(".portofolio-item-inner")){
            const portofolioItem = event.target.closest(".portofolio-item-inner").parentElement;
            //get the portofolio item index
            itemIndex = Array.from(portofolioItem.parentElement.children).indexOf(portofolioItem);
            screenshots = portofolioItems[itemIndex].querySelector(".portofolio-item-img img").getAttribute("data-screenshots");
            //convert screenshots into array
            screenshots = screenshots.split(",");
            if(screenshots.length === 1){
                prevBtn.style.display = "none";
                nextBtn.style.display = "none";

            }
            slideIndex = 0;
            popupToggle();
            popupSlideshow();
            popupDetails();
        }
    })

    closeBtn.addEventListener("click", () =>{
        popupToggle();
        if(projectDetailsContainer.classList.contains("active")){
            popupDetailsToggle();
        }
    })

    function popupToggle(){
        popup.classList.toggle("open");
        bodyScrollingToggle();
    }

    function popupSlideshow() {
        const imgSrc = screenshots[slideIndex];
        console.log(imgSrc)
        const popupImg = popup.querySelector(".pp-img");
        //activate loader until the popupImg loaded
        popup.querySelector(".pp-loader").classList.add("active");
        popupImg.src = imgSrc;
        popupImg.onload = () =>{
            //deactivate loader after the popupImg loaded
            popup.querySelector(".pp-loader").classList.remove("active");
        }
        popup.querySelector(".pp-counter").innerHTML = (slideIndex+1) + " of " + screenshots.length;
    }

    //next slide
    nextBtn.addEventListener("click", () =>{
        if(slideIndex === screenshots.length-1){
            slideIndex = 0;
        }
        else{
            slideIndex++;
        }
        popupSlideshow();
        console.log("slideIndex:" + slideIndex );
    })

    //prev slide
    prevBtn.addEventListener("click", () =>{
        if(slideIndex === 0){
            slideIndex = screenshots.length-1
        }
        else{
            slideIndex--;
        }
        popupSlideshow();
        //console.log("slideIndex:" + slideIndex );
    })

    function popupDetails(){
        // get the project details
        const details = portofolioItems[itemIndex].querySelector(".portofolio-item-details").innerHTML;
        // set the project details
        popup.querySelector(".pp-project-details").innerHTML = details;
        // get  the project title
        const title = portofolioItems[itemIndex].querySelector(".portofolio-item-title").innerHTML;
        // set the project title
        popup.querySelector(".pp-title h2").innerHTML = title;
        // get the project category
        const category = portofolioItems[itemIndex].getAttribute("data-category");
        //console.log(category);
        //set the project category
        popup.querySelector(".pp-project-category").innerHTML = category.split("-").join(" ");
    }

    projectDetailsBtn.addEventListener("click",  () =>{
        popupDetailsToggle();
    })

    function popupDetailsToggle(){
        if(projectDetailsContainer.classList.contains("active")){
            projectDetailsBtn.querySelector("i").classList.remove("fa-minus");
            projectDetailsBtn.querySelector("i").classList.add("fa-plus");
            projectDetailsContainer.classList.remove("active");
            projectDetailsContainer.style.maxHeight = 0 + "px"
        }
        else{
            projectDetailsBtn.querySelector("i").classList.remove("fa-plus");
            projectDetailsBtn.querySelector("i").classList.add("fa-minus");
            projectDetailsContainer.classList.add("active");
            projectDetailsContainer.style.maxHeight = projectDetailsContainer.scrollHeight + "px";
            popup.scrollTo(0,projectDetailsContainer.offsetTop);
        }
    }

})();

/* hide all section except active */
(() =>{
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) =>{
        if(!section.classList.contains("active")){
            section.classList.add("hide");
        }
    })
})();

window.addEventListener("load", () =>{
    //prwloader
    document.querySelector(".preloader").classList.add("fade-out");
    setTimeout(() =>{
        document.querySelector(".preloader").style.display="none";
    },600)
})

