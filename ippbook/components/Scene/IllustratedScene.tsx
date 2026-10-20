"use client";

import { useCallback, useState, useId } from 'react';
import dynamic from 'next/dynamic';
import styles from './IllustratedScene.module.css';

const Reader=dynamic(()=>import('@/ippbook/components/Book/BookReaderModal').then(m=>m.BookReaderModal),{ssr:false});

function Pumpkin({x,y,size,tilt=0,turn=1}:{x:number;y:number;size:number;tilt?:number;turn?:number}) {
  const id=useId().replace(/:/g, "");
  return <g className={styles.pumpkin} style={{animationDelay:`${x * -.013}s`}} transform={`translate(${x} ${y}) rotate(${tilt}) scale(${size * turn} ${size})`}>
    <defs><clipPath id={id}><path d="M-1-57 C-42-80-91-44-83 10 C-83 68-34 80 0 69 C40 80 86 55 83 7 C86-43 37-78-1-57Z"/></clipPath></defs>
    <ellipse cx="0" cy="55" rx="133" ry="29" fill="url(#pumpkinHalo)" className={styles.lightSpill}/>
    <ellipse cx="0" cy="66" rx="82" ry="12" fill="#000" opacity=".75" filter="url(#softShadow)"/>
    <path d="M-1-57 C-42-80-91-44-83 10 C-83 68-34 80 0 69 C40 80 86 55 83 7 C86-43 37-78-1-57Z" fill="url(#skin)" stroke="#2b160e" strokeWidth="3"/>
    <g clipPath={`url(#${id})`}>
      {[-72,-54,-32,-9,16,40,61,77].map((n,i)=><ellipse key={n} cx={n*.76} cy="7" rx={20+7*Math.sin(i)} ry={65+3*Math.cos(i)} fill="url(#ribLight)" transform={`rotate(${-n*.18} ${n*.76} 7)`}/>)}
      {Array.from({length:12},(_,i)=>{const n=-77+i*14;return <path key={i} d={`M${n*.22} -60 Q${n*1.45+3*Math.sin(i)} 0 ${n*.47} 71`} fill="none" stroke={i%3?'#e6a66a':'#25190f'} strokeWidth={i%3?1:2} opacity={i%3?.14:.24}/>;})}
      <ellipse cx="-25" cy="-38" rx="62" ry="24" fill="url(#coolRim)"/>
    </g>
    <path d="M-7-58 Q3-75-3-93 L5-98 Q18-76 11-58Z" fill="url(#stem)" stroke="#665841"/>
    <path d="M-53-6 L-25 2 -37-24Z M24 2 54-7 40-24Z M-6 13 3-3 10 14Z M-56 24 -35 37 -23 32 -23 42 -7 46 -7 38 10 39 10 47 28 42 28 33 40 34 58 20 49 48 24 59 -18 59 -47 48Z" fill="#4e240c" stroke="#8b461a" strokeWidth="5"/>
    <path d="M-51-7 -25 2 -37-21Z M25 2 52-7 40-21Z M-5 12 3 0 9 13Z M-54 25 -35 38 -22 34 -22 44 -6 48 -6 40 9 41 9 49 29 43 29 35 41 36 55 24 47 47 23 57 -18 57 -45 47Z" fill="url(#fire)" filter="url(#carveGlow)"/>
    <path d="M-74 2 Q-79-30-47-48 M-66 37 Q-51 62-30 62" fill="none" stroke="#d68439" opacity=".24" strokeWidth="3"/>
  </g>;
}
function Candle({x,y,h,w=27}:{x:number;y:number;h:number;w?:number}) {
 return <g transform={`translate(${x} ${y})`}>
   <ellipse cy="4" rx={w*.95} ry="3.2" fill="#050807" opacity=".85" filter="url(#softShadow)"/>
   <ellipse cy="3" rx={w*.72} ry="2" fill="#080b09" opacity=".9"/>
   <path d={`M${-w*.8} 0 Q${-w} 9 -3 7 Q${w} 13 ${w*.8} 1 L${w*.5} -8 ${-w*.5} -8Z`} fill="#bca675"/>
   <path d={`M${-w/2} ${-h} L${-w*.56} 0 Q0 12 ${w*.55} 0 L${w/2} ${-h}Z`} fill="url(#wax)" filter="url(#waxTexture)"/>
   {Array.from({length:7},(_,i)=>{const dx=-w*.43+i*w*.14,len=h*(.18+.38*(Math.sin(i*7+x)*.5+.5));return <path key={i} d={`M${dx} ${-h+3} Q${dx-2} ${-h+len*.6} ${dx+1} ${-h+len}`} stroke={i%2?'#f2d799':'#c09b60'} strokeWidth={w*.12} strokeLinecap="round" fill="none"/>;})}
   <ellipse cy={-h} rx={w/2} ry="5" fill="#f4d889"/><ellipse cy={-h} rx={w*.28} ry="2.6" fill="#ad7430"/>
   <path d={`M0 ${-h} L1 ${-h-10}`} stroke="#281e17" strokeWidth="2"/>
   <ellipse cy="0" rx="65" ry="15" fill="url(#halo)" className={styles.lightSpill}/>
   <g transform={`translate(0 ${-h}) scale(${w/27}) translate(0 ${h})`}>
   <g className={styles.flame} style={{animationDelay:`${x * -.017}s`,transformOrigin:`0px ${-h-8}px`}}>
   <ellipse cy={-h-18} rx="48" ry="65" fill="url(#halo)"/>
   <path d={`M0 ${-h-40} C-3 ${-h-21} -10 ${-h-8} 0 ${-h-7} C10 ${-h-8} 7 ${-h-20} 0 ${-h-40}Z`} fill="url(#fire)"/>
   <path d={`M0 ${-h-25} Q-6 ${-h-7} 1 ${-h-8} Q5 ${-h-10} 0 ${-h-25}`} fill="#fffde1"/>
   </g></g>
 </g>;
}
function Grimoire({open}:{open:()=>void}) {
 return <g role="button" tabIndex={0} aria-label="Open the book" onClick={open} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}}} className={styles.book}>
   <title>Open the book</title>
   <path d="M325 397 502 491 703 442 692 432 502 476 337 387Z" fill="#000" opacity=".72" filter="url(#softShadow)"/>
   <path d="M337 392 502 483 696 437" fill="none" stroke="#080a09" strokeWidth="8" opacity=".8"/>
   <path d="M317 315 515 278 706 369 697 440 502 489 334 391Z" fill="#171512" stroke="#51422c" strokeWidth="4"/>
   <path d="M491 397 694 349 690 429 500 477Z" fill="url(#paper)" stroke="#4e3a24" strokeWidth="3"/>
   {Array.from({length:37},(_,i)=><path key={i} d={`M${495+i*.13} ${399+i*1.94} Q${590+i*.08} ${377+i*2.0+Math.sin(i)*1.6} ${694-i*.11} ${351+i*2.1}`} stroke={i%3?'#473827':'#c0a779'} strokeWidth={i%3?.45:.85} opacity=".7"/>)}
   <path d="M319 298 Q300 345 332 390 L501 479 Q480 443 491 397Z" fill="url(#leather)" filter="url(#hideTexture)" stroke="#241a13" strokeWidth="2"/>
   {[.16,.36,.58,.80].map((t,i)=><path key={i} d={`M${319+172*t} ${298+99*t} Q${300+175*t} ${337+107*t} ${332+169*t} ${390+89*t}`} stroke="#100f0c" strokeWidth="10" fill="none"/>)}
   {[.16,.36,.58,.80].map((t,i)=><path key={i} d={`M${322+172*t} ${298+99*t} Q${305+175*t} ${337+107*t} ${336+169*t} ${390+89*t}`} stroke="#97704b" opacity=".65" strokeWidth="3" fill="none"/>)}
   <path d="M319 293 511 244 711 345 491 405Z" fill="url(#leather)" filter="url(#hideTexture)" stroke="#756a50" strokeWidth="1.5"/>
   <g transform="matrix(.91 -.235 .74 .375 329 294)">
     <rect width="198" height="254" rx="9" fill="none" stroke="#101714" strokeWidth="7"/>
     <rect x="9" y="10" width="180" height="234" rx="8" fill="none" stroke="#8a8163" strokeWidth="1.7"/>
     {[0,1].map(side=><g key={side} transform={side?'translate(198 0) scale(-1 1)':''}>
       <path d="M23 33 Q70 16 57 67 Q13 70 29 96 Q60 123 26 154 Q11 182 52 182 Q76 231 24 223" fill="none" stroke="#0a1110" strokeWidth="6"/>
       <path d="M23 31 Q70 14 57 65 Q13 68 29 94 Q60 121 26 152 Q11 180 52 180 Q76 229 24 221" fill="none" stroke="#81785e" strokeWidth="2.2"/>
       {[47,94,159,205].map(y=><path key={y} d={`M29 ${y} q28 -20 29 3 q-10 25 -23 3 q-2 -8 5 -8`} fill="none" stroke="#736c53" strokeWidth="2"/>)}
     </g>)}
     <path d="M73 99 125 99 125 135 Q121 157 99 169 Q76 157 73 135Z" fill="#222821" stroke="#8a8060" strokeWidth="3"/>
     <path d="M80 104 118 104 117 134 99 155 81 134Z M99 106V151 M81 125H117" fill="none" stroke="#a09067" strokeWidth="2"/>
     <path d="M65 104 Q47 146 76 169 L99 180 124 169 Q149 146 132 104 M85 90 89 80 99 87 110 80 114 90Z" fill="none" stroke="#8e8260" strokeWidth="3"/>
     {[[0,0],[198,0],[0,254],[198,254]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y}) scale(${x?-1:1} ${y?-1:1})`}><path d="M0 0H42V9Q17 7 17 22L8 42H0Z" fill="url(#brass)" stroke="#b6ad81" strokeWidth="1"/><circle cx="7" cy="7" r="2" fill="#262d23"/><circle cx="31" cy="5" r="2" fill="#262d23"/></g>)}
   </g>
 </g>;
}
export function IllustratedScene(){
 const [reading,setReading]=useState(false);const close=useCallback(()=>setReading(false),[]);
 return <main className={styles.scene}><div className={styles.stage} onPointerMove={e=>{const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--mx',`${(e.clientX-r.left)/r.width-.5}`);e.currentTarget.style.setProperty('--my',`${(e.clientY-r.top)/r.height-.5}`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--mx','0');e.currentTarget.style.setProperty('--my','0');}}>
  <div className={styles.backdrop} aria-hidden="true"/>
  <div className={styles.atmosphere} aria-hidden="true"/>
  <svg viewBox="0 0 1024 576" preserveAspectRatio="xMidYMid slice" className={styles.art} aria-label="Candlelit antique book and pumpkins on a weathered wooden table" role="group">
   <defs>
    <filter id="softShadow" x="-20%" y="-70%" width="140%" height="240%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="carveGlow" x="-50%" y="-60%" width="200%" height="220%"><feDropShadow dx="0" dy="0" stdDeviation="10" floodColor="#ff8b18" floodOpacity="1"/><feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#ffe991" floodOpacity="1"/></filter>
    <filter id="organic" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence baseFrequency=".16 .30" numOctaves="3" seed="22" result="noise"/><feDiffuseLighting in="noise" lightingColor="#b2a18a" surfaceScale="1.8" diffuseConstant=".8" result="light"><feDistantLight azimuth="225" elevation="45"/></feDiffuseLighting><feBlend in="SourceGraphic" in2="light" mode="soft-light"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="hideTexture" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".38" numOctaves="3" seed="12" result="noise"/><feDiffuseLighting in="noise" surfaceScale="3" lightingColor="#a59b85" result="light"><feDistantLight azimuth="230" elevation="38"/></feDiffuseLighting><feBlend in="SourceGraphic" in2="light" mode="soft-light"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <filter id="waxTexture"><feTurbulence type="fractalNoise" baseFrequency=".12 .035" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" xChannelSelector="R" yChannelSelector="G"/></filter>
    <filter id="woodTexture" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".008 .31" numOctaves="3" seed="19" result="noise"/><feDiffuseLighting in="noise" surfaceScale="2.5" lightingColor="#a38b6f" result="light"><feDistantLight azimuth="245" elevation="40"/></feDiffuseLighting><feBlend in="SourceGraphic" in2="light" mode="soft-light"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <radialGradient id="ribLight" cx="26%" cy="30%" r="76%"><stop stopColor="#f3bd83" stopOpacity=".35"/><stop offset=".35" stopColor="#bd713a" stopOpacity=".12"/><stop offset=".78" stopColor="#21150d" stopOpacity=".12"/><stop offset="1" stopColor="#100e09" stopOpacity=".7"/></radialGradient>
    <radialGradient id="coolRim"><stop stopColor="#92b2c6" stopOpacity=".28"/><stop offset="1" stopColor="#92b2c6" stopOpacity="0"/></radialGradient>
    <radialGradient id="mist"><stop stopColor="#416375" stopOpacity=".17"/><stop offset="1" stopColor="#122431" stopOpacity="0"/></radialGradient>
    <linearGradient id="night" x2="0" y2="1"><stop stopColor="#03090f"/><stop offset="1" stopColor="#122431"/></linearGradient>
    <radialGradient id="skin" cx="35%" cy="20%" r="85%"><stop stopColor="#d97b25"/><stop offset=".35" stopColor="#b75314"/><stop offset=".75" stopColor="#7c2b0c"/><stop offset="1" stopColor="#351609"/></radialGradient>
    <linearGradient id="stem"><stop stopColor="#181e15"/><stop offset=".5" stopColor="#6c6348"/><stop offset="1" stopColor="#262b1e"/></linearGradient>
    <radialGradient id="fire" cx="50%" cy="60%" r="70%"><stop stopColor="#ffffd5"/><stop offset=".5" stopColor="#ffe878"/><stop offset=".82" stopColor="#ffac24"/><stop offset="1" stopColor="#de630c"/></radialGradient>
    <radialGradient id="pumpkinHalo"><stop stopColor="#ffba39" stopOpacity=".68"/><stop offset=".42" stopColor="#ff831b" stopOpacity=".25"/><stop offset="1" stopColor="#ff7015" stopOpacity="0"/></radialGradient>
    <linearGradient id="chandelierMetal"><stop stopColor="#3c3527"/><stop offset=".35" stopColor="#a58a50"/><stop offset=".55" stopColor="#4b422d"/><stop offset=".8" stopColor="#927845"/><stop offset="1" stopColor="#29291f"/></linearGradient>
    <radialGradient id="chandelierHalo"><stop stopColor="#ffd98a" stopOpacity=".48"/><stop offset=".3" stopColor="#ffbb54" stopOpacity=".19"/><stop offset="1" stopColor="#ff9a34" stopOpacity="0"/></radialGradient>
    <radialGradient id="halo"><stop stopColor="#ffcf60" stopOpacity=".35"/><stop offset="1" stopColor="#ffa22e" stopOpacity="0"/></radialGradient>
    <linearGradient id="bone"><stop stopColor="#758184"/><stop offset=".33" stopColor="#c3c2ad"/><stop offset=".6" stopColor="#aaa994"/><stop offset="1" stopColor="#636f72"/></linearGradient>
    <linearGradient id="wax"><stop stopColor="#846239"/><stop offset=".28" stopColor="#e1c17b"/><stop offset=".5" stopColor="#f6dda1"/><stop offset=".75" stopColor="#c49b58"/><stop offset="1" stopColor="#765b34"/></linearGradient>
    <linearGradient id="wood" x2=".4" y2="1"><stop stopColor="#2a2924"/><stop offset=".5" stopColor="#58402b"/><stop offset="1" stopColor="#211d18"/></linearGradient>
    <linearGradient id="leather" x2=".8" y2="1"><stop stopColor="#62605a"/><stop offset=".25" stopColor="#343d3b"/><stop offset=".55" stopColor="#3e3028"/><stop offset=".8" stopColor="#202a29"/><stop offset="1" stopColor="#171e1b"/></linearGradient>
    <linearGradient id="paper" x2="0" y2="1"><stop stopColor="#a28c64"/><stop offset=".5" stopColor="#796346"/><stop offset="1" stopColor="#302c22"/></linearGradient>
    <linearGradient id="brass"><stop stopColor="#aaa37c"/><stop offset=".5" stopColor="#616852"/><stop offset="1" stopColor="#b2a477"/></linearGradient>
    <radialGradient id="vignette"><stop offset=".45" stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".68"/></radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" seed="8"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer><feBlend in="SourceGraphic" mode="soft-light"/></filter>
   </defs>
   <g className={styles.skeletonLayer} aria-hidden="true">
    <ellipse cx="153" cy="535" rx="44" ry="9" fill="#000" opacity=".6" filter="url(#softShadow)"/>
    <image href="/assets/realistic-skeleton.png" x="86" y="199" width="236" height="354" preserveAspectRatio="xMidYMid meet"/>
   </g>
   <g className={styles.surfaceLight} aria-hidden="true">
    <ellipse cx="351" cy="389" rx="98" ry="15" fill="url(#halo)"/>
    <ellipse cx="776" cy="391" rx="143" ry="20" fill="url(#pumpkinHalo)"/>
   </g>
   <g className={styles.candleLayer}>
    <Candle x={351} y={380} h={55} w={15}/>
    <Candle x={376} y={389} h={39} w={17}/>
    <Candle x={327} y={393} h={28} w={18}/>
   </g>
   <g className={styles.rearObjects}>
    <Pumpkin x={815} y={341} size={.46} tilt={-7} turn={-.84}/>
    <Pumpkin x={750} y={347} size={.65} tilt={3} turn={.95}/>
   </g>
   <g className={styles.bookLayer}><g transform="translate(278 164) scale(.5)"><Grimoire open={()=>setReading(true)}/></g></g>
   <g className={styles.frontObjects}>
    <Pumpkin x={691} y={374} size={.38} tilt={-9} turn={.78}/>
    <Pumpkin x={845} y={370} size={.40} tilt={7} turn={-.9}/>
   </g>
  </svg></div>
  {reading&&<Reader isOpen onClose={close}/>}
 </main>;
}
