const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <title>AETHER: ENFORCER | 8S ENTERTAINMENT</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; font-family: 'Share Tech Mono', monospace; }
        #loading-screen {
            position: fixed; inset: 0; background: radial-gradient(circle, #0a0a1a 0%, #000 100%);
            z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center;
            color: #00ff88; text-align: center;
        }
        .progress-container { width: 400px; height: 10px; background: #111; border: 1px solid #00ff88; margin-top: 20px; position: relative; }
        #progress-bar { height: 100%; background: #00ff88; width: 0%; box-shadow: 0 0 20px #00ff88; transition: width 0.1s; }
        
        #ui { position: absolute; inset: 0; pointer-events: none; color: #00ff88; padding: 20px; }
        .crosshair {
            position: absolute; top: 50%; left: 50%; width: 30px; height: 30px;
            border: 2px solid rgba(0, 255, 136, 0.5); transform: translate(-50%, -50%); border-radius: 50%;
        }
        .weapon-hud { position: absolute; bottom: 0; right: 50px; width: 300px; height: 200px; background: rgba(0,0,0,0.5); border-top-left-radius: 50px; border: 2px solid #00ff88; display: flex; align-items: center; justify-content: center; font-size: 24px; }
        .weapon-model { width: 10px; height: 80px; background: #444; transform: rotate(45deg); box-shadow: 0 0 10px #00ff88; }
        #alert-msg { position: absolute; top: 100px; left: 50%; transform: translateX(-50%); font-size: 32px; color: #ff0044; display: none; text-shadow: 0 0 20px #ff0044; }
    </style>
</head>
<body>

<div id="loading-screen">
    <div style="font-size: 40px; font-weight: 800; text-shadow: 0 0 20px #00ff88;">AETHER SYSTEMS</div>
    <div id="load-label" style="margin-top: 20px;">INITIALIZING GEOMETRY...</div>
    <div class="progress-container"><div id="progress-bar"></div></div>
    <div id="load-pct" style="margin-top: 10px;">0%</div>
</div>

<div id="alert-msg">RIOT DETECTED - DEPLOY LETHAL FORCE</div>

<div id="ui">
    <div style="display: flex; justify-content: space-between;">
        <div style="background: rgba(0,40,20,0.8); padding: 15px; border: 1px solid #00ff88;">
            OFFICER ID: 8S-ENFORCER<br>
            STAMINA: [||||||||||]<br>
            THREAT: <span id="threat-lvl">LOW</span>
        </div>
        <div style="text-align: right;">
            SYSTEM TIME: <span id="clock">12:00:00</span><br>
            FPS: <span id="fps">60</span>
        </div>
    </div>
    
    <div class="crosshair">
        <div style="position: absolute; top: 50%; left: 50%; width: 2px; height: 2px; background: #ff0044; transform: translate(-50%, -50%);"></div>
    </div>

    <div class="weapon-hud">
        <div style="margin-right: 20px;">ENFORCER BATON</div>
        <div class="weapon-model"></div>
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
    
    let entities = [];
    const ENTITY_COUNT = 25;

    init();

    async function init() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020205);
        scene.fog = new THREE.FogExp2(0x020205, 0.03);
        clock = new THREE.Clock();

        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
        camera.position.set(0, 2, 0);

        const amb = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(amb);

        const sun = new THREE.DirectionalLight(0x00ff88, 0.8);
        sun.position.set(10, 50, 10);
        scene.add(sun);

        // --- LATAUSLOGIIKKA ---
        const manager = new THREE.LoadingManager();
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const p = (itemsLoaded / itemsTotal) * 100;
            document.getElementById('progress-bar').style.width = p + '%';
            document.getElementById('load-pct').innerText = Math.round(p) + '%';
        };

        const fbxLoader = new FBXLoader(manager);
        const texLoader = new THREE.TextureLoader(manager);

        const prisonTex = texLoader.load('Prison_Texture.png');

        fbxLoader.load('Prison_Mesh.fbx', (object) => {
            document.getElementById('load-label').innerText = "ASSEMBLING WORLD...";
            object.traverse(child => {
                if(child.isMesh) {
                    child.material.map = prisonTex;
                    child.receiveShadow = true;
                    child.castShadow = true;
                }
            });
            object.scale.set(0.08, 0.08, 0.08);
            scene.add(object);
            
            spawnAI();
            setTimeout(() => {
                document.getElementById('loading-screen').style.opacity = '0';
                setTimeout(() => document.getElementById('loading-screen').style.display = 'none', 500);
            }, 1000);
        }, (xhr) => {
            if (xhr.lengthComputable) {
                const p = (xhr.loaded / xhr.total) * 100;
                document.getElementById('progress-bar').style.width = p + '%';
                document.getElementById('load-pct').innerText = Math.round(p) + '%';
            }
        });

        // Maa
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000),
            new THREE.MeshPhongMaterial({ color: 0x111111 })
        );
        floor.rotation.x = -Math.PI/2;
        scene.add(floor);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        document.body.appendChild(renderer.domElement);

        controls = new PointerLockControls(camera, document.body);
        document.addEventListener('mousedown', () => {
            if(!controls.isLocked) controls.lock();
            else attack();
        });

        setupInput();
        animate();
    }

    function spawnAI() {
        for(let i=0; i < ENTITY_COUNT; i++) {
            const isGuard = i < 5;
            const geo = new THREE.CapsuleGeometry(0.3, 1, 4, 8);
            const mat = new THREE.MeshPhongMaterial({ color: isGuard ? 0x0088ff : 0xff4400 });
            const mesh = new THREE.Mesh(geo, mat);
            
            mesh.position.set((Math.random()-0.5)*80, 1.2, (Math.random()-0.5)*80);
            scene.add(mesh);
            
            entities.push({
                mesh: mesh,
                type: isGuard ? 'GUARD' : 'PRISONER',
                hp: 100,
                target: new THREE.Vector3(),
                state: 'IDLE',
                timer: 0
            });
        }
    }

    function attack() {
        // Pelaajan hyökkäys
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(0,0), camera);
        const hits = raycaster.intersectObjects(entities.map(e => e.mesh));
        
        if(hits.length > 0) {
            const hitObj = hits[0].object;
            const entity = entities.find(e => e.mesh === hitObj);
            if(entity && entity.type === 'PRISONER') {
                entity.hp -= 50;
                entity.mesh.material.color.set(0xffffff);
                setTimeout(() => entity.mesh.material.color.set(0xff4400), 100);
                if(entity.hp <= 0) {
                    entity.mesh.rotation.z = Math.PI/2;
                    entity.state = 'DEAD';
                }
            }
        }
    }

    function setupInput() {
        const onKey = (e, val) => {
            if(e.code === 'KeyW') moveForward = val;
            if(e.code === 'KeyS') moveBackward = val;
            if(e.code === 'KeyA') moveLeft = val;
            if(e.code === 'KeyD') moveRight = val;
        };
        document.addEventListener('keydown', (e) => onKey(e, true));
        document.addEventListener('keyup', (e) => onKey(e, false));
    }

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        if (controls.isLocked) {
            velocity.x -= velocity.x * 10.0 * delta;
            velocity.z -= velocity.z * 10.0 * delta;
            direction.z = Number(moveForward) - Number(moveBackward);
            direction.x = Number(moveRight) - Number(moveLeft);
            direction.normalize();

            if (moveForward || moveBackward) velocity.z -= direction.z * 400.0 * delta;
            if (moveLeft || moveRight) velocity.x -= direction.x * 400.0 * delta;

            controls.moveRight(-velocity.x * delta);
            controls.moveForward(-velocity.z * delta);

            // --- AI LOGIIKKA (TAPELUT) ---
            entities.forEach(e => {
                if(e.state === 'DEAD') return;

                e.timer -= delta;
                if(e.timer <= 0) {
                    // Etsi uusi kohde
                    e.target.set(e.mesh.position.x + (Math.random()-0.5)*20, 1.2, e.mesh.position.z + (Math.random()-0.5)*20);
                    e.timer = 2 + Math.random()*5;
                    
                    // Mahdollisuus aloittaa tappelu muiden vankien kanssa
                    if(e.type === 'PRISONER' && Math.random() > 0.9) {
                        e.state = 'AGGRESSIVE';
                        document.getElementById('alert-msg').style.display = 'block';
                    } else {
                        e.state = 'WALK';
                    }
                }

                e.mesh.lookAt(e.target);
                e.mesh.position.lerp(e.target, 0.02);
            });
        }

        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
        renderer.render(scene, camera);
    }
</script>
</body>
</html>
    `);
});

app.listen(3000, () => console.log('AETHER: ENFORCER RUNNING'));
