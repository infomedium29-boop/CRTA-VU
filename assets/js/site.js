/* CRTA VU | Lightweight static-site interactions. No analytics without consent. */
(() => {
'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const body=document.body;
const menuBtn=$('[data-menu-toggle]');
menuBtn?.addEventListener('click',()=>{const open=body.classList.toggle('menu-open');menuBtn.setAttribute('aria-expanded',String(open));});
$$('.mobile-menu a').forEach(link=>link.addEventListener('click',()=>{body.classList.remove('menu-open');menuBtn?.setAttribute('aria-expanded','false');}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){body.classList.remove('menu-open');menuBtn?.setAttribute('aria-expanded','false');}});
// Brand drawing intro only once per browsing session and never hold navigation captive.
const intro=$('.intro');
if(intro){let visited=false;try{visited=!!sessionStorage.getItem('crta-intro');if(!visited)sessionStorage.setItem('crta-intro','1')}catch{}if(visited||reduced){intro.remove();}else{window.setTimeout(()=>{intro.classList.add('is-done');window.setTimeout(()=>intro.remove(),750)},1600);}}
// Entrance reveals respect reduced motion preferences.
if(!reduced&&'IntersectionObserver' in window){const observer=new IntersectionObserver((entries,obs)=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');obs.unobserve(e.target);}})},{threshold:.08,rootMargin:'0px 0px -35px 0px'});$$('.reveal').forEach(el=>observer.observe(el));}else{$$('.reveal').forEach(el=>el.classList.add('in-view'));}
const topButton=$('.to-top');const syncScroll=()=>{topButton?.classList.toggle('show',window.scrollY>850);};window.addEventListener('scroll',syncScroll,{passive:true});syncScroll();topButton?.addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'instant':'smooth'}));
// Cookie consent: no scripts are injected until the visitor accepts statistics.
const COOKIE_KEY='crta-vu-consent-v1';const GA_ID=''; // Production: add a real GA4 Measurement ID only after configuring the business account.
const banner=$('.cookie-banner');const options=$('.cookie-options');
function getConsent(){try{return JSON.parse(localStorage.getItem(COOKIE_KEY)||'null')}catch{return null}}
let analyticsLoaded=false;
function initAnalytics(){if(analyticsLoaded||!GA_ID||!/^G-[A-Z0-9]+$/.test(GA_ID))return;analyticsLoaded=true;const script=document.createElement('script');script.async=true;script.src=`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;document.head.appendChild(script);window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',GA_ID,{anonymize_ip:true});}
function saveConsent(analytics){try{localStorage.setItem(COOKIE_KEY,JSON.stringify({necessary:true,analytics,updated:new Date().toISOString()}))}catch{}if(analytics)initAnalytics();banner?.classList.remove('show');options?.classList.remove('show');}
if(getConsent()?.analytics)initAnalytics();if(!getConsent())banner?.classList.add('show');
$$('[data-cookie-accept]').forEach(b=>b.addEventListener('click',()=>saveConsent(true)));
$$('[data-cookie-reject]').forEach(b=>b.addEventListener('click',()=>saveConsent(false)));
$$('[data-cookie-settings]').forEach(b=>b.addEventListener('click',()=>{banner?.classList.add('show');options?.classList.toggle('show');}));
$('[data-cookie-save]')?.addEventListener('click',()=>saveConsent(!!$('#analytics-opt')?.checked));
// Form: uses Web3Forms if configured. Until then a validated mailto draft is opened (not a false submission claim).
const form=$('[data-contact-form]');
const WEB3FORMS_KEY=''; // Set the real client-owned key here before release.
form?.addEventListener('submit',async e=>{e.preventDefault();const status=$('[data-form-status]');if(!form.reportValidity())return;if(form.elements.website?.value)return;const data=new FormData(form);const name=String(data.get('name')||'');const email=String(data.get('email')||'');const phone=String(data.get('phone')||'');const subject=String(data.get('service')||'Upit putem web stranice');const message=String(data.get('message')||'');const btn=form.querySelector('button[type="submit"]');if(status)status.textContent='';
if(WEB3FORMS_KEY){try{btn.disabled=true;const payload={access_key:WEB3FORMS_KEY,name,email,phone,subject,message,from_name:'CRTA VU web',botcheck:''};const response=await fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const json=await response.json();if(!response.ok||!json.success)throw Error('Slanje nije uspjelo');form.reset();if(status)status.textContent='Hvala! Upit je uspješno poslan.';}catch{if(status)status.textContent='Upit nije poslan. Pokušajte ponovno ili nam pišite izravno na crta-vu@gmail.com.';}finally{btn.disabled=false;}}
else{const subjectText=`Upit s web stranice CRTA VU — ${subject}`;const bodyText=`Ime i prezime: ${name}\nE-mail: ${email}\nTelefon: ${phone}\nUsluga: ${subject}\n\nPoruka:\n${message}`;const mailto=`mailto:crta-vu@gmail.com?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;if(status)status.textContent='Otvara se vaša aplikacija za e-poštu. Poruka će biti poslana tek kada je pošaljete iz te aplikacije.';window.location.href=mailto;}
});
// Canonical/OG absolute URLs are generated from the live origin on an owned production hostname.
const host=location.hostname;const hosted=host&&host!=='localhost'&&host!=='127.0.0.1'&&!host.endsWith('.pages.dev')&&!host.endsWith('.example');
if(hosted){const path=location.pathname.endsWith('.html')?location.pathname:location.pathname.endsWith('/')?location.pathname:location.pathname+'/';const uri=location.origin+path;const can=$('link[rel="canonical"]');if(can)can.href=uri;const og=$('meta[property="og:url"]');if(og)og.content=uri;const ogim=$('meta[property="og:image"]');if(ogim)ogim.content=location.origin+'/assets/img/hero.avif';}
// Interactive 3D architectural model, software-rendered on canvas (no external libraries, no trackers).
const canvas=$('#architecture-model');
if(canvas){const ctx=canvas.getContext('2d',{alpha:true});const state={yaw:-.77,pitch:-.32,wire:false,drag:false,x:0,y:0};const TAU=Math.PI*2;let raf=0,last=0;const viewport=()=>{const r=canvas.getBoundingClientRect();const dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);return {w:r.width,h:r.height};};let dims=viewport();let visible=true;
const rot=([x,y,z])=>{const a=state.yaw,b=state.pitch;let xx=x*Math.cos(a)+z*Math.sin(a);let zz=-x*Math.sin(a)+z*Math.cos(a);return [xx,y*Math.cos(b)-zz*Math.sin(b),y*Math.sin(b)+zz*Math.cos(b)];};
const pr=(pt)=>{const p=rot(pt);const sc=Math.min(dims.w/10,dims.h/8.3)*1.02;const depth=9.7/(9.7+p[2]);return {x:dims.w*.5+p[0]*sc*depth,y:dims.h*.53-p[1]*sc*depth,z:p[2],depth}};
let faces=[];let edges=[];function poly(points,color,kind='solid',stroke='#ffffff25'){const projected=points.map(pr);faces.push({points:projected,z:projected.reduce((a,b)=>a+b.z,0)/projected.length,fill:color,kind,stroke});}
function line(a,b,color='#bdc6c5',width=.7){edges.push({a:pr(a),b:pr(b),color,width});}
function cube(x0,y0,z0,x1,y1,z1,colors){const v=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];const ids=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[3,2,6,7],[1,5,6,2],[0,3,7,4]];ids.forEach((id,i)=>poly(id.map(n=>v[n]),colors[i]||colors[0]));if(state.wire){ids.forEach(id=>id.forEach((n,i)=>line(v[n],v[id[(i+1)%id.length]],'#d5c09f',.85)));}}
function geometry(){faces=[];edges=[];
// The custom model is intentionally an architectural visualization, not an assertion about a delivered client project.
cube(-3.3,-1.85,-2.35,3.3,-1.67,2.35,['#6e716d','#777b78','#444a48','#9a9f97','#8c928d','#666c67']);
cube(-2.6,-1.66,-1.6,2.85,-.12,1.85,['#203d45','#2c3436','#646f6e','#354145','#273137','#283237']);
// Glazing panes on front and right.
poly([[-2.35,-1.49,-1.635],[.1,-1.49,-1.635],[.1,-.25,-1.635],[-2.35,-.25,-1.635]],'#416067','glass');
poly([[.15,-1.49,-1.635],[2.55,-1.49,-1.635],[2.55,-.25,-1.635],[.15,-.25,-1.635]],'#36535c','glass');
poly([[2.88,-1.49,-1.2],[2.88,-1.49,1.58],[2.88,-.25,1.58],[2.88,-.25,-1.2]],'#41555a','glass');
// Cantilever over ground floor, roof as a heavy slab.
cube(-2.95,-.12,-1.9,3.1,1.34,1.35,['#273a40','#777974','#9b998e','#c0b6a5','#888982','#98958b']);
// A dramatic deep inset upper façade, framed in bronze and glass.
poly([[-2.72,.1,-1.923],[2.77,.1,-1.923],[2.77,1.06,-1.923],[-2.72,1.06,-1.923]],'#1b2f33','glass');
for(const x of [-1.55,-.25,1.05,2.45])line([x,.1,-1.94],[x,1.06,-1.94],'#b5a992',1.4);
// Long projecting flat eave.
cube(-3.12,1.29,-1.98,3.28,1.55,1.59,['#aba99c','#7d837e','#c7bbaa','#e0d5c4','#928f83','#c7b7a0']);
// Thin porch overhang at level zero.
cube(-3.1,-.12,1.55,2.98,.04,2.24,['#a4a297','#888c84','#adada2','#cbc1b1','#8f9189','#a7a69b']);
// Columns / structural pilasters.
cube(-2.92,-1.65,1.48,-2.77,-.03,1.62,['#a2a7a1','#898f89','#b9b3a5','#cac0ae','#898a83','#999b91']);
cube(2.73,-1.65,1.48,2.87,-.03,1.62,['#9a9e97','#858d85','#aca99d','#cbc4b4','#9c9a8d','#a4a498']);
// Entrance approach and low steps.
cube(-2.25,-1.86,2.31,2.75,-1.71,3.2,['#737b74','#737b74','#a5a59c','#918e85','#8a8d82','#7b837b']);
for(const z of [2.38,2.7,3.03])line([-2.1,-1.69,z],[2.65,-1.69,z],'#cfbea7',.75);
// Architectural guideline axes and base technical markers.
for(let x=-4;x<=4;x++)line([x,-1.88,-3.7],[x,-1.88,3.7],'#a9b0a91c',.6);
for(let z=-4;z<=4;z++)line([-4,-1.88,z],[4,-1.88,z],'#a9b0a91c',.6);
}
function render(t){raf=0;if(!visible)return;let delta=Math.min(30,t-last);last=t;if(!state.drag&&!reduced)state.yaw+=delta*.00008;ctx.clearRect(0,0,dims.w,dims.h);geometry();faces.sort((a,b)=>b.z-a.z);faces.forEach(f=>{ctx.beginPath();f.points.forEach((pt,i)=>i?ctx.lineTo(pt.x,pt.y):ctx.moveTo(pt.x,pt.y));ctx.closePath();if(!state.wire){ctx.fillStyle=f.fill;ctx.fill();if(f.kind==='glass'){ctx.save();ctx.clip();const bb=f.points;ctx.strokeStyle='#cdd9c435';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(bb[0].x+15,bb[0].y+3);ctx.lineTo(bb[2].x-15,bb[2].y-3);ctx.stroke();ctx.restore();}ctx.strokeStyle=f.stroke;ctx.lineWidth=.6;ctx.stroke();}else{ctx.fillStyle='#1017191c';ctx.fill();ctx.strokeStyle=f.kind==='glass'?'#78b3ac':'#c7b092';ctx.lineWidth=.9;ctx.stroke();}});edges.forEach(e=>{ctx.strokeStyle=e.color;ctx.lineWidth=e.width;ctx.beginPath();ctx.moveTo(e.a.x,e.a.y);ctx.lineTo(e.b.x,e.b.y);ctx.stroke();});if(!reduced&&visible)raf=requestAnimationFrame(render);}
function draw(){if(!raf)raf=requestAnimationFrame(render)};canvas.addEventListener('pointerdown',e=>{state.drag=true;state.x=e.clientX;state.y=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointermove',e=>{if(!state.drag)return;state.yaw+=(e.clientX-state.x)*.008;state.pitch=Math.max(-.05,Math.min(.85,state.pitch+(e.clientY-state.y)*.005));state.x=e.clientX;state.y=e.clientY;draw()});['pointerup','pointercancel','lostpointercapture'].forEach(evt=>canvas.addEventListener(evt,()=>state.drag=false));$$('[data-model-mode]').forEach(b=>b.addEventListener('click',()=>{state.wire=b.dataset.modelMode==='wire';$$('[data-model-mode]').forEach(el=>el.setAttribute('aria-pressed',String(el===b)));draw();}));const ro=new ResizeObserver(()=>{dims=viewport();draw()});ro.observe(canvas);const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)draw();else if(raf){cancelAnimationFrame(raf);raf=0}},{threshold:0});io.observe(canvas);document.addEventListener('visibilitychange',()=>{if(!document.hidden)draw()});draw();}
})();
