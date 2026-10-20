import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

export function createAntiqueBook() {
  const group = new THREE.Group();
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#30231e'; ctx.fillRect(0,0,1024,1024);
  let seed = 19;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for(let i=0;i<85000;i++) { const v=35+random()*65; ctx.fillStyle=`rgba(${v+15},${v},${v-8},0.28)`; ctx.fillRect(random()*1024,random()*1024,1+random()*3,1+random()*3); }
  for(let i=0;i<1600;i++) { const x=random()*1024,y=random()*1024; ctx.strokeStyle='rgba(10,7,5,0.22)';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+random()*25-12,y+random()*20);ctx.stroke(); }
  const leatherMap=new THREE.CanvasTexture(canvas); leatherMap.colorSpace=THREE.SRGBColorSpace; leatherMap.anisotropy=16;
  const leather=new THREE.MeshStandardMaterial({map:leatherMap,bumpMap:leatherMap,bumpScale:0.018,roughness:0.78});
  const bronze=new THREE.MeshStandardMaterial({color:'#837347',metalness:0.78,roughness:0.48});
  const tooling=new THREE.MeshStandardMaterial({color:'#514a36',metalness:0.48,roughness:0.68});
  const mesh=(geo:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;group.add(m);return m;};
  const box=(w:number,h:number,d:number,mat:THREE.Material,x:number,y:number,z:number,r=0.025)=>mesh(new RoundedBoxGeometry(w,h,d,3,r),mat,x,y,z);
  box(2.32,0.10,2.95,leather,0,0.08,0);
  const paper=new THREE.MeshStandardMaterial({color:'#bba777',roughness:0.95});
  box(2.16,0.48,2.77,paper,0.025,0.36,0,0.018);
  // Individually modeled uneven signatures create real shadows along the fore edge.
  for(let i=0;i<65;i++) {
    const shade=new THREE.MeshStandardMaterial({color:new THREE.Color().setHSL(0.105,0.25,0.36+random()*0.23),roughness:0.96});
    box(2.16+random()*0.035,0.003,2.77+random()*0.035,shade,0.025,0.13+i*0.0072,(random()-0.5)*0.015,0.001);
  }
  const lidParts: THREE.Object3D[] = [];
  const lidStart=group.children.length;
  box(2.35,0.115,2.98,leather,0,0.66,0);
  const spine=mesh(new THREE.CylinderGeometry(0.30,0.30,2.94,48),leather,-1.08,0.36,0);spine.rotation.x=Math.PI/2;spine.scale.x=0.65;
  for(const z of [-1.12,-0.62,0,0.62,1.12]) {const band=mesh(new THREE.TorusGeometry(0.305,0.035,10,48),leather,-1.08,0.36,z);band.scale.x=0.66;}
  const line=(points:THREE.Vector3[],radius=0.012,mat:THREE.Material=tooling)=>mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),64,radius,6,false),mat,0,0,0);
  for(const inset of [0.13,0.20]) {
    const x=1.17-inset,z=1.49-inset;
    line([new THREE.Vector3(-x,0.728,-z),new THREE.Vector3(x,0.728,-z),new THREE.Vector3(x,0.728,z),new THREE.Vector3(-x,0.728,z),new THREE.Vector3(-x,0.728,-z)],0.009);
  }
  for(const sx of [-1,1]) for(const sz of [-1,1]) {
    const shape=new THREE.Shape();shape.moveTo(0,0);shape.lineTo(0.45,0);shape.lineTo(0.43,0.13);shape.quadraticCurveTo(0.18,0.09,0.18,0.30);shape.lineTo(0,0.43);shape.closePath();
    const plate=mesh(new THREE.ExtrudeGeometry(shape,{depth:0.025,bevelEnabled:true,bevelSize:0.01,bevelThickness:0.008,bevelSegments:2,steps:1}),bronze,sx*1.16,0.73,sz*1.48);
    plate.rotation.x=Math.PI/2;plate.scale.set(-sx,sz,1);
    for(const [a,b] of [[0.08,0.08],[0.32,0.06],[0.06,0.31]]) mesh(new THREE.SphereGeometry(0.024,12,8),bronze,sx*(1.16-a),0.768,sz*(1.48-b));
  }
  // Raised, symmetrical curling vines in the leather.
  for(const sx of [-1,1]) for(const sz of [-1,1]) {
    line(Array.from({length:70},(_,i)=>{const t=i/69;return new THREE.Vector3(sx*(0.70+0.15*Math.sin(t*Math.PI*3)),0.748,sz*(0.22+t*0.97));}),0.016);
    for(let j=0;j<4;j++) {const z=0.38+j*0.22;line(Array.from({length:35},(_,i)=>{const t=i/34*Math.PI*1.8,r=0.12*(1-i/42);return new THREE.Vector3(sx*(0.72+Math.sin(t)*r),0.75,sz*(z+Math.cos(t)*r));}),0.011);}
  }
  const shield=new THREE.Shape();shield.moveTo(-0.36,-0.40);shield.lineTo(0.36,-0.40);shield.lineTo(0.34,0.10);shield.quadraticCurveTo(0.28,0.38,0,0.51);shield.quadraticCurveTo(-0.28,0.38,-0.34,0.10);shield.closePath();
  const crest=mesh(new THREE.ExtrudeGeometry(shield,{depth:0.032,bevelEnabled:true,bevelSize:0.018,bevelThickness:0.012,bevelSegments:3}),tooling,0,0.76,0);crest.rotation.x=Math.PI/2;
  for(const sx of [-1,1]) line(Array.from({length:60},(_,i)=>{const t=i/59*Math.PI;return new THREE.Vector3(sx*(0.18+0.34*Math.sin(t)),0.79,-0.53+1.04*i/59);}),0.025);
  for(const x of [-0.18,0,0.18]) box(0.025,0.028,0.50,bronze,x,0.81,0,0.008);
  box(0.60,0.028,0.025,bronze,0,0.81,0,0.008);
  for(const [z,color] of [[0.45,'#8e291c'],[-0.30,'#3e6236']] as const) box(0.17,0.008,0.37,new THREE.MeshStandardMaterial({color,roughness:0.9}),1.07,0.30,z,0.005);
  for(let i=lidStart;i<group.children.length;i++) {const child=group.children[i];if(child.position.y>=0.65)lidParts.push(child);}
  const hinge=new THREE.Group();hinge.position.set(-1.13,0.66,0);group.add(hinge);group.updateMatrixWorld(true);for(const part of lidParts)hinge.attach(part);
  group.userData.hinge=hinge;
  group.userData.pageBlock=group.children.filter(child=>child!==hinge&&child.position.y>0.12&&child.position.y<0.62&&child.position.x>-0.5);
  return group;
}
