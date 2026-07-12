/*=========================================
MM TRACKERS HERO SLIDER
=========================================*/

const slides = document.querySelector(".slides");
const slideItems = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

let current = 0;
const total = slideItems.length;

function showSlide(index){

    if(index >= total){
        current = 0;
    }else if(index < 0){
        current = total - 1;
    }else{
        current = index;
    }

    slides.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach(dot => dot.classList.remove("active"));
    dots[current].classList.add("active");
}

/* Next */

if(next){
    next.addEventListener("click", () => {
        showSlide(current + 1);
    });
}

/* Previous */

if(prev){
    prev.addEventListener("click", () => {
        showSlide(current - 1);
    });
}

/* Dots */

dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

    });

});

/* Auto Slide */

setInterval(() => {

    showSlide(current + 1);

}, 5000);

/* Swipe Support */

let startX = 0;

slides.addEventListener("touchstart", e => {

    startX = e.touches[0].clientX;

});

slides.addEventListener("touchend", e => {

    let endX = e.changedTouches[0].clientX;

    if(startX - endX > 50){

        showSlide(current + 1);

    }

    if(endX - startX > 50){

        showSlide(current - 1);

    }

});

/* First Slide */

showSlide(0);