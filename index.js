<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETHER-04 | OMNI-EYE CLOUD</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        :root {
            --neon: #00ff88;
            --alert: #ff0044;
            --bg: #010108;
            --panel: rgba(0, 30, 20, 0.95);
        }

        body {
            margin: 0; background: var(--bg); color: var(--neon);
            font-family: 'Share Tech Mono', monospace;
            display: grid; grid-template-columns: 350px 1fr 280px;
            grid-template-rows: 1fr 220px; height: 100vh; overflow: hidden;
        }

        /* --- UI ELEMENTS --- */
        .sidebar {
            background: var(--panel); border-right: 1px solid var(--neon);
            padding: 20px; display: flex; flex-direction: column; gap: 15px;
        }

        #ai-eye {
            width: 200px; height: 200px; margin: 0 auto;
            border: 2px solid var(--neon); border-radius: 50%;
            position: relative; overflow: hidden; background: #000;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
        }

        #video-feed {
            width: 100%; height: 100%; object-fit: cover;
            filter: sepia(100%) saturate(300%) hue-rotate(90deg);
            opacity: 0.6; display: none;
        }

        .eye-scanner {
            position: absolute; width: 100%; height: 2px;
            background: var(--neon); top: 50%; box-shadow: 0 0 15px var(--neon);
            animation: scanMove 3s infinite ease-in-out;
        }

        @keyframes scanMove {
            0%, 100% { top: 10%; }
            50% { top: 90%; }
        }

        .main-view {
            padding: 20px; position: relative;
            background: radial-gradient(circle at center, #051a10 0%, #000 100%);
        }

        .terminal {
            grid-column: 1 / 4; background: #000; border-top: 2px solid var(--neon);
            padding: 15px; display: flex; gap: 20px;
        }

        #log-stream {
            flex: 1; overflow-y: auto; font-size: 13px; color: #008844;
            background: rgba(0, 255, 136, 0.02); padding: 10px;
        }

        .aether-window {
            border: 1px solid var(--neon); background: rgba(0,0,0,0.9);
            padding: 20px; display: none; height: 90%; overflow-y: auto;
        }

        button {
            background: var(--neon); color: #000; border: none;
            padding: 12px; font-family: 'Orbitron'; font-weight: bold;
            cursor: pointer; text-transform: uppercase; width: 100%;
        }

        button:hover { background: #fff; box-shadow: 0 0 20px #fff; }

        .status-box { font-size: 11px; border: 1px solid rgba(0,255,136,0.2); padding: 8px; }
    </style>
</head>
<body>

    <div class="sidebar">
        <h2 style="font-family: 'Orbitron'; font-size: 14px; text-align: center;">AETHER-04 // OMNI-EYE</h2>
        
        <div id="ai-eye">
            <video id="video-feed" autoplay playsinline></video>
            <div class="eye-scanner"></div>
        </div>

        <button onclick="toggleCamera()">AKTIVOI VISIO</button>
        <button onclick="toggleMic()">PUHU APULAISELLE</button>

        <div class="status-box">
            SYSTEM_INTEGRITY: 98%<br>
            NEURAL_MEMORY: <span id="mem-user">Mestari</span><br>
            VISION_STATUS: <span id="cam-status">OFFLINE</span>
        </div>

        <div style="margin-top: auto; font-size: 10px; opacity: 0.5;">
            VERCEL_EDGE_FIX_V4<br>
            NO_DIRNAME_MODE: ACTIVE
        </div>
    </div>

    <div class="main-view">
        <div id="welcome-ui" style="text-align: center; margin-top: 15%;">
            <h1 style="font-size: 5rem; opacity: 0.05; letter-spacing: 20px;">AETHER</h1>
            <p id="hint">Sano "Hae tietoa", "Avaa kamera" tai "Analysoi"</p>
        </div>

        <div id="win-vision" class="aether-window">
            <h3>VISUAL_ANALYSIS_UNIT</h3>
            <div id="vision-stats" style="margin-top: 20px;">Ladataan kuvantunnistusta...</div>
            <div style="width: 100%; height: 200px; border: 1px dashed var(--neon); margin-top: 20px; display: flex; align-items: center; justify-content: center;">
                [ ANALYSOIDAAN KOHTEITA... ]
            </div>
        </div>

        <div id="win-search" class="aether-window">
            <h3>OMNI_SEARCH_ENGINE</h3>
            <div id="search-data">Odottaa hakusanaa...</div>
        </div>
    </div>

    <div style="border-left: 1px solid var(--neon); background: var(--panel); padding: 10px; font-size: 10px;">
        <h4 style="margin: 0; border-bottom: 1px solid var(--neon);">PROCESS_MATRIX</h4>
        <div id="matrix-flow"></div>
    </div>

    <div class="terminal">
        <div id="log-stream">
            > AETHER-04 alustettu Vercel-ympäristöön.<br>
            > Node.js ReferenceError korjattu (Client-side execution).<br>
            > Odotetaan komentoa...
        </div>
        <div style="width: 300px; color: #888; font-size: 12px;">
            HAVAITTU PUHE: <br><span id="speech-text" style="color: var(--neon);">...</span>
        </div>
    </div>

    <script>
        // --- JÄRJESTELMÄN KONFIGURAATIO ---
        const logs = document.getElementById('log-stream');
        const speechText = document.getElementById('speech-text');
        const video = document.getElementById('video-feed');
        
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const synth = window.speechSynthesis;
        let recognition;

        if (Recognition) {
            recognition = new Recognition();
            recognition.lang = 'fi-FI';
            recognition.onresult = (e) => handleAI(e.results[0][0].transcript.toLowerCase());
        }

        function addLog(msg) {
            logs.innerHTML += `<br>> ${msg}`;
            logs.scrollTop = logs.scrollHeight;
        }

        function speak(text) {
            const ut = new SpeechSynthesisUtterance(text);
            ut.lang = 'fi-FI';
            ut.pitch = 0.85;
            synth.speak(ut);
            addLog(`AI: ${text}`);
        }

        // --- VISIO-MODUULI (KAMERA) ---
        async function toggleCamera() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.display = 'block';
                document.getElementById('cam-status').innerText = 'ACTIVE';
                speak("Visio-moduuli aktivoitu. Näen sinut nyt, keksijä.");
                addLog("CAMERA_LINK: ESTABLISHED");
            } catch (err) {
                addLog("ERROR: Kameran käyttö evätty.");
            }
        }

        function toggleMic() {
            if (!recognition) return alert("Selaimesi ei tue puhetta!");
            recognition.start();
            addLog("KUUNNELLAAN...");
        }

        // --- TEKOÄLYN LIIKE ---
        function handleAI(cmd) {
            speechText.innerText = cmd;
            addLog(`USER: ${cmd}`);
            hideWindows();

            if (cmd.includes("kamera") || cmd.includes("visio")) {
                showWindow('win-vision');
                toggleCamera();
            }
            else if (cmd.includes("hae") || cmd.includes("etsi")) {
                showWindow('win-search');
                const q = cmd.replace("hae", "").replace("etsi", "");
                speak("Suoritetaan haku Pelle Pelottoman arkistoista: " + q);
                document.getElementById('search-data').innerHTML = `TULOKSET: <b>${q}</b><br>1. Tietue löydetty.<br>2. Analyysi valmis.`;
            }
            else if (cmd.includes("kuka olen")) {
                const user = localStorage.getItem('aether_user') || "tuntematon keksijä";
                speak("Olet " + user + ". Olet laboratorion omistaja.");
            }
            else if (cmd.includes("muista")) {
                const name = cmd.split("muista").pop();
                localStorage.setItem('aether_user', name);
                speak("Muistiin tallennettu uusi käyttäjäprofili.");
            }
            else {
                speak("Suoritan komennon 15 prosentin älyllä.");
            }
        }

        function hideWindows() {
            document.getElementById('welcome-ui').style.display = 'none';
            document.querySelectorAll('.aether-window').forEach(w => w.style.display = 'none');
        }

        function showWindow(id) {
            document.getElementById(id).style.display = 'block';
        }

        // --- MATRIX DATA FLOW ---
        setInterval(() => {
            const flow = document.getElementById('matrix-flow');
            const d = document.createElement('div');
            d.innerText = `0x${Math.floor(Math.random()*16777215).toString(16).toUpperCase()}`;
            flow.prepend(d);
            if(flow.childNodes.length > 30) flow.removeChild(flow.lastChild);
        }, 300);

    </script>
</body>
</html>
