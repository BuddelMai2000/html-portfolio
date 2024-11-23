function zufall(){
   return Math.floor(Math.random()*3)
};
var bilder=["../assets/images/wuerfel1png","../assets/images/wuerfel2.png","../assets/images/wuerfel3.png"];
var wuerfel1=zufall();
var wuerfel2=zufall();
var wuerfel3=zufall();
var wuerfel4=zufall();
document.querySelector(".w1").setAttribute("src",bilder[wuerfel1]);
document.querySelector(".w2").setAttribute("src",bilder[wuerfel2]);
document.querySelector(".w3").setAttribute("src",bilder[wuerfel3]);
document.querySelector(".w4").setAttribute("src",bilder[wuerfel4]);
document.querySelector("button").addEventListener("click",function(){
    location.reload();
})
