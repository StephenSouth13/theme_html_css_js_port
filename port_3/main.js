const load = (id,file)=>{
  fetch(file)
    .then(r=>r.text())
    .then(d=>document.getElementById(id).innerHTML=d);
};

load("header","components/header.html");
load("hero","components/hero.html");
load("about","components/about.html");
load("stats","components/stats.html");
load("projects","components/projects.html");
load("skills","components/skills.html");
load("testimonials","components/testimonials.html");
load("cta","components/cta.html");
load("footer","components/footer.html");

// back to top
const btn = document.getElementById("backTop");

window.addEventListener("scroll",()=>{
  btn.style.opacity = window.scrollY > 300 ? "1":"0";
});

btn.onclick=()=>window.scrollTo({top:0,behavior:"smooth"});