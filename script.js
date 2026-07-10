document.querySelectorAll('.service-tabs .tab').forEach(btn=>{
btn.addEventListener('click',()=>{
    btn.parentElement.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.service-panel').forEach(panel=>{
    panel.classList.toggle('active', panel.dataset.service === btn.textContent.toLowerCase().split(' ')[0]);
    });
});
});
document.querySelectorAll('.filter-row .tab').forEach(btn=>{
btn.addEventListener('click',()=>{
    btn.parentElement.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
});
});

(function(){
const track = document.getElementById('clientTrack');
const dots = document.querySelectorAll('#clientDots span');
const prevBtn = document.getElementById('clientPrev');
const nextBtn = document.getElementById('clientNext');
const totalPages = dots.length;
let page = 0;

function render(){
    track.style.transform = 'translateX(-' + (page * (100/totalPages)) + '%)';
    dots.forEach((d,i)=> d.classList.toggle('active', i===page));
}
prevBtn.addEventListener('click', ()=>{ page = (page - 1 + totalPages) % totalPages; render(); });
nextBtn.addEventListener('click', ()=>{ page = (page + 1) % totalPages; render(); });
dots.forEach((d,i)=> d.addEventListener('click', ()=>{ page = i; render(); }));
render();
})();

(function(){
const hero = document.querySelector('.hero');
if(!hero) return;

let ticking = false;

function updateHeroParallax(){
    const rect = hero.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
    const progress = Math.max(-1, Math.min(1, rect.top / viewportHeight));
    const shift = (-progress * 2).toFixed(2) + 'px';
    hero.style.setProperty('--hero-parallax', shift);
    ticking = false;
}

function requestUpdate(){
    if(!ticking){
    window.requestAnimationFrame(updateHeroParallax);
    ticking = true;
    }
}

window.addEventListener('scroll', requestUpdate, { passive: true });
window.addEventListener('resize', requestUpdate);
updateHeroParallax();
})();

