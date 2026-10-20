import * as THREE from 'three';

export function sculptedPumpkin(scale:number, rotation:number) {
  const group=new THREE.Group();group.scale.setScalar(scale);group.rotation.y=rotation;
  const polygons=[ [[-.51,.16],[-.18,.12],[-.38,.40]], [[.18,.12],[.51,.16],[.38,.40]], [[0,.10],[-.09,-.06],[.09,-.06]], [[-.52,-.14],[-.30,-.23],[-.21,-.20],[-.21,-.30],[-.07,-.33],[-.07,-.25],[.08,-.25],[.08,-.33],[.24,-.29],[.24,-.21],[.35,-.22],[.52,-.14],[.44,-.39],[.20,-.48],[-.20,-.48],[-.44,-.39]] ];
  const inside=(x:number,y:number,polygon:number[][])=>{let hit=false;for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){const a=polygon[i],b=polygon[j];if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;}return hit;};
  const geometry=new THREE.SphereGeometry(.8,96,64);const p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),angle=Math.atan2(z,x);const rib=1+.085*Math.cos(angle*11);p.setXYZ(i,x*rib*1.10,y*.88,z*rib);}
  const original=geometry.index!;const indices:number[]=[];const boundaries=new Map<string,[number,number,number]>();
  for(let i=0;i<original.count;i+=3){const ids=[original.getX(i),original.getX(i+1),original.getX(i+2)];const x=ids.reduce((v,id)=>v+p.getX(id),0)/3,y=ids.reduce((v,id)=>v+p.getY(id),0)/3,z=ids.reduce((v,id)=>v+p.getZ(id),0)/3;if(z>.36&&polygons.some(poly=>inside(x,y,poly)))continue;indices.push(...ids);for(let e=0;e<3;e++){const a=ids[e],b=ids[(e+1)%3],key=[a,b].sort((a,b)=>a-b).join(':');const old=boundaries.get(key);boundaries.set(key,[a,b,(old?.[2]??0)+1]);}}
  geometry.setIndex(indices);geometry.computeVertexNormals();
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=512;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#99400e';ctx.fillRect(0,0,1024,512);
  let seed=42;for(let i=0;i<12000;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%1024;seed=(seed*1664525+1013904223)>>>0;const y=seed%512;ctx.fillStyle=i%3?'rgba(242,148,45,.13)':'rgba(49,25,8,.19)';ctx.fillRect(x,y,1,2);}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  const skin=new THREE.MeshStandardMaterial({map:texture,bumpMap:texture,bumpScale:.012,roughness:.78,side:THREE.DoubleSide});
  const shell=new THREE.Mesh(geometry,skin);shell.castShadow=shell.receiveShadow=true;group.add(shell);
  const edges:number[]=[];for(const [a,b,count] of Array.from(boundaries.values())){if(count!==1||p.getZ(a)<.35)continue;const va=new THREE.Vector3().fromBufferAttribute(p,a),vb=new THREE.Vector3().fromBufferAttribute(p,b),ia=va.clone().multiplyScalar(.90),ib=vb.clone().multiplyScalar(.90);for(const v of [va,vb,ib,va,ib,ia])edges.push(v.x,v.y,v.z);}
  const rind=new THREE.BufferGeometry();rind.setAttribute('position',new THREE.Float32BufferAttribute(edges,3));rind.computeVertexNormals();group.add(new THREE.Mesh(rind,new THREE.MeshStandardMaterial({color:'#eeb14a',roughness:.85,side:THREE.DoubleSide})));
  const interior=new THREE.Mesh(new THREE.SphereGeometry(.67,48,32),new THREE.MeshStandardMaterial({color:'#e19a2b',emissive:'#ff8b16',emissiveIntensity:2.8,roughness:1}));interior.scale.set(1.1,.88,1);group.add(interior);
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.65,0),new THREE.Vector3(.015,.80,0),new THREE.Vector3(-.04,.97,-.02),new THREE.Vector3(-.10,1.04,-.01)]);
  const stem=new THREE.Mesh(new THREE.TubeGeometry(curve,20,.055,9,false),new THREE.MeshStandardMaterial({color:'#484329',roughness:1}));stem.castShadow=true;group.add(stem);
  return group;
}

export function curvedPage(width:number,depth:number,left:boolean) {
  const geometry=new THREE.PlaneGeometry(width,depth,48,64);geometry.rotateX(-Math.PI/2);const p=geometry.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),t=(x+width/2)/width;const gutter=left?t:1-t;p.setY(i,.055*Math.sin(t*Math.PI)+.10*Math.exp(-gutter*12)+.008*Math.sin(p.getZ(i)*3));}
  geometry.computeVertexNormals();return geometry;
}
