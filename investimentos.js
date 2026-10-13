"use strict";
(() => {
  const ENDPOINT="https://data-api.binance.vision/api/v3";
  const SYMBOLS=[["BTCUSDT","Bitcoin","Alto"],["SOLUSDT","Solana","Extremo — veto"],["ETHUSDT","Ethereum","Muito alto"],["XRPUSDT","XRP","Muito alto"],["BNBUSDT","BNB","Muito alto"]];
  const fixed=n => Number.isFinite(n)?n.toLocaleString("pt-BR",{minimumFractionDigits:n>=1000?2:n>=1?3:5,maximumFractionDigits:n>=1000?2:n>=1?3:6}):"Indisponível";
  const formatVol=n => Number.isFinite(n)?n.toLocaleString("pt-BR",{notation:"compact",maximumFractionDigits:1})+" USDT":"—";
  const escape=(s)=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const fmtPct=n=>Number.isFinite(n)?(n>0?"+":"")+n.toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})+"%":"—";
  function setText(id,value){const n=document.getElementById(id);if(n)n.textContent=String(value)}
  function activate(name,focus=false){
    for(const tab of document.querySelectorAll(".invest-tab")){const yes=tab.dataset.panel===name;tab.setAttribute("aria-selected",String(yes));tab.tabIndex=yes?0:-1;if(yes&&focus)tab.focus()}
    for(const p of document.querySelectorAll(".invest-panel"))p.hidden=p.id!=="panel-"+name;
    if(name==="crypto"&&!lastFetched)refreshCrypto();
  }
  for(const tab of document.querySelectorAll(".invest-tab"))tab.addEventListener("click",()=>activate(tab.dataset.panel));
  document.querySelector(".invest-tabs")?.addEventListener("keydown",e=>{
    if(!["ArrowLeft","ArrowRight","Home","End"].includes(e.key))return;
    const arr=[...document.querySelectorAll(".invest-tab")],i=arr.findIndex(t=>t.getAttribute("aria-selected")==="true");
    const next=e.key==="Home"?0:e.key==="End"?arr.length-1:(i+(e.key==="ArrowRight"?1:-1)+arr.length)%arr.length;
    e.preventDefault();activate(arr[next].dataset.panel,true);
  });
  async function loadPublicSnapshot(){
    try{
      const response=await fetch("investimentos-publicos.json",{cache:"no-store"});
      if(!response.ok)throw new Error("Public snapshot unavailable");
      const d=await response.json();
      if(d.livePrivateSheets!==false)throw new Error("Invalid public feed");
      setText("snapshot-date",new Date(d.snapshotDate+"T12:00:00").toLocaleDateString("pt-BR"));
      setText("br-count",d.markets.br.count);setText("br-hom",d.markets.br.homologated);
      setText("us-count",d.markets.us.count);setText("us-hom",d.markets.us.homologated);
      setText("crypto-count",d.markets.crypto.symbols.length);
      for(const [id,list] of [["br-tickers",d.markets.br.tickers],["us-tickers",d.markets.us.tickers]]){
        const box=document.getElementById(id);if(!box)continue;box.replaceChildren();
        list.forEach(sym=>{const span=document.createElement("span");span.textContent=sym;box.append(span)});
      }
    }catch(error){setText("snapshot-date","data não confirmada — consultar fonte oficial");}
  }
  const ema=(arr,n)=>{
    if(arr.length<n)return null;let e=arr.slice(0,n).reduce((a,b)=>a+b,0)/n;
    for(let i=n;i<arr.length;i++)e=e+(2/(n+1))*(arr[i]-e);return e;
  };
  const rsi=(p,n=14)=>{
    if(p.length<=n)return null;let gain=0,loss=0;
    for(let i=1;i<=n;i++){const d=p[i]-p[i-1];gain+=Math.max(d,0);loss+=Math.max(-d,0)}
    gain/=n;loss/=n;
    for(let i=n+1;i<p.length;i++){const d=p[i]-p[i-1];gain=(gain*(n-1)+Math.max(d,0))/n;loss=(loss*(n-1)+Math.max(-d,0))/n}
    return loss===0?100:100-100/(1+gain/loss);
  };
  async function api(path,signal){const res=await fetch(ENDPOINT+path,{cache:"no-store",signal});if(!res.ok)throw new Error("Binance "+res.status);return res.json()}
  async function trend(symbol,frame,signal){
    const bars=await api("/klines?symbol="+symbol+"&interval="+frame+"&limit=120",signal);
    const closed=bars.filter(c=>Number(c[6])<=Date.now());
    if(closed.length<51)return "Sem amostra";
    const closing=closed.map(c=>Number(c[4])),e20=ema(closing,20),e50=ema(closing,50),strength=rsi(closing);
    const latest=Number(closed[closed.length-1][6]);
    const maxAge=frame==="1h"?90:300;
    if(Date.now()-latest>maxAge*60000)return "Vencido";
    return e20>=e50&&strength>=38&&strength<=70?"Tendência favorável":"Sem confirmação";
  }
  let lastFetched=0,ongoing=false;
  async function refreshCrypto(){
    if(ongoing)return;
    ongoing=true;setText("crypto-api-label","Consultando Binance Spot — fonte pública…");
    const root=document.getElementById("crypto-cards");
    const ctrl=new AbortController(),time=setTimeout(()=>ctrl.abort(),12000);
    const output=await Promise.all(SYMBOLS.map(async ([symbol,name,risk])=>{
      try{
        const [t,tr1,tr4]=await Promise.all([
          api("/ticker/24hr?symbol="+symbol,ctrl.signal),
          trend(symbol,"1h",ctrl.signal),
          trend(symbol,"4h",ctrl.signal)
        ]);
        const p=Number(t.lastPrice),change=Number(t.priceChangePercent),volume=Number(t.quoteVolume),ask=Number(t.askPrice),bid=Number(t.bidPrice);
        const spread=(ask>0&&bid>0)?100*(ask-bid)/((ask+bid)/2):null;
        const fresh=Number(t.closeTime)>Date.now()-5*60000;
        return {symbol,name,risk,price:p,change,volume,spread,tr1,tr4,fresh,ok:Number.isFinite(p)&&fresh};
      }catch(e){return {symbol,name,risk,ok:false,error:"Cotação indisponível — tente novamente"};}
    }));
    clearTimeout(time);ongoing=false;lastFetched=Date.now();
    const any=output.filter(x=>x.ok).length;
    setText("crypto-api-label",any===5?"5/5 cotações Binance recebidas · mercado spot 24/7":any+" de 5 cotações disponíveis; sem dado recente não há sinal");
    setText("crypto-api-time","Consulta local: "+new Date().toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"}));
    if(!root)return;root.replaceChildren();
    for(const x of output){
      const article=document.createElement("article");article.className="crypto-card";
      const isExtreme=x.risk.includes("Extremo");
      // All interpolated fields come from a fixed whitelist or are number-formatted; no remote HTML injection.
      article.innerHTML='<div class="crypto-card-head"><div><span class="crypto-symbol">'+escape(x.symbol.replace("USDT",""))+'</span><span class="crypto-name">'+escape(x.name)+'</span></div><span class="crypto-risk'+(isExtreme?" extreme":"")+'">'+escape(x.risk)+'</span></div>'
        +'<div class="crypto-value">'+(x.ok?fixed(x.price)+" USDT":"Dados indisponíveis")+'</div>'
        +'<div class="crypto-move '+(x.change>=0?"up":"down")+'">'+(x.ok?fmtPct(x.change)+" em 24h":escape(x.error||"Sem API"))+'</div>'
        +'<div class="crypto-meta"><span>1 hora: <strong>'+escape(x.tr1||"Indisponível")+'</strong></span><span>4 horas: <strong>'+escape(x.tr4||"Indisponível")+'</strong></span><span>Volume de 24h: <strong>'+formatVol(x.volume)+'</strong></span><span>Spread atual: <strong>'+(Number.isFinite(x.spread)?x.spread.toLocaleString("pt-BR",{maximumFractionDigits:3})+"%":"—")+'</strong></span><span>Recomendação de compra: <strong>NÃO PUBLICADA / REQUER HOMOLOGAÇÃO</strong></span></div>';
      root.append(article);
    }
  }
  document.getElementById("refresh-crypto")?.addEventListener("click",refreshCrypto);
  loadPublicSnapshot();refreshCrypto();
  setInterval(()=>{if(document.visibilityState==="visible")refreshCrypto()},120000);
})();