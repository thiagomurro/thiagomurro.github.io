const menu=document.querySelector('.menu'), nav=document.querySelector('.navlinks');

function setMenuOpen(isOpen){
  if(!menu||!nav)return;
  nav.classList.toggle('open',isOpen);
  menu.setAttribute('aria-expanded',String(isOpen));
  menu.setAttribute('aria-label',isOpen?'Fechar menu':'Abrir menu');
}

if(menu&&nav){
  menu.addEventListener('click',()=>setMenuOpen(!nav.classList.contains('open')));
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenuOpen(false)));
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')setMenuOpen(false);
  });
  document.addEventListener('click',event=>{
    if(nav.classList.contains('open')&&!nav.contains(event.target)&&!menu.contains(event.target)){
      setMenuOpen(false);
    }
  });
}

function trackAction(name,params={}){
  if(typeof gtag==='function')gtag('event',name,params);
}
document.querySelectorAll('[data-track]').forEach(el=>el.addEventListener('click',()=>trackAction(el.dataset.track,{link_url:el.href||'',link_text:(el.textContent||'').trim().slice(0,80)})));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
