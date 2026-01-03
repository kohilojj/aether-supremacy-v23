const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <title>AETHER: DEBUG MODE</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; font-family: 'Share Tech Mono', monospace; }
        #debug-log { 
            position: absolute; top: 10px; left: 10px; color: #ff0044; 
            font-size: 12px; background: rgba(0,0,0,0.8); padding: 10px; z-index: 10001;
            max-height: 200px; overflow-y: auto; width: 300px; border: 1px solid #ff0044;
        }
        #loading-screen {
            position: fixed; inset: 0; background: #000; z-index: 10000;
            display: flex; flex-direction: column; align-items: center; justify-content: center; color: #00ff88;
        }
        .bar-bg { width: 80%; height: 4px; background: #111; margin-top: 20px; }
        #bar-fill { height: 100%; background: #00ff88; width: 0%; box-shadow: 0 0 15px #00ff88; }
        #start-btn { 
            margin-top: 20px; padding: 15px 40px; background: #00ff88; color: #000; 
            border: none; cursor: pointer; display: none; font-weight: bold;
        }
    </style>
</head>
<body>

<div id="debug-log">SYSTEM LOG:<br></div>

<div id="loading-screen">
    <h1 id="main-status">SYSTEM INITIALIZING...</h1>
    <div id="sub-status">Checking Prison_Mesh.fbx...</div>
    <div class="bar-bg"><div id="bar-fill"></div></div>
    <button id="start-btn" onclick="forceStart()">FORCED START (OVERRIDE)</button>
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

    let scene, camera, renderer, controls;
    let isStarted = false;

    function log(msg) {
        const d = document.getElementById('debug-log');
        d.innerHTML += "> " + msg + "<br>";
        d.scrollTop = d.scrollHeight;
        console.log(msg);
    }

    window.forceStart = function() {
        log("MANUAL OVERRIDE TRIGGERED.");
        document.getElementById('loading-screen').style.display = 'none';
        isStarted = true;
    };

    async function init() {
        log("INITIALIZING THREE.JS ENGINE...");
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.set(20, 10, 20);

        renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1); // Matalampi resoluutio nopeuttaa
        document.body.appendChild(renderer.domElement);

        const amb = new THREE.AmbientLight(0xffffff, 1);
        scene.add(amb);

        log("LOADING ASSETS...");
        const loader = new FBXLoader();
        
        // Timeout-varmistus: Jos ei lataudu 15 sekunnissa, näytä Force Start
        setTimeout(() => {
            document.getElementById('start-btn').style.display = 'block';
            document.getElementById('main-status').innerText = "LOAD DELAYED";
            log("LOAD EXCEEDED 15S - SHUTTING DOWN NON-CRITICAL PROCESSES");
        }, 15000);

        loader.load('Prison_Mesh.fbx', (object) => {
            log("FBX DATA RECEIVED. PARSING GEOMETRY...");
            
            object.traverse(child => {
                if(child.isMesh) {
                    // OPTIMOINTI: Käytetään BasicMaterialia, joka on nopein piirtää
                    child.material = new THREE.MeshBasicMaterial({ 
                        color: 0x555555, 
                        wireframe: false 
                    });
                }
            });

            object.scale.set(0.01, 0.01, 0.01);
            scene.add(object);
            
            log("PRISON_MESH ADDED TO SCENE.");
            document.getElementById('bar-fill').style.width = '100%';
            document.getElementById('main-status').innerText = "READY";
            forceStart();

        }, (xhr) => {
            if (xhr.lengthComputable) {
                const p = (xhr.loaded / xhr.total) * 100;
                document.getElementById('bar-fill').style.width = p + '%';
                document.getElementById('sub-status').innerText = "Downloaded: " + Math.round(p) + "%";
            }
        }, (err) => {
            log("ERROR LOADING FBX: " + err.message);
        });

        // Lisätään varalattia siltä varalta että malli on rikki
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(500,500), new THREE.MeshBasicMaterial({color: 0x111111}));
        floor.rotation.x = -Math.PI/2;
        scene.add(floor);

        controls = new PointerLockControls(camera, document.body);
        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        if(isStarted) {
            renderer.render(scene, camera);
        }
    }

    init();
</script>
</body>
</html>
    `);
});

app.listen(3000, () => console.log('DEBUG SERVER RUNNING'));
