import './style.css';
import { movies, soon, PLAY } from './data.js';

const WA="18095016277";
const $=id=>document.getElementById(id);
const wa=t=>`https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const embed=id=>`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" allowfullscreen></iframe>`;

// Película principal: foto + tráiler que se reproduce aquí mismo
const main=movies[0];
document.querySelector(".hero").style.setProperty("--hero",`url(${main.big||main.img})`);
$("hTitle").textContent=main.t; $("hDays").textContent=main.days; $("hTime").textContent=main.h;
$("hMeta").textContent=main.meta; $("hSyn").textContent=main.syn;
const playMain=()=>{$("player").innerHTML=embed(main.yt);};
$("hTrailer").onclick=()=>{playMain();$("player").scrollIntoView({behavior:"smooth",block:"center"});};

// Cartelera
$("grid").innerHTML=movies.map((m,i)=>`
  <div class="mv">
    <div class="ps" data-i="${i}">${m.tag?`<span class="tag ${m.g?"g":""}">${m.tag}</span>`:""}<img loading="lazy" src="${m.img}" alt="${m.t}"><div class="pl"><span class="vd">Ver detalles</span></div></div>
    <h3>${m.t}</h3>
    <div class="hr">${m.days} · <b>${m.h}</b></div>
    <div class="mvb"><button class="tb" data-i="${i}">Ver detalles</button><button class="btn btn-red btn-buy" data-buy="${i}">Comprar</button></div>
  </div>`).join("");
document.querySelectorAll("#grid [data-i]").forEach(el=>el.onclick=()=>openDetail(movies[+el.dataset.i],false));

// Próximamente
$("soon").innerHTML=soon.map((s,i)=>`<div class="sn" data-s="${i}"><img loading="lazy" src="${s.img}" alt="${s.t}"><div class="in"><div class="date"><b>${s.day}</b><small>${s.mon}</small></div><h3>${s.t}</h3><p>Estreno ${s.full}</p></div></div>`).join("");
document.querySelectorAll("[data-s]").forEach(el=>el.onclick=()=>openDetail(soon[+el.dataset.s],true));

// Horario
const H=[["Lunes","Cerrado",1],["Martes","6:00 PM",2],["Miércoles (2x1)","6:00 PM",3],["Jueves","6:00 PM",4],["Viernes","6:00 PM",5],["Sábado","4:30 PM",6],["Domingo","4:30 PM",0]];
const today=new Date().getDay();
$("hours").innerHTML=H.map(h=>`<div class="row ${h[1]==="Cerrado"?"c":""} ${h[2]===today?"today":""}"><span>${h[0]}${h[2]===today?" · hoy":""}</span><b>${h[1]}</b></div>`).join("");

// Ventana del tráiler (sin salir de la página)
function openM(title,sub,yt,link,label,buyIdx){$("mv").innerHTML=embed(yt);$("mt").textContent=title;$("mh").textContent=sub;
  if(buyIdx!=null){$("mr").style.display="none";$("mbuy").style.display="";$("mbuy").onclick=()=>{closeM();openBuy(buyIdx);};}
  else{$("mbuy").style.display="none";$("mr").style.display="";$("mr").href=link;$("mr").textContent=label;}
  $("modal").classList.add("open");document.body.style.overflow="hidden";}
function closeM(){$("modal").classList.remove("open");$("mv").innerHTML="";document.body.style.overflow="";}
/* ===== Compra de boletos (demo visual) ===== */
const DAYMAP={"Martes a Domingo":[2,3,4,5,6,0],"Sábado y Domingo":[6,0]};
const DN=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],DL=["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],MN=["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
const ROWS="ABCDEFGH".split(""),COLS=14,AISLES=[3,11];
let st={};
const price=m=>m.g?250:300;
const fdate=d=>`${DL[d.getDay()]} ${d.getDate()} ${MN[d.getMonth()]}`;
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;}
function rnd(seed){let x=seed||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return((x>>>0)%1000)/1000;};}
function datesFor(m){const out=[],d=new Date();d.setHours(0,0,0,0);for(let i=0;out.length<6&&i<21;i++){const x=new Date(d);x.setDate(d.getDate()+i);if(DAYMAP[m.days].includes(x.getDay()))out.push(x);}return out;}
function occupied(){const r=rnd(hash(st.mi+"|"+st.date.toDateString()));const s=new Set();ROWS.forEach(R=>{for(let c=1;c<=COLS;c++){const back=ROWS.indexOf(R)/ROWS.length;if(r()<0.18+back*0.25)s.add(R+c);}});return s;}
function total(){const m=movies[st.mi],n=st.n,p=price(m);const wed=st.date&&st.date.getDay()===3;return wed?Math.ceil(n/2)*p:n*p;}
function money(v){return "RD$"+v.toLocaleString("en-US");}

function openBuy(i){const m=movies[i];st={mi:i,step:0,date:datesFor(m)[0],n:2,seats:[]};st.occ=occupied();$("co").classList.add("open");document.body.style.overflow="hidden";render();}
function closeBuy(){$("co").classList.remove("open");document.body.style.overflow="";}
$("coX").onclick=closeBuy;

function render(){
  const m=movies[st.mi];
  document.querySelectorAll("#steps div").forEach((d,i)=>{d.className=i===st.step?"on":i<st.step?"done":"";});
  $("steps").style.display=st.step>4?"none":"flex";
  // resumen
  const wed=st.date.getDay()===3;
  $("sum").style.display=st.step>4?"none":"";
  $("sum").innerHTML=`<div class="sp"><img src="${m.img}" alt=""><div><h4>${m.t}</h4><small>Sala 1 · ${m.h}</small></div></div>
   <div class="li"><div><span>Fecha</span><b>${fdate(st.date)}</b></div><div><span>Hora</span><b>${m.h}</b></div><div><span>Boletos</span><b>${st.n} × ${money(price(m))}</b></div>${wed?'<div><span>Promoción</span><b style="color:#ff9ca0">Miércoles 2x1</b></div>':""}<div><span>Asientos</span><b>${st.seats.length?st.seats.join(", "):"—"}</b></div></div>
   <div class="tot"><span>Total</span><b>${money(total())}</b></div>`;
  $("navTot").textContent=money(total());
  $("navInfo").textContent=st.seats.length?`${st.n} boletos · ${st.seats.join(", ")}`:`${st.n} boletos`;
  $("back").style.visibility=st.step===0||st.step>3?"hidden":"visible";
  const nx=$("next");nx.disabled=false;nx.style.display="";
  const P=$("pane");
  if(st.step===0){
    P.innerHTML=`<h4 class="lbl">Película</h4><div class="mvpick">${movies.map((x,i)=>`<button class="${i===st.mi?"on":""}" data-pm="${i}" title="${x.t}"><img src="${x.img}" alt="${x.t}"></button>`).join("")}</div>
      <h4 class="lbl">Fecha</h4><div class="chips">${datesFor(m).map((d,i)=>`<button class="chip ${d.toDateString()===st.date.toDateString()?"on":""}" data-d="${i}"><small>${DN[d.getDay()]}</small><b>${d.getDate()}</b>${d.getDay()===3?'<span class="wd">2x1</span>':""}</button>`).join("")}</div>
      <h4 class="lbl">Hora</h4><div class="chips"><button class="chip on"><b style="font-size:17px">${m.h}</b><small>Sala 1</small></button></div>`;
    P.querySelectorAll("[data-pm]").forEach(b=>b.onclick=()=>{st.mi=+b.dataset.pm;st.date=datesFor(movies[st.mi])[0];st.seats=[];st.occ=occupied();render();});
    P.querySelectorAll("[data-d]").forEach(b=>b.onclick=()=>{st.date=datesFor(m)[+b.dataset.d];st.seats=[];st.occ=occupied();render();});
    nx.textContent="Continuar";
  }
  if(st.step===1){
    P.innerHTML=`<h4 class="lbl">¿Cuántos boletos?</h4>
      <div class="qty"><div><h5>${m.g?"Matiné":"Entrada general"}</h5><small>${money(price(m))} por persona</small></div><div class="ctr"><button id="mn">−</button><span>${st.n}</span><button id="pl">+</button></div></div>
      ${wed?`<div class="promo2">🎉 Es miércoles: pagas ${Math.ceil(st.n/2)} y entran ${st.n}. Promoción 2x1 aplicada.</div>`:""}`;
    $("mn").onclick=()=>{if(st.n>1){st.n--;st.seats=st.seats.slice(0,st.n);render();}};
    $("pl").onclick=()=>{if(st.n<10){st.n++;render();}};
    nx.textContent="Escoger asientos";
  }
  if(st.step===2){
    let h=`<div class="screen">PANTALLA</div><div class="seats">`;
    ROWS.forEach(R=>{h+=`<div class="srow"><span class="rl">${R}</span>`;for(let c=1;c<=COLS;c++){const id=R+c,oc=st.occ.has(id),sel=st.seats.includes(id);h+=`<button class="seat ${oc?"oc":""} ${sel?"sel":""}" data-s="${id}" title="${id}" ${oc?"disabled":""}>${c}</button>`;if(AISLES.includes(c))h+=`<span class="gap"></span>`;}h+=`<span class="rl">${R}</span></div>`;});
    h+=`</div><div class="legend"><span><i></i>Disponible</span><span><i class="s"></i>Tu asiento</span><span><i class="o"></i>Ocupado</span></div><p class="hint">Escoge ${st.n} asiento${st.n>1?"s":""} · llevas ${st.seats.length}</p>`;
    P.innerHTML=`<h4 class="lbl">Escoge tus asientos</h4>`+h;
    P.querySelectorAll(".seat:not(.oc)").forEach(b=>b.onclick=()=>{const id=b.dataset.s;if(st.seats.includes(id))st.seats=st.seats.filter(x=>x!==id);else{if(st.seats.length>=st.n)st.seats.shift();st.seats.push(id);}render();});
    nx.textContent="Ir a pagar";nx.disabled=st.seats.length!==st.n;
  }
  if(st.step===3){
    P.innerHTML=`<h4 class="lbl">Pago con tarjeta</h4>
      <div class="pay">
        <div class="cards"><span>VISA</span><span class="mc">Mastercard</span></div>
        <label>Nombre en la tarjeta<input value="Cliente de prueba" readonly></label>
        <label>Número de tarjeta<input value="•••• •••• •••• 0000 (demo)" readonly></label>
        <div class="two"><label>Vence<input value="12/29" readonly></label><label>CVV<input value="•••" readonly></label></div>
        <label>Correo para recibir el boleto<input value="cliente@ejemplo.com" readonly></label>
        <div class="lock">🔒 Pago seguro procesado por la pasarela del banco</div>
      </div>`;
    nx.textContent="Pagar "+money(total());
  }
  if(st.step===4){
    P.innerHTML=`<div class="spin"></div><p class="hint">Procesando pago…</p>`;nx.style.display="none";
    setTimeout(()=>{st.step=5;render();},1600);
  }
  if(st.step===5){
    const code="CO-"+(hash(st.seats.join()+st.mi)%900000+100000);
    P.innerHTML=`<div class="okmsg"><div class="ck">✓</div><h3>¡Compra confirmada!</h3><p>Te enviamos el boleto al correo. Muestra este código QR en la entrada.</p></div>
      <div class="ticket"><div class="th"><img src="https://cinemaoasisbonao.com/images/CinemaOasis_logowebp.webp" alt="Cinema Oasis"><b>${code}</b></div>
      <div class="tb2"><h4>${m.t}</h4><div class="tg"><div><small>Fecha</small><b>${fdate(st.date)}</b></div><div><small>Hora</small><b>${m.h}</b></div><div><small>Sala</small><b>1</b></div><div><small>Asientos</small><b>${st.seats.join(", ")}</b></div><div><small>Boletos</small><b>${st.n}</b></div><div><small>Total</small><b>${money(total())}</b></div></div></div>
      <div class="cut"></div><div class="qr">${qr(code)}<small>Escanéalo en la entrada · 4to piso, Oasis Mall</small></div></div>`;
    nx.textContent="Listo";nx.onclick=closeBuy;$("back").style.visibility="hidden";
    document.querySelector(".cogrid").style.gridTemplateColumns="minmax(0,1fr)";
    return;
  }
  document.querySelector(".cogrid").style.gridTemplateColumns="";
  nx.onclick=()=>{st.step++;render();$("co").scrollTo({top:0,behavior:"smooth"});};
}
$("back").onclick=()=>{if(st.step>0&&st.step<4){st.step--;render();}};

function qr(text){const N=25,r=rnd(hash(text)),c=[];const fin=(x,y)=>x<7&&y<7||x>=N-7&&y<7||x<7&&y>=N-7;
  let s=`<svg viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges"><rect width="${N}" height="${N}" fill="#fff"/>`;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(fin(x,y))continue;if(r()<0.48)s+=`<rect x="${x}" y="${y}" width="1" height="1" fill="#111"/>`;}
  [[0,0],[N-7,0],[0,N-7]].forEach(([x,y])=>{s+=`<rect x="${x}" y="${y}" width="7" height="7" fill="#111"/><rect x="${x+1}" y="${y+1}" width="5" height="5" fill="#fff"/><rect x="${x+2}" y="${y+2}" width="3" height="3" fill="#111"/>`;});
  return s+"</svg>";}


/* ===== Detalle de película ===== */
function openDetail(m,isSoon){
  $("dImg").src=m.img; $("dImg").alt=m.t;
  $("dTag").textContent=isSoon?"Próximamente":(m.tag||"En cartelera");
  $("dTag").className="badge"+(m.g?" bg":"");
  $("dTitle").textContent=m.t; $("dMeta").textContent=m.meta||""; $("dSyn").textContent=m.syn||"";
  $("dWhen").innerHTML=isSoon?`<span>Estreno: <b>${m.full}</b></span>`:`<span>Funciones: <b>${m.days}</b></span><span>Hora: <b>${m.h}</b></span>`;
  const c=$("dCta");
  const bb=$("dBuy");
  if(isSoon){c.style.display="";bb.style.display="none";c.textContent="Avísame del estreno";c.href="https://whatsapp.com/channel/0029VbA7BKeCnA7mCgYQ8D3t";}
  else{c.style.display="none";bb.style.display="";bb.textContent="🎟️ Comprar boletos";bb.onclick=()=>{closeDetail();openBuy(movies.indexOf(m));};}
  $("dVid").innerHTML="";$("dVid").classList.remove("on");$("dTrailer").textContent="▶ Ver tráiler";
  $("dTrailer").onclick=()=>{const v=$("dVid");if(v.classList.contains("on")){v.innerHTML="";v.classList.remove("on");$("dTrailer").textContent="▶ Ver tráiler";}else{v.innerHTML=embed(m.yt);v.classList.add("on");$("dTrailer").textContent="✕ Cerrar tráiler";$("dt").scrollTo({top:0,behavior:"smooth"});}};
  $("dt").classList.add("open");document.body.style.overflow="hidden";
}
function closeDetail(){$("dt").classList.remove("open");$("dVid").innerHTML="";$("dVid").classList.remove("on");document.body.style.overflow="";}
$("dClose").onclick=closeDetail;
$("dt").onclick=e=>{if(e.target.id==="dt")closeDetail();};
addEventListener("keydown",e=>{if(e.key==="Escape")closeDetail();});

$("close").onclick=closeM; $("modal").onclick=e=>{if(e.target.id==="modal")closeM();};
addEventListener("keydown",e=>{if(e.key==="Escape")closeM();});

/* ===== Animaciones ===== */
(function(){
  const hero=document.querySelector(".hero");
  if(hero) hero.insertAdjacentHTML("afterbegin",'<div class="beam" aria-hidden="true"></div>');
  const head=document.querySelector("header.top");
  const onScroll=()=>head.classList.toggle("sc",scrollY>40);
  addEventListener("scroll",onScroll,{passive:true});onScroll();
  const groups=[".sh",".tixcta",".note","#grid .mv",".tk",".sn",".lb",".map"];
  groups.forEach(sel=>document.querySelectorAll(sel).forEach((el,i)=>{el.classList.add("rv");el.style.transitionDelay=((i%5)*90)+"ms";}));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const t=e.target;t.classList.add("in");io.unobserve(t);setTimeout(()=>{t.style.transitionDelay="";},1300);}}),{threshold:.12,rootMargin:"0px 0px -40px 0px"});
  document.querySelectorAll(".rv").forEach(el=>io.observe(el));
})();

/* ===== Menú móvil ===== */
(function(){const b=document.getElementById("burger"),n=document.getElementById("mnav");if(!b)return;
 const set=o=>{n.classList.toggle("open",o);b.classList.toggle("on",o);b.setAttribute("aria-expanded",o);};
 b.onclick=()=>set(!n.classList.contains("open"));n.querySelectorAll("a").forEach(a=>a.onclick=()=>set(false));})();

document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>openBuy(+b.dataset.buy));
