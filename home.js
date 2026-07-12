const slides=document.querySelectorAll(".slide");
const dots=document.querySelectorAll(".dot");

let current=0;

function showSlide(n){

slides.forEach(slide=>slide.classList.remove("active"));

dots.forEach(dot=>dot.classList.remove("active"));

slides[n].classList.add("active");

dots[n].classList.add("active");

}

setInterval(()=>{

current++;

if(current>=slides.length){

current=0;

}

showSlide(current);

},5000);

dots.forEach((dot,index)=>{

dot.addEventListener("click",()=>{

current=index;

showSlide(current);

});

});