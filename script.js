import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0.2, 0.1, 10);

const renderer = new THREE.WebGLRenderer({canvas, antialias:true, alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const rig = new THREE.Group();
scene.add(rig);

// Original Launchpad sculpture built from primitives.
// If you later provide a licensed .glb/.gltf model, this whole group can be replaced with it.
const matte = new THREE.MeshStandardMaterial({color:0xc4c0b8, roughness:.66, metalness:.06});
const dark = new THREE.MeshStandardMaterial({color:0x161616, roughness:.42, metalness:.2});
const trim = new THREE.MeshStandardMaterial({color:0x7e827f, roughness:.48, metalness:.25});
const skin = new THREE.MeshStandardMaterial({color:0xb9836d, roughness:.7, metalness:0});
const cloth = new THREE.MeshStandardMaterial({color:0xb7b0ad, roughness:.95, metalness:0});
const screenMat = new THREE.MeshPhysicalMaterial({
  color:0x111518, roughness:.2, metalness:.1,
  clearcoat:1, clearcoatRoughness:.16, emissive:0x080a0f, emissiveIntensity:1.6
});

// Torso / turtleneck
const torso = new THREE.Mesh(new THREE.SphereGeometry(2.0, 64, 32, 0, Math.PI*2, 0, Math.PI*.53), cloth);
torso.scale.set(1.15,.85,.58);
torso.position.set(1.6,-2.5,.15);
torso.rotation.z = Math.PI;
torso.castShadow = true;
rig.add(torso);

const neck = new THREE.Mesh(new THREE.CylinderGeometry(.52,.66,1.35,48), cloth);
neck.position.set(1.6,-1.0,.1);
neck.castShadow = true;
rig.add(neck);

const faceGap = new THREE.Mesh(new THREE.CylinderGeometry(.40,.48,.34,40), skin);
faceGap.position.set(1.6,-.25,.08);
rig.add(faceGap);

// CRT head
const monitor = new THREE.Group();
monitor.position.set(1.55,.72,0);
monitor.rotation.y = -.08;
monitor.rotation.z = -.018;

const shell = new THREE.Mesh(new THREE.BoxGeometry(2.75,2.55,1.25,6,6,3), matte);
shell.geometry.translate(0,0,.08);
shell.castShadow = true;
monitor.add(shell);

const rear = new THREE.Mesh(new THREE.BoxGeometry(2.32,2.08,.9,4,4,2), trim);
rear.position.z = -.65;
monitor.add(rear);

const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.38,1.93,.18), dark);
bezel.position.z = .69;
monitor.add(bezel);

const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.08,1.63), screenMat);
screen.position.set(0,.08,.795);
monitor.add(screen);

// screen graphics
const screenCanvas = document.createElement('canvas');
screenCanvas.width = 1024; screenCanvas.height = 768;
const sctx = screenCanvas.getContext('2d');
function drawScreen(t=0){
  const w=screenCanvas.width,h=screenCanvas.height;
  const g=sctx.createLinearGradient(0,0,w,h);
  g.addColorStop(0,'#1f2937'); g.addColorStop(.45,'#111827'); g.addColorStop(1,'#050505');
  sctx.fillStyle=g; sctx.fillRect(0,0,w,h);
  sctx.fillStyle='rgba(255,255,255,.09)';
  for(let y=0;y<h;y+=6) sctx.fillRect(0,y,w,1);
  sctx.font='24px monospace'; sctx.fillStyle='rgba(196,176,255,.85)';
  const lines=['LAUNCHPAD_STUDIOS','// PROJECT: BAAAD_TRIP','status = "building worlds";','games(); films();'];
  lines.forEach((line,i)=>sctx.fillText(line,60,70+i*36));
  const y=320+Math.sin(t*.001)*16;
  sctx.fillStyle='rgba(255,255,255,.92)';
  sctx.fillRect(90,y,840,8);
  sctx.fillStyle='rgba(130,150,255,.34)';
  sctx.fillRect(120,y+26,690,40);
  sctx.fillStyle='rgba(255,255,255,.12)';
  sctx.fillRect(60,610,650,50);
}
drawScreen();
const screenTex = new THREE.CanvasTexture(screenCanvas);
screenTex.colorSpace = THREE.SRGBColorSpace;
screen.material.map = screenTex;

// buttons / LED
for(let i=0;i<5;i++){
  const b = new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.035,20), dark);
  b.rotation.x=Math.PI/2;
  b.position.set(.45+i*.23,-.94,.78);
  monitor.add(b);
}
const ledMat = new THREE.MeshStandardMaterial({color:0x7aa6ff, emissive:0x5c83ff, emissiveIntensity:5});
const led = new THREE.Mesh(new THREE.SphereGeometry(.055,20,10),ledMat);
led.position.set(.16,-.94,.79);
monitor.add(led);

// side knob
const knob = new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.23,32),dark);
knob.rotation.z=Math.PI/2;
knob.position.set(1.49,-.06,.16);
monitor.add(knob);

rig.add(monitor);

// cables
function cable(points){
  const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const geo = new THREE.TubeGeometry(curve,64,.025,8,false);
  const mesh = new THREE.Mesh(geo,dark);
  rig.add(mesh);
}
cable([[2.9,.8,-.2],[3.7,.6,-.1],[3.55,-.2,.4],[3.2,-.7,.35],[3.1,-1.15,.2]]);
cable([[.15,.25,.0],[-.4,-.15,.2],[.2,-.8,.35],[.55,-1.8,.2],[.9,-2.1,.15]]);
cable([[2.7,1.55,-.35],[3.25,1.5,-.5],[3.55,1.15,-.4],[3.35,.7,-.2]]);

// lighting
const hemi = new THREE.HemisphereLight(0xffffff,0x4c5566,2.1);
scene.add(hemi);

const key = new THREE.DirectionalLight(0xffffff,4.0);
key.position.set(-4,6,6);
key.castShadow = true;
scene.add(key);

const rim = new THREE.DirectionalLight(0x83a9ff,2.2);
rim.position.set(6,3,-3);
scene.add(rim);

const warm = new THREE.PointLight(0xffb6a0,1.3,12);
warm.position.set(0,-1,4);
scene.add(warm);

let pointer = {x:0,y:0};
let target = {x:0,y:0};
let motionOff = false;

addEventListener('pointermove', e=>{
  pointer.x=(e.clientX/innerWidth)*2-1;
  pointer.y=(e.clientY/innerHeight)*2-1;
  target.x=pointer.x; target.y=pointer.y;
});

function layoutModel(){
  if(innerWidth < 850){
    rig.position.set(.35,.85,0);
    rig.scale.setScalar(.78);
  }else{
    rig.position.set(.85,.1,0);
    rig.scale.setScalar(1.04);
  }
}
layoutModel();

let last = 0;
function animate(t){
  requestAnimationFrame(animate);
  if(!motionOff){
    rig.rotation.y += ((target.x*.12)-rig.rotation.y)*.035;
    rig.rotation.x += ((target.y*.035)-rig.rotation.x)*.035;
    monitor.position.y = .72 + Math.sin(t*.0007)*.035;
  }
  if(t-last>120){
    drawScreen(t); screenTex.needsUpdate=true; last=t;
  }
  renderer.render(scene,camera);
}
requestAnimationFrame(animate);

addEventListener('resize',()=>{
  camera.aspect=innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);
  layoutModel();
});

// UI
document.querySelector('#year').textContent=new Date().getFullYear();

const loader=document.querySelector('#loader');
setTimeout(()=>loader.classList.add('done'),1100);

const backdrop=document.querySelector('#panelBackdrop');
const panels={
  games:document.querySelector('#gamesPanel'),
  films:document.querySelector('#filmsPanel'),
  'game-detail':document.querySelector('#gameDetailPanel')
};

function closePanels(){
  Object.values(panels).forEach(p=>{p.classList.remove('open');p.setAttribute('aria-hidden','true')});
  backdrop.classList.remove('visible');
  setTimeout(()=>{backdrop.hidden=true},350);
  document.body.style.overflow='';
}
function openPanel(name){
  closePanels();
  const p=panels[name]; if(!p)return;
  backdrop.hidden=false;
  requestAnimationFrame(()=>backdrop.classList.add('visible'));
  p.classList.add('open');p.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
document.querySelectorAll('[data-open]').forEach(el=>el.addEventListener('click',()=>openPanel(el.dataset.open)));
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closePanels));
backdrop.addEventListener('click',closePanels);
addEventListener('keydown',e=>{if(e.key==='Escape')closePanels()});

document.querySelectorAll('[data-scroll]').forEach(el=>el.addEventListener('click',()=>{
  document.querySelector(el.dataset.scroll)?.scrollIntoView({behavior:'smooth'});
}));

const motionToggle=document.querySelector('#motionToggle');
motionToggle.addEventListener('click',()=>{
  motionOff=!motionOff;
  motionToggle.setAttribute('aria-pressed', String(motionOff));
  motionToggle.querySelector('.sound-label').textContent=motionOff?'still':'motion';
});

// subtle magnetic hover
document.querySelectorAll('.magnetic').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    const r=el.getBoundingClientRect();
    const x=(e.clientX-(r.left+r.width/2))*.12;
    const y=(e.clientY-(r.top+r.height/2))*.12;
    el.style.transform=`translate(${x}px,${y}px)`;
  });
  el.addEventListener('pointerleave',()=>el.style.transform='');
});
