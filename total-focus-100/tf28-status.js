/* TOTAL FOCUS 100 — V28.1 | Rodapé global: leitura de agenda, sem alterar dados */
(function(){
  "use strict";
  if(window.TF28_STATUS) return;
  var TZ="America/Sao_Paulo",KEY="totalfocus100.private.dataset.v1",SK="totalfocus100.v1";
  var fmt=new Intl.DateTimeFormat("pt-BR",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"});
  var pad=function(n){return String(n).padStart(2,"0");};
  function localParts(now) {
    var p={};fmt.formatToParts(now).forEach(function(x){if(x.type!=="literal")p[x.type]=x.value;});
    return {date:p.year+"-"+p.month+"-"+p.day,clock:p.hour+":"+p.minute+":"+p.second,minute:Number(p.hour)*60+Number(p.minute),second:Number(p.second)};
  }
  function read(key){try{return JSON.parse(localStorage.getItem(key)||"null");}catch(e){return null;}}
  function min(h){return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(h||""))?Number(h.slice(0,2))*60+Number(h.slice(3,5)):null;}
  function delta(from,to){var a=Date.parse(from+"T00:00:00Z"),b=Date.parse(to+"T00:00:00Z");return Number.isFinite(a)&&Number.isFinite(b)?Math.round((b-a)/86400000):null;}
  function duration(sec){sec=Math.max(0,Math.floor(sec));var hours=Math.floor(sec/3600),minutes=Math.floor(sec%3600/60);return (hours?pad(hours)+":":"")+pad(minutes)+":"+pad(sec%60);}
  function calculate(now,d,s) {
    var br=localParts(now),tasks=d&&Array.isArray(d.tasks)?d.tasks:null;
    if(!tasks)return {clock:br.clock,title:"Agenda indisponível",detail:"Abra ou sincronize sua rotina",mode:"unavailable"};
    var a=[],next=[],over=s&&s.overrides||{},statuses=s&&s.statuses||{};
    tasks.forEach(function(t){
      if(!t||!t.date||!t.time)return;
      var x=Object.assign({},t,over[t.id]||{}),start=min(x.time),end=min(x.end),offset=delta(x.date,br.date);
      if(start===null||offset===null)return;
      var title=String(x.title||x.description||"Atividade programada");
      if(end!==null&&end!==start){
        var crosses=end<start,active=offset===0&&(br.minute>=start&&(crosses||br.minute<end))||(offset===1&&crosses&&br.minute<end);
        if(active){
          var left=(offset===1?end-br.minute:crosses?1440-br.minute+end:end-br.minute)*60-br.second;
          a.push({title:title,left:left,order:offset===1?start-1440:start,done:statuses[x.id]==="feito"});
          return;
        }
      }
      var until=offset<=0?(-offset*1440+start-br.minute)*60-br.second:-1;
      if(until>=0)next.push({title:title,until:until,time:x.time});
    });
    a.sort(function(x,y){return y.order-x.order;});next.sort(function(x,y){return x.until-y.until;});
    if(a.length)return {clock:br.clock,title:a[0].title,detail:(a[0].done?"Concluída · ":"")+"Restam "+duration(a[0].left)+(a.length>1?" · +"+(a.length-1)+" sobreposta(s)":""),mode:"active"};
    if(next.length)return {clock:br.clock,title:"Horário livre",detail:"Próxima: "+next[0].title+" · "+next[0].time,mode:"next"};
    return {clock:br.clock,title:"Horário livre",detail:"Nenhuma próxima tarefa programada",mode:"idle"};
  }
  var css="#tf28-live-footer{position:fixed;z-index:19;left:50%;transform:translateX(-50%);bottom:calc(68px + env(safe-area-inset-bottom,0px));width:min(99vw,650px);display:flex;align-items:center;justify-content:center;gap:6px;flex-wrap:wrap;padding:5px 9px;border:1px solid rgba(42,227,226,.40);border-radius:9px;background:rgba(4,17,29,.95);box-shadow:0 4px 18px #0007;backdrop-filter:blur(9px);font:500 10px/1.3 system-ui,sans-serif;color:#d5f1f5;pointer-events:none;text-align:center}#tf28-live-footer b{color:#3bece3;font-weight:700}#tf28-live-footer .tf28-task{max-width:39%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#tf28-live-footer .tf28-timer{color:#b8edca}body.tf28-footer-active #shell{padding-bottom:155px!important}.tf28-dialog-status{font:500 10px/1.3 system-ui,sans-serif;color:#c6e5ed;border-top:1px solid #1f6271;padding-top:8px;margin-top:8px;text-align:center}@media(max-width:400px){#tf28-live-footer{font-size:9px;bottom:calc(65px + env(safe-area-inset-bottom,0px));gap:4px}#tf28-live-footer .tf28-task{max-width:34%}}";
  var style=document.createElement("style");style.id="tf28-footer-styles";style.textContent=css;(document.head||document.documentElement).appendChild(style);
  var root=null,drawn="",dlgItem=null;
  function make(){
    var r=document.createElement("div");r.id="tf28-live-footer";r.setAttribute("role","status");r.setAttribute("aria-label","Brasília: horário e tarefa atual");r.setAttribute("aria-live","off");
    var b=document.createElement("b"),t=document.createElement("span"),a=document.createElement("span"),s=document.createElement("span");
    t.className="tf28-task";s.className="tf28-timer";r.append(b,a,t,s);document.body.appendChild(r);
    document.body.classList.add("tf28-footer-active");return r;
  }
  function update(){
    if(!document.body)return;
    var x=calculate(new Date(),read(KEY),read(SK));
    if(!root||!root.isConnected)root=make();
    var str=x.clock+"|"+x.title+"|"+x.detail;
    if(str!==drawn){root.children[0].textContent="Brasília "+x.clock;root.children[1].textContent="·";root.children[2].textContent=x.title;root.children[3].textContent="· "+x.detail;drawn=str;}
    var dialog=document.querySelector("dialog[open]");
    if(dialog){
      if(!dlgItem||dlgItem.parentNode!==dialog){if(dlgItem)dlgItem.remove();dlgItem=document.createElement("div");dlgItem.className="tf28-dialog-status";dialog.appendChild(dlgItem);}
      dlgItem.textContent="Brasília "+x.clock+" · "+x.title+" · "+x.detail;
    }else if(dlgItem){dlgItem.remove();dlgItem=null;}
  }
  function start(){update();setInterval(update,1000);document.addEventListener("visibilitychange",update);window.addEventListener("pageshow",update);window.addEventListener("storage",update);}
  window.TF28_STATUS=Object.freeze({version:"28.1",calculate:calculate,refresh:update,localParts:localParts});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});else start();
})();