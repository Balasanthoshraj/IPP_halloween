"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { sculptedPumpkin } from '@/ippbook/components/ThreeScene/sculptedObjects';
import { createMahoganyTableTexture } from '@/ippbook/components/ThreeScene/textureHelpers';

/** Static 3D set: no animation loop; redraw only when its container changes size. */
export default function LightweightEnvironment(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const container=host.current;if(!container)return;
  let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'low-power'});}catch{return;}
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.25));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);
  const scene=new THREE.Scene();scene.background=new THREE.Color('#081019');scene.fog=new THREE.Fog('#081019',11,25);
  const camera=new THREE.PerspectiveCamera(39,1024/572,.1,40);camera.position.set(0,4.4,9);camera.lookAt(0,.3,0);
  scene.add(new THREE.HemisphereLight('#adc0cf','#352013',1.65));
  const moon=new THREE.DirectionalLight('#afc4d5',2.3);moon.position.set(-3,7,3);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-6;moon.shadow.camera.right=6;moon.shadow.camera.top=5;moon.shadow.camera.bottom=-5;moon.shadow.normalBias=.025;scene.add(moon);
  const material=new THREE.MeshStandardMaterial({map:createMahoganyTableTexture(),roughness:.86,color:'#b59f88'});
  const table=new THREE.Mesh(new THREE.BoxGeometry(12,.18,7),material);table.position.set(0,-.13,.3);table.receiveShadow=true;scene.add(table);
  const add=(geometry:THREE.BufferGeometry,mat:THREE.Material,x:number,y:number,z:number,parent:THREE.Object3D=scene)=>{const mesh=new THREE.Mesh(geometry,mat);mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;};
  // Shared skin texture and geometry are reused for the two larger pumpkins.
  const rear=sculptedPumpkin(1.17,-.10);rear.position.set(3.02,.80,-1.02);scene.add(rear);
  const medium=sculptedPumpkin(.91,.05);medium.position.set(1.88,.61,-.50);scene.add(medium);
  const small=medium.clone();small.scale.setScalar(.49);small.position.set(2.52,.33,.64);scene.add(small);
  const front=rear.clone();front.scale.setScalar(.94);front.position.set(3.59,.64,1.30);scene.add(front);
  const wax=new THREE.MeshStandardMaterial({color:'#e6c58b',roughness:.68});
  const dark=new THREE.MeshStandardMaterial({color:'#221711',roughness:1});
  const fire=new THREE.MeshBasicMaterial({color:'#fff4bf'});
  const bodyGeometry=new THREE.CylinderGeometry(.105,.13,1,24,4);
  const dripGeometry=new THREE.CapsuleGeometry(.017,.30,3,7);
  const flameGeometry=new THREE.SphereGeometry(.04,12,16);
  const candle=(x:number,z:number,height:number,width=1)=>{
   const group=new THREE.Group();group.position.set(x,0,z);group.scale.set(width,1,width);scene.add(group);
   const body=add(bodyGeometry,wax,0,height/2,0,group);body.scale.y=height;
   const pool=add(new THREE.SphereGeometry(.20,16,8),wax,0,.008,0,group);pool.scale.set(1,.08,.8);
   for(let i=0;i<8;i++){const angle=i*2.4,length=.4+.4*Math.sin(i*3.1+x);const drip=add(dripGeometry,wax,Math.cos(angle)*.11,height-.15*length,Math.sin(angle)*.11,group);drip.scale.y=length;}
   add(new THREE.CylinderGeometry(.007,.007,.05,6),dark,0,height+.015,0,group);
   const flame=add(flameGeometry,fire,0,height+.10,0,group);flame.scale.set(.65,2.7,.65);flame.castShadow=false;
   const light=new THREE.PointLight('#ffc36c',2.1,3,2);light.position.set(x,height+.15,z);scene.add(light);
  };
  candle(-2.6,-.8,1.20);candle(-1.95,-.65,.96);candle(-1.45,-.8,.56);candle(-3.15,.15,.88);candle(-2.35,.12,.55);candle(-2.75,.83,.49);candle(-3.55,1.45,.48,1.45);
  const leafShape=new THREE.Shape();leafShape.moveTo(0,.22);for(let i=0;i<12;i++){const a=i*Math.PI/6,r=i%2?.10:.23;leafShape.lineTo(Math.sin(a)*r,Math.cos(a)*r);}leafShape.closePath();
  const leafGeometry=new THREE.ShapeGeometry(leafShape);const leafMat=new THREE.MeshStandardMaterial({color:'#8e5226',roughness:1,side:THREE.DoubleSide});
  for(const [x,z] of [[-3.9,.7],[-2.0,2.05],[-.8,2.5],[1.3,1.8],[2.4,2.3],[3.7,2.1],[-3.8,-.9]]){const leaf=add(leafGeometry,leafMat,x,-.025,z);leaf.rotation.set(-Math.PI/2,0,x*3);}
  let frame=0;
  const draw=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.render(scene,camera);renderer.shadowMap.autoUpdate=false;});};
  const observer=new ResizeObserver(draw);observer.observe(container);draw();
  return ()=>{observer.disconnect();cancelAnimationFrame(frame);const geometries=new Set<THREE.BufferGeometry>(),materials=new Set<THREE.Material>(),textures=new Set<THREE.Texture>();scene.traverse(object=>{if(object instanceof THREE.Mesh){geometries.add(object.geometry);for(const mat of Array.isArray(object.material)?object.material:[object.material]){materials.add(mat);for(const value of Object.values(mat))if(value instanceof THREE.Texture)textures.add(value);}}});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div ref={host} aria-hidden="true" style={{position:'absolute',inset:0,pointerEvents:'none'}}/>;
}
