import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(29, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0.15, 10.5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const rig = new THREE.Group();
scene.add(rig);

const shellMat = new THREE.MeshPhysicalMaterial({ color: 0xa9aaa6, roughness: 0.34, metalness: 0.18, clearcoat: 0.55, clearcoatRoughness: 0.3 });
const shellEdgeMat = new THREE.MeshStandardMaterial({ color: 0x777a78, roughness: 0.45, metalness: 0.35 });
const darkMat = new THREE.MeshStandardMaterial({ color: 0x111314, roughness: 0.35, metalness: 0.3 });
const cableMat = new THREE.MeshStandardMaterial({ color: 0x090a0a, roughness: 0.5, metalness: 0.2 });
const skinMat = new THREE.MeshStandardMaterial({ color: 0xa97865, roughness: 0.72, metalness: 0 });
const clothMat = new THREE.MeshStandardMaterial({ color: 0xa8a6a3, roughness: 0.92, metalness: 0 });

// Original procedural character: a studio-built CRT avatar made only from primitives.
const torso = new THREE.Mesh(new THREE.SphereGeometry(2.45, 72, 40), clothMat);
torso.scale.set(1.18, 0.76, 0.58);
torso.position.set(0, -3.0, -0.02);
torso.castShadow = true;
torso.receiveShadow = true;
rig.add(torso);

const shoulderLeft = new THREE.Mesh(new THREE.SphereGeometry(1.25, 40, 24), clothMat);
shoulderLeft.scale.set(1.4, 0.56, 0.62);
shoulderLeft.position.set(-1.78, -3.06, -0.05);
shoulderLeft.rotation.z = -0.12;
shoulderLeft.castShadow = true;
rig.add(shoulderLeft);

const shoulderRight = shoulderLeft.clone();
shoulderRight.position.x = 1.78;
shoulderRight.rotation.z = 0.12;
rig.add(shoulderRight);

const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.88, 1.75, 64, 1, true), clothMat);
collar.position.set(0, -1.56, 0);
collar.castShadow = true;
rig.add(collar);

const collarRing = new THREE.Mesh(new THREE.TorusGeometry(0.69, 0.07, 16, 64), clothMat);
collarRing.rotation.x = Math.PI / 2;
collarRing.position.set(0, -0.7, 0);
rig.add(collarRing);

const faceGap = new THREE.Mesh(new THREE.CylinderGeometry(0.43, 0.52, 0.45, 48), skinMat);
faceGap.position.set(0, -0.55, 0.03);
faceGap.castShadow = true;
rig.add(faceGap);

const monitor = new THREE.Group();
monitor.position.set(0, 0.78, 0);
monitor.rotation.x = -0.018;
monitor.rotation.z = -0.012;
rig.add(monitor);

const rear = new THREE.Mesh(new THREE.BoxGeometry(2.65, 2.25, 1.16, 5, 5, 3), shellEdgeMat);
rear.position.z = -0.52;
rear.scale.set(0.93, 0.93, 1);
rear.castShadow = true;
monitor.add(rear);

const shell = new THREE.Mesh(new THREE.BoxGeometry(3.15, 2.82, 1.32, 8, 8, 4), shellMat);
shell.castShadow = true;
shell.receiveShadow = true;
monitor.add(shell);

const upperLip = new THREE.Mesh(new THREE.BoxGeometry(2.82, 0.13, 0.16), shellEdgeMat);
upperLip.position.set(0, 1.17, 0.7);
monitor.add(upperLip);

const bezel = new THREE.Mesh(new THREE.BoxGeometry(2.74, 2.29, 0.2), darkMat);
bezel.position.z = 0.72;
monitor.add(bezel);

const screenCanvas = document.createElement('canvas');
screenCanvas.width = 1024;
screenCanvas.height = 768;
const sctx = screenCanvas.getContext('2d');
const screenTexture = new THREE.CanvasTexture(screenCanvas);
screenTexture.colorSpace = THREE.SRGBColorSpace;
screenTexture.minFilter = THREE.LinearFilter;

const screenMaterial = new THREE.MeshPhysicalMaterial({ color: 0x050607, map: screenTexture, emissiveMap: screenTexture, emissive: 0x8da4ff, emissiveIntensity: 1.45, roughness: 0.18, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08 });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.43, 1.91, 24, 18), screenMaterial);
screen.position.set(0, 0.08, 0.835);
monitor.add(screen);

const glass = new THREE.Mesh(new THREE.PlaneGeometry(2.48, 1.96), new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.055, roughness: 0.04, transmission: 0.2 }));
glass.position.set(0, 0.08, 0.85);
monitor.add(glass);

for (let i = 0; i < 6; i++) {
  const button = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.045, 20), darkMat);
  button.rotation.x = Math.PI / 2;
  button.position.set(0.45 + i * 0.2, -1.19, 0.76);
  monitor.add(button);
}

const ledMaterial = new THREE.MeshStandardMaterial({ color: 0xb8d4ff, emissive: 0x5b86ff, emissiveIntensity: 5 });
const led = new THREE.Mesh(new THREE.SphereGeometry(0.052, 20, 12), ledMaterial);
led.position.set(0.1, -1.19, 0.78);
monitor.add(led);

const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.24, 32), darkMat);
knob.rotation.z = Math.PI / 2;
knob.position.set(1.68, -0.08, 0.17);
monitor.add(knob);

for (let y = 0; y < 5; y++) {
  for (let x = 0; x < 3; x++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.018, 0.34), darkMat);
    vent.position.set(-1.59, 0.62 - y * 0.2, -0.22 + x * 0.2);
    monitor.add(vent);
  }
}

function addCable(points, radius = 0.026) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
  const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 80, radius, 9, false), cableMat);
  mesh.castShadow = true;
  rig.add(mesh);
}

addCable([[1.42, 1.45, -0.3], [2.12, 1.15, -0.15], [2.26, 0.38, 0.22], [1.92, -0.3, 0.34], [1.62, -0.92, 0.17]], 0.031);
addCable([[-1.46, 1.22, -0.24], [-2.12, 0.8, -0.1], [-2.02, 0.05, 0.33], [-1.46, -0.62, 0.25], [-1.18, -1.5, 0.08]], 0.026);
addCable([[1.24, 0.14, -0.62], [1.75, -0.32, -0.42], [1.55, -1.1, 0.2], [1.9, -1.68, 0.03]], 0.021);
addCable([[-0.95, 0.28, -0.62], [-1.38, -0.14, -0.5], [-0.92, -0.9, 0.18], [-1.22, -1.8, 0.02]], 0.019);

const floor = new THREE.Mesh(new THREE.PlaneGeometry(18, 12), new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.16 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -3.76;
floor.receiveShadow = true;
scene.add(floor);

scene.add(new THREE.HemisphereLight(0xffffff, 0x555a62, 2.25));
const key = new THREE.DirectionalLight(0xffffff, 4.5);
key.position.set(-4.8, 6.8, 7.5);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
scene.add(key);
const rim = new THREE.DirectionalLight(0x91a7ff, 2.4);
rim.position.set(6, 3.4, -4);
scene.add(rim);
const warm = new THREE.PointLight(0xffb29d, 1.5, 13);
warm.position.set(-2.2, -1.4, 4.6);
scene.add(warm);

let screenMode = 0;
let screenPulse = 0;
const modes = [
  { label: 'BAAAD_TRIP', sub: 'GET THE FLOCK HOME', accent: '#c7d2ff' },
  { label: 'LAUNCHPAD_OS', sub: 'BUILDING STRANGE WORLDS', accent: '#b9ffdc' },
  { label: 'SIGNAL_02', sub: 'FILMS / TRANSMISSION PENDING', accent: '#ffd0bf' }
];

function drawScreen(time = 0) {
  const width = screenCanvas.width;
  const height = screenCanvas.height;
  const mode = modes[screenMode];
  const pulse = (Math.sin(time * 0.003) + 1) * 0.5;
  const gradient = sctx.createRadialGradient(width * 0.5, height * 0.46, 20, width * 0.5, height * 0.5, width * 0.72);
  gradient.addColorStop(0, '#151a23');
  gradient.addColorStop(0.48, '#080b10');
  gradient.addColorStop(1, '#020303');
  sctx.fillStyle = gradient;
  sctx.fillRect(0, 0, width, height);
  sctx.globalAlpha = 0.11;
  sctx.fillStyle = '#ffffff';
  for (let y = 0; y < height; y += 6) sctx.fillRect(0, y, width, 1);
  sctx.globalAlpha = 1;
  sctx.strokeStyle = mode.accent;
  sctx.globalAlpha = 0.4 + pulse * 0.2;
  sctx.lineWidth = 2;
  sctx.strokeRect(54, 46, width - 108, height - 92);
  sctx.globalAlpha = 1;
  sctx.fillStyle = mode.accent;
  sctx.font = '500 24px monospace';
  sctx.fillText('LAUNCHPAD_STUDIOS // 2026', 80, 88);
  sctx.textAlign = 'right';
  sctx.fillText(`0${screenMode + 1} / 03`, width - 80, 88);
  sctx.textAlign = 'left';
  sctx.font = '600 78px Arial, sans-serif';
  sctx.fillText(mode.label, 78, 355);
  sctx.font = '24px monospace';
  sctx.fillStyle = 'rgba(255,255,255,.82)';
  sctx.fillText(mode.sub, 82, 405);
  const waveY = 520;
  sctx.beginPath();
  sctx.strokeStyle = mode.accent;
  sctx.lineWidth = 4;
  for (let x = 78; x < width - 78; x += 4) {
    const y = waveY + Math.sin(x * 0.035 + time * 0.005) * (12 + pulse * 15) * Math.sin(x * 0.008);
    if (x === 78) sctx.moveTo(x, y); else sctx.lineTo(x, y);
  }
  sctx.stroke();
  sctx.fillStyle = 'rgba(255,255,255,.52)';
  sctx.font = '18px monospace';
  sctx.fillText('MOVE / CLICK / EXPLORE', 82, height - 76);
  const glitchSeed = Math.floor(time / 150) % 17;
  if (glitchSeed === 4 || screenPulse > 0) {
    sctx.globalAlpha = 0.2 + Math.min(screenPulse, 1) * 0.45;
    for (let i = 0; i < 5; i++) {
      sctx.fillStyle = i % 2 ? '#ffffff' : mode.accent;
      sctx.fillRect(40 + i * 38, 170 + i * 58, width - 120 - i * 42, 8 + i * 3);
    }
    sctx.globalAlpha = 1;
  }
  screenPulse *= 0.88;
}

drawScreen();

let pointer = { x: 0, y: 0 };
let target = { x: 0, y: 0 };
let motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;
const cursorAura = document.querySelector('#cursorAura');

addEventListener('pointermove', (event) => {
  pointer.x = (event.clientX / innerWidth) * 2 - 1;
  pointer.y = (event.clientY / innerHeight) * 2 - 1;
  target.x = pointer.x;
  target.y = pointer.y;
  if (cursorAura) {
    cursorAura.style.left = `${event.clientX}px`;
    cursorAura.style.top = `${event.clientY}px`;
  }
});

function layoutModel() {
  if (innerWidth < 560) {
    rig.position.set(0, 1.08, 0);
    rig.scale.setScalar(0.68);
  } else if (innerWidth < 900) {
    rig.position.set(0, 0.72, 0);
    rig.scale.setScalar(0.82);
  } else {
    rig.position.set(0, 0.42, 0);
    rig.scale.setScalar(1.08);
  }
}
layoutModel();

let lastScreenDraw = 0;
function animate(time) {
  requestAnimationFrame(animate);
  if (!motionOff) {
    rig.rotation.y += ((target.x * 0.19) - rig.rotation.y) * 0.035;
    rig.rotation.x += ((target.y * 0.045) - rig.rotation.x) * 0.035;
    monitor.position.y = 0.78 + Math.sin(time * 0.0007) * 0.035;
    monitor.rotation.z = -0.012 + Math.sin(time * 0.00037) * 0.008;
  }
  screenMaterial.emissiveIntensity = 1.35 + Math.sin(time * 0.0035) * 0.12;
  ledMaterial.emissiveIntensity = 4.5 + Math.sin(time * 0.006) * 1.2;
  if (time - lastScreenDraw > 75) {
    drawScreen(time);
    screenTexture.needsUpdate = true;
    lastScreenDraw = time;
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  layoutModel();
});

// Original browser-synthesized ambience and interface sounds; no sampled audio files.
let audioContext;
let masterGain;
let soundOn = false;
let ambientNodes = [];

function initAudio() {
  if (audioContext) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  audioContext = new AudioContext();
  masterGain = audioContext.createGain();
  masterGain.gain.value = 0.0001;
  masterGain.connect(audioContext.destination);
  const droneFilter = audioContext.createBiquadFilter();
  droneFilter.type = 'lowpass';
  droneFilter.frequency.value = 480;
  droneFilter.Q.value = 1.3;
  droneFilter.connect(masterGain);
  [48, 72.5, 97].forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = index === 0 ? 'sine' : 'triangle';
    oscillator.frequency.value = frequency;
    gain.gain.value = [0.12, 0.045, 0.02][index];
    oscillator.connect(gain).connect(droneFilter);
    oscillator.start();
    ambientNodes.push(oscillator, gain);
  });
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  lfo.frequency.value = 0.09;
  lfoGain.gain.value = 80;
  lfo.connect(lfoGain).connect(droneFilter.frequency);
  lfo.start();
  ambientNodes.push(lfo, lfoGain, droneFilter);
  const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 2, audioContext.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
  const noise = audioContext.createBufferSource();
  const noiseFilter = audioContext.createBiquadFilter();
  const noiseGain = audioContext.createGain();
  noise.buffer = buffer;
  noise.loop = true;
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1150;
  noiseFilter.Q.value = 0.7;
  noiseGain.gain.value = 0.025;
  noise.connect(noiseFilter).connect(noiseGain).connect(masterGain);
  noise.start();
  ambientNodes.push(noise, noiseFilter, noiseGain);
}

function setSound(enabled) {
  initAudio();
  if (!audioContext || !masterGain) return;
  soundOn = enabled;
  if (audioContext.state === 'suspended') audioContext.resume();
  const now = audioContext.currentTime;
  masterGain.gain.cancelScheduledValues(now);
  masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), now);
  masterGain.gain.exponentialRampToValueAtTime(enabled ? 0.12 : 0.0001, now + 0.5);
}

function playTone(kind = 'hover') {
  if (!soundOn || !audioContext || !masterGain) return;
  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = kind === 'open' ? 1600 : 1100;
  oscillator.type = kind === 'open' ? 'triangle' : 'sine';
  oscillator.frequency.setValueAtTime(kind === 'open' ? 140 : 420, now);
  oscillator.frequency.exponentialRampToValueAtTime(kind === 'open' ? 54 : 270, now + (kind === 'open' ? 0.42 : 0.1));
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(kind === 'open' ? 0.07 : 0.022, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === 'open' ? 0.48 : 0.12));
  oscillator.connect(filter).connect(gain).connect(masterGain);
  oscillator.start(now);
  oscillator.stop(now + 0.55);
}

function changeSignal() {
  screenMode = (screenMode + 1) % modes.length;
  screenPulse = 1;
  playTone('open');
}

canvas.addEventListener('click', changeSignal);
canvas.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    changeSignal();
  }
});

document.querySelector('#year').textContent = new Date().getFullYear();
const loader = document.querySelector('#loader');
const loaderCount = document.querySelector('#loaderCount');
const loadStarted = performance.now();
function tickLoader(now) {
  const progress = Math.min(100, Math.round(((now - loadStarted) / 1450) * 100));
  if (loaderCount) loaderCount.textContent = String(progress).padStart(3, '0');
  if (progress < 100) requestAnimationFrame(tickLoader);
  else setTimeout(() => loader?.classList.add('done'), 120);
}
requestAnimationFrame(tickLoader);

const backdrop = document.querySelector('#panelBackdrop');
const panels = { games: document.querySelector('#gamesPanel'), films: document.querySelector('#filmsPanel'), 'game-detail': document.querySelector('#gameDetailPanel') };
let backdropTimer;
let lastTrigger;

function closePanels(returnFocus = true) {
  Object.values(panels).forEach((panel) => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
  });
  backdrop.classList.remove('visible');
  clearTimeout(backdropTimer);
  backdropTimer = setTimeout(() => { backdrop.hidden = true; }, 360);
  document.body.style.overflow = '';
  if (returnFocus && lastTrigger) lastTrigger.focus({ preventScroll: true });
}

function openPanel(name, trigger) {
  const panel = panels[name];
  if (!panel) return;
  closePanels(false);
  lastTrigger = trigger || document.activeElement;
  clearTimeout(backdropTimer);
  backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.add('visible'));
  panel.classList.add('open');
  panel.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  panel.querySelector('[data-close]')?.focus({ preventScroll: true });
  playTone('open');
}

document.querySelectorAll('[data-open]').forEach((element) => element.addEventListener('click', () => openPanel(element.dataset.open, element)));
document.querySelectorAll('[data-close]').forEach((element) => element.addEventListener('click', () => closePanels()));
backdrop.addEventListener('click', () => closePanels());
addEventListener('keydown', (event) => { if (event.key === 'Escape') closePanels(); });
document.querySelectorAll('[data-scroll]').forEach((element) => element.addEventListener('click', () => { document.querySelector(element.dataset.scroll)?.scrollIntoView({ behavior: motionOff ? 'auto' : 'smooth' }); }));

const soundToggle = document.querySelector('#soundToggle');
soundToggle.addEventListener('click', () => {
  setSound(!soundOn);
  soundToggle.setAttribute('aria-pressed', String(soundOn));
  soundToggle.querySelector('.control-label').textContent = soundOn ? 'Sound on' : 'Sound off';
  if (soundOn) playTone('open');
});

const motionToggle = document.querySelector('#motionToggle');
motionToggle.setAttribute('aria-pressed', String(motionOff));
motionToggle.querySelector('.control-label').textContent = motionOff ? 'Still' : 'Motion';
motionToggle.addEventListener('click', () => {
  motionOff = !motionOff;
  motionToggle.setAttribute('aria-pressed', String(motionOff));
  motionToggle.querySelector('.control-label').textContent = motionOff ? 'Still' : 'Motion';
  playTone('hover');
});

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    const bounds = element.getBoundingClientRect();
    const x = (event.clientX - (bounds.left + bounds.width / 2)) * 0.11;
    const y = (event.clientY - (bounds.top + bounds.height / 2)) * 0.11;
    element.style.transform = `translate(${x}px,${y}px)`;
  });
  element.addEventListener('pointerenter', () => playTone('hover'));
  element.addEventListener('pointerleave', () => { element.style.transform = ''; });
});

if (matchMedia('(pointer: coarse)').matches) cursorAura?.remove();
