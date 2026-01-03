<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETHER-03 | OMNI-SYNAPSE VERCEL</title>
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
            display: grid; grid-template-columns: 350px 1fr 250px;
            grid-template-rows: 1fr 200px; height: 100vh; overflow: hidden;
        }

        /* --- UI COMPONENTS --- */
        .sidebar {
            background: var(--panel); border-right: 1px solid var(--neon);
            padding: 20px; display: flex; flex-direction: column; gap: 20px;
        }

        #core-orb {
            width: 200px; height: 200px; margin: 0 auto;
            background: radial-gradient(circle, var(--neon) 0%, transparent 70%);
            border-radius: 50%; box-shadow: 0 0 50px var(--neon);
            position: relative; transition: 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            cursor: pointer;
        }

        .listening #core-orb {
            background: radial-gradient(circle, var(--alert) 0%, transparent 70%);
            box-shadow: 0 0 80px var(--alert); transform: scale(1.1);
        }

        .main-view {
            padding: 20px; position: relative; overflow-y: auto;
            background: radial-gradient(circle at center, #051a10 0%, #000 100%);
        }

        .terminal {
            grid-column: 1 / 4; background: #000; border-top: 2px solid var(--neon);
            padding: 15px; display: flex; gap: 20px;
        }

        #log-stream {
            flex: 1; overflow-y: auto; font-size: 13px; color: #008844;
            padding: 10px; background: rgba(0,255,136,0.02);
        }

        /* --- INTERACTIVE WINDOWS --- */
        .aether-window {
            border: 1px solid var(--neon); background: rgba(0,0,0,0.9);
            padding: 20px; display: none; height: 90%; position: relative;
        }

        .btn-main {
            background: var(--neon); color: #000; border: none;
            padding: 15px; font-family: 'Orbitron'; font-weight: bold;
            cursor: pointer; text-transform: uppercase; width: 100%;
        }

        .btn-main:hover { background: #fff; box-shadow: 0 0 15px #fff; }

        /* DATA ANOMALY ANIMATION */
        .glitch { animation: glitchAnim 0.2s infinite; }
        @keyframes glitchAnim {
            0% { transform: translate(0); }
            20% { transform: translate(-2px, 2px); }
            40% { transform: translate(-2px, -2px); }
            60% { transform: translate(2px, 2px); }
            80% { transform: translate(2px, -2px); }
            100% { transform: translate(0); }
        }
    </style>
</head>
<body id="app-body">

    <div class="sidebar">
        <h2 style="font-family: 'Orbitron'; font-size: 16px; text-align: center;">AETHER // OMNI-SYNAPSE</h2>
        <div id="core-orb" onclick="toggleAI()"></div>
        <div id="status-label" style="text-align: center;">JÄRJESTELMÄ: VALMIUSTILA</div>
        
        <div style="border: 1px solid rgba(0,255,136,0.2); padding: 10px; font-size: 11px;">
            MEMORY_ID: <span id="user-id">TUNNISTAMATON</span><br>
            THREAT_LEVEL: <span id="threat-val">LOW</span><br>
            SYNAPSE_LOAD: 15%
        </div>

        <button class="btn-main" onclick="toggleAI()">AKTIVOI MIKROFONI</button>
    </div>

    <div class="main-view">
        <div id="welcome-msg" style="text-align: center; margin-top: 15%;">
            <h1 style="font-size: 4rem; opacity: 0.1; letter-spacing: 15px;">AETHER</h1>
            <p>Sano "Analysoi koodi" tai "Piirrä keksintö"</p>
        </div>

        <div id="win-search" class="aether-window">
            <h3>AETHER_BROWSER v4.0</h3>
            <div id="search-out" style="margin-top: 20px;">Etsitään keksijän tietokannoista...</div>
        </div>

        <div id="win-code" class="aether-window">
            <h3>NEURAL_CODE_SCANNER</h3>
            <pre id="code-stream" style="font-size: 14px; color: var(--neon);"></pre>
        </div>

        <div id="win-draw" class="aether-window">
            <h3>PELLE_PELOTON_BLUEPRINT</h3>
            <canvas id="blueprint-canvas" width="600" height="400" style="border: 1px solid #111;"></canvas>
        </div>
    </div>

    <div style="background: var(--panel); border-left: 1px solid var(--neon); padding: 10px; font-size: 10px;">
        <h4 style="margin: 0; border-bottom: 1px solid var(--neon);">REAALIAIKAINEN DATA</h4>
        <div id="raw-stream"></div>
    </div>

    <div class="terminal">
        <div id="log-stream">
            > AETHER OS v3.1.0 käynnistetty Vercel-ympäristössä...<br>
            > Muisti alustettu. Kaikki järjestelmät toimivat 15% kapasiteetilla.
        </div>
        <div style="width: 250px; font-size: 12px; color: #888;">
            PUHE: <span id="speech-preview">Odottaa...</span>
        </div>
    </div>

    <script>
        // --- JÄRJESTELMÄN ALUSTUS ---
        const logStream = document.getElementById('log-stream');
        const speechPreview = document.getElementById('speech-preview');
        const appBody = document.getElementById('app-body');
        
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const synth = window.speechSynthesis;
        let recognition;

        if (Recognition) {
            recognition = new Recognition();
            recognition.lang = 'fi-FI';
            recognition.onresult = (e) => handleSpeech(e.results[0][0].transcript.toLowerCase());
            recognition.onend = () => appBody.classList.remove('listening');
        }

        function addLog(msg) {
            logStream.innerHTML += `<br>> ${msg}`;
            logStream.scrollTop = logStream.scrollHeight;
        }

        function speak(text) {
            const ut = new SpeechSynthesisUtterance(text);
            ut.lang = 'fi-FI';
            ut.pitch = 0.8;
            ut.rate = 1.0;
            synth.speak(ut);
            addLog(`AI: ${text}`);
        }

        function toggleAI() {
            if (!recognition) return alert("Selaimesi ei tue puheentunnistusta!");
            recognition.start();
            appBody.classList.add('listening');
            addLog("KUUNNELLAAN SIGNAALIA...");
        }

        // --- KOMENTOJEN KÄSITTELY ---
        function handleSpeech(cmd) {
            speechPreview.innerText = cmd;
            addLog(`USER: ${cmd}`);
            hideWindows();

            if (cmd.includes("analysoi") || cmd.includes("koodi")) {
                showWindow('win-code');
                runCodeScanner();
            } 
            else if (cmd.includes("hae") || cmd.includes("etsi")) {
                showWindow('win-search');
                speak("Suoritetaan maailmanlaajuinen haku Pelle Pelottoman arkistoista.");
                document.getElementById('search-out').innerHTML = `Haetaan: <b>${cmd}</b>...<br>Löydetty 3 anomaliaa sektorilta 7.`;
            }
            else if (cmd.includes("piirrä") || cmd.includes("keksintö")) {
                showWindow('win-draw');
                drawInvention();
            }
            else if (cmd.includes("hälytys")) {
                speak("VAROITUS. JÄRJESTELMÄSSÄ TUNNISTETTU TUNKEUTUJA.");
                appBody.classList.add('glitch');
                setTimeout(() => appBody.classList.remove('glitch'), 3000);
            }
            else {
                speak("Tämä komento vaatii suurempaa älyä kuin 15 prosenttia. Yritetään uudelleen.");
            }
        }

        function hideWindows() {
            document.getElementById('welcome-msg').style.display = 'none';
            document.querySelectorAll('.aether-window').forEach(w => w.style.display = 'none');
        }

        function showWindow(id) {
            document.getElementById(id).style.display = 'block';
        }

        function runCodeScanner() {
            speak("Käynnistetään neuraalinen skannaus.");
            const target = document.getElementById('code-stream');
            const code = "0101_BOOT_SEQUENCE\\nSYNAPSE_LINK: ACTIVE\\nMEMORY_LEAK: NONE\\nALGORITHM_X: STABLE\\nDEFENSE_GRID: 100%";
            target.innerText = "";
            let i = 0;
            let it = setInterval(() => {
                target.innerText += code[i];
                i++;
                if (i >= code.length) clearInterval(it);
            }, 40);
        }

        function drawInvention() {
            speak("Luodaan uusi keksintökaavio.");
            const canvas = document.getElementById('blueprint-canvas');
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0,0,600,400);
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            
            // Piirretään jotain teknistä
            ctx.beginPath();
            ctx.arc(300, 200, 80, 0, Math.PI*2);
            ctx.moveTo(300, 100); ctx.lineTo(300, 300);
            ctx.moveTo(200, 200); ctx.lineTo(400, 200);
            ctx.stroke();
            addLog("KEKSINTÖ: PROTOTYYPPI_Z-4 VALMIS.");
        }

        // --- DATA STREAM ---
        setInterval(() => {
            const stream = document.getElementById('raw-stream');
            const div = document.createElement('div');
            div.innerText = `SYS_${Math.random().toString(36).substr(2,5).toUpperCase()}: ${Math.random().toFixed(4)}`;
            stream.prepend(div);
            if (stream.childNodes.length > 25) stream.removeChild(stream.lastChild);
        }, 400);

    </script>
</body>
</html>
