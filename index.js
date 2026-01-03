const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <title>AETHER: TOTAL CONTROL | PANOPTICON 3.5</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; font-family: 'Share Tech Mono', monospace; }
        #ui {
            position: absolute; inset: 0; pointer-events: none;
            color: #00ff88; padding: 20px; display: flex; flex-direction: column;
        }
        .hud-top { display: flex; justify-content: space-between; font-size: 20px; }
        .crosshair {
            position: absolute; top: 50%; left: 50%; width: 6px; height: 6px;
            border: 1px solid #00ff88; transform: translate(-50%, -50%);
        }
        #alert-overlay {
            position: fixed; inset: 0; background: rgba(255, 0, 0, 0.2);
            display: none; pointer-events: none; animation: flash 1s infinite;
        }
        @keyframes flash { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
        
        .stat-box { background: rgba(0, 20, 10, 0.8); border: 1px solid #00ff88; padding: 10px; margin-bottom: 5px; }
        #loading-screen {
            position: fixed; inset: 0; background: #000; z-index: 9999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
    </style>
</head>
<body>

<div id="loading-screen">
    <h1 style="color: #00ff88; letter-spacing: 5px;">AETHER SYSTEMS LOADING...</h1>
    <div id="status-text" style="color: #00ff88;">MAPPING PRISON_MESH.FBX...</div>
</div>

<div id="alert-overlay"></div>

<div id="ui">
    <div class="hud-top">
        <div class="stat-box">SECTOR: MAIN_BLOCK<br>STATUS: <span id="status-val">NORMAL</span></div>
        <div class="stat-box">BUDGET: $75,000<br>LOCKDOWN: [R] KEY</div>
    </div>
    
    <div class="crosshair"></div>

    <div style="margin-top: auto;">
        <div class="stat-box" style="width: 250px;">
            PRISONERS: <span id="p-count">0</span> (HUNGER: <span id="h-count">0%</span>)<br>
            GUARDS: <span id="g-count">0</span> (ACTIVE)<br>
            THREAT LEVEL: <span id="t-level" style="color: #00ff88;">LOW</span>
        </div>
    </div>
</div>

<script type="importmap">
    {
        "imports": {
            "three": "https://unpkg.com/three@0.160.0/build/three.module.js",
            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/"
        }
    }
</script>

<script type="module">
    import * as THREE from 'three';
    import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
    import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

    let scene, camera, renderer, controls, clock;
    let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
    let velocity = new THREE.Vector3();
    let direction = new THREE.Vector3();
    
    let isLockdown = false;
    let prisoners = [];
    let guards = [];
    let prisonGroup;

    // --- ALUSTUS ---
    init();

    async function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020205);
        scene.fog = new THREE.Fog(0x020205, 1, 150);
        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(10, 1.8, 10);

        // Valot
        const amb = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(amb);

        const mainLight = new THREE.PointLight(0x00ff88, 1, 100);
        mainLight.position.set(0, 20, 0);
        scene.add(mainLight);

        // --- FBX JA TEKSTUURIT ---
        const texLoader = new THREE.TextureLoader();
        const fbxLoader = new FBXLoader();
        
        const prisonTex = texLoader.load('Prison_Texture.png');
        const fenceTex = texLoader.load('Fences_OP_Texture.png');

        fbxLoader.load('Prison_Mesh.fbx', (object) => {
            object.traverse(child => {
                if(child.isMesh) {
                    if(child.name.toLowerCase().includes('fence')) {
                        child.material = new THREE.MeshPhongMaterial({ map: fenceTex, transparent: true, side: THREE.DoubleSide });
                    } else {
                        child.material.map = prisonTex;
                    }
                }
            });
            object.scale.set(0.06, 0.06, 0.06);
            scene.add(object);
            prisonGroup = object;
            
            spawnEntities();
            document.getElementById('loading-screen').style.display = 'none';
        });

        // Lattia
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(500, 500),
            new THREE.MeshPhongMaterial({ color: 0x050505, map: texLoader.load('Terrain_Grass_Dirt.png') })
        );
        floor.rotation.x = -Math.PI/2;
        scene.add(floor);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        document.body.appendChild(renderer.domElement);

        controls = new PointerLockControls(camera, document.body);
        document.addEventListener('click', () => controls.lock());
        
        setupInput();
        animate();
    }

    function spawnEntities() {
        // Luodaan Vangit (Punertavat)
        for(let i=0; i<15; i++) {
            const p = createAgent(0xff5500, "PRISONER");
            p.mesh.position.set((Math.random()-0.5)*60, 1, (Math.random()-0.5)*60);
            prisoners.push(p);
        }
        // Luodaan Vartijat (Siniset)
        for(let i=0; i<6; i++) {
            const g = createAgent(0x0088ff, "GUARD");
            g.mesh.position.set((Math.random()-0.5)*40, 1, (Math.random()-0.5)*40);
            guards.push(g);
        }
        document.getElementById('p-count').innerText = prisoners.length;
        document.getElementById('g-count').innerText = guards.length;
    }

    function createAgent(color, role) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.3, 0.8, 4, 8), new THREE.MeshPhongMaterial({ color }));
        body.position.y = 0.5;
        group.add(body);
        
        if(role === "GUARD") {
            const gun = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.6), new THREE.MeshPhongMaterial({ color: 0x111111 }));
            gun.position.set(0.4, 0.5, 0.3);
            group.add(gun);
        }

        scene.add(group);
        return {
            mesh: group,
            role: role,
            target: new THREE.Vector3(),
            speed: role === "GUARD" ? 0.05 : 0.03,
            timer: 0
        };
    }

    function setupInput() {
        document.addEventListener('keydown', (e) => {
            if(e.code === 'KeyW') moveForward = true;
            if(e.code === 'KeyS') moveBackward = true;
            if(e.code === 'KeyA') moveLeft = true;
            if(e.code === 'KeyD') moveRight = true;
            if(e.code === 'KeyR') toggleLockdown();
        });
        document.addEventListener('keyup', (e) => {
            if(e.code === 'KeyW') moveForward = false;
            if(e.code === 'KeyS') moveBackward = false;
            if(e.code === 'KeyA') moveLeft = false;
            if(e.code === 'KeyD') moveRight = false;
        });
    }

    function toggleLockdown() {
        isLockdown = !isLockdown;
        const overlay = document.getElementById('alert-overlay');
        const status = document.getElementById('status-val');
        const threat = document.getElementById('t-level');
        
        if(isLockdown) {
            overlay.style.display = 'block';
            status.innerText = "LOCKDOWN ACTIVE";
            status.style.color = "#ff0000";
            threat.innerText = "CRITICAL";
            threat.style.color = "#ff0000";
            playSound(440, 'sawtooth');
        } else {
            overlay.style.display = 'none';
            status.innerText = "NORMAL";
            status.style.color = "#00ff88";
            threat.innerText = "LOW";
            threat.style.color = "#00ff88";
        }
    }

    function playSound(freq, type) {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1);
    }

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (controls.isLocked) {
            // Pelaajan fysiikka
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);

            // Tekoäly: Vangit ja Vartijat
            [...prisoners, ...guards].forEach(agent => {
                agent.timer -= delta;
                if(agent.timer <= 0) {
                    // Jos lockdown, vangit juoksevat kenneleihin, vartijat partioivat nopeammin
                    const range = isLockdown ? 5 : 20;
                    agent.target.set(
                        agent.mesh.position.x + (Math.random()-0.5)*range,
                        agent.mesh.position.y,
                        agent.mesh.position.z + (Math.random()-0.5)*range
                    );
                    agent.timer = 3 + Math.random()*5;
                }
                
                // Kääntyminen ja liike
                agent.mesh.lookAt(agent.target);
                agent.mesh.position.lerp(agent.target, agent.speed);

                // Vartijat seuraavat pelaajaa jos tämä juoksee
                if(agent.role === "GUARD" && camera.position.distanceTo(agent.mesh.position) < 8) {
                    agent.mesh.lookAt(camera.position.x, agent.mesh.position.y, camera.position.z);
                }
            });
        }
        renderer.render(scene, camera);
    }
</script>
</body>
</html>
    `);
});

const PORT = 3000;
app.listen(PORT, () => console.log('AETHER: TOTAL CONTROL ACTIVE AT http://localhost:3000'));
