<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETHER-03 | VERCEL CLOUD</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        :root {
            --neon: #00ff88;
            --alert: #ff0044;
            --bg: #010105;
            --panel: rgba(0, 30, 20, 0.95);
        }

        body {
            margin: 0; background: var(--bg); color: var(--neon);
            font-family: 'Share Tech Mono', monospace;
            display: grid; grid-template-columns: 380px 1fr;
            grid-template-rows: 1fr 220px; height: 100vh; overflow: hidden;
        }

        /* --- VASEN PANEELI: NEURAALIVERKKO --- */
        .sidebar-left {
            border-right: 1px solid var(--neon); padding: 20px;
            background: var(--panel); display: flex; flex-direction: column;
        }

        #brain-core {
            width: 220px; height: 220px; margin: 0 auto;
            background: radial-gradient(circle, var(--neon) 0%, transparent 75%);
            border-radius: 50%; box-shadow: 0 0 60px var(--neon);
            position: relative; overflow: hidden; cursor: pointer;
        }

        .neural-line {
            position: absolute; background: white; opacity: 0.2;
            width: 100%; height: 1px; animation: scanLines 2s infinite;
        }
        @keyframes scanLines { from { top: 0; } to { top: 100%; } }

        .memory-box {
            margin-top: 30px; border: 1px solid rgba(0,255,136,0.3);
            padding: 10px; font-size: 12px; height: 150px; overflow-y: auto; background: rgba(0,0,0,0.5);
        }

        /* --- PÄÄNÄYTTÖ --- */
        .main-display {
            padding: 20px; overflow: hidden; position: relative;
            background: linear-gradient(180deg, #000 0%, #020804 100%);
        }

        .window {
            border: 1px solid var(--neon); background: rgba(0,0,0,0.9);
            width: 100%; height: 100%; display: none; padding: 20px;
            box-sizing: border-box; overflow-y: auto;
        }

        /* --- ALAPANEELI --- */
        .footer-dock {
            grid-column: 1 / 3; border-top: 2px solid var(--neon);
            display: flex; padding: 15px; background: #000; gap: 20px;
        }

        .terminal-output { flex: 1; overflow-y: auto; background: #000502; padding: 10px; border: 1px solid #111; }
        
        button {
            background: var(--neon); color: #000; border: none; padding: 15px 30px;
            font-family: 'Orbitron'; font-weight: bold; cursor: pointer;
            transition: 0.2s; text-transform: uppercase; width: 300px;
        }
        button:hover { background: #fff; box-shadow: 0 0 20px #fff; }

        /* SECURITY SCANNER */
        #scanner-overlay {
            position: absolute; inset: 0; border: 2px solid var(--alert);
            background: rgba(255, 0, 0, 0.05); display: none; pointer-events: none;
            z-index: 1000;
        }
    </style>
</head>
<body>

    <div id="scanner-overlay"></div>

    <div class="sidebar-left">
        <h3 style="font-family: 'Orbitron';">AETHER CLOUD // v3.1</h3>
        <div id="brain-core" onclick="startRecognition()">
            <div class="neural-line"></div>
            <div class="neural-line" style="animation-delay: 1s"></div>
        </div>
        <p id="system-status" style="text-align: center; margin-top: 10px;">SYSTEM: STANDBY</p>
        
        <div class="memory-box" id="memory-display">
            [CLOUD_STORAGE_ACTIVE]<br>> Odottaa yhteyttä...
        </div>
        <div style="margin-top: auto; font-size: 10px; opacity: 0.4;">
            VERCEL_DEPLOYMENT: SUCCESS<br>
            SECURITY_LEVEL: OMNI
        </div>
    </div>

    <div class="main-display">
        <div id="idle-view" style="text-align: center; margin-top: 15%;">
            <h1 style="font-size: 5rem; opacity: 0.1; letter-spacing: 20px;">AETHER</h1>
            <p id="hint-text">AKTIVOI MIKROFONI JA SANO KOMENTO</p>
        </div>

        <div id="browser-win" class="window">
            <h3>AETHER_SEARCH_ENGINE</h3>
            <div id="search-results" style="border-top: 1px solid var(--neon); padding-top: 15px;"></div>
        </div>

        <div id="code-win" class="window">
            <h3>SECURITY_CODE_SCANNER</h3>
            <pre id="code-output" style="color: var(--neon); font-size: 14px;"></pre>
        </div>
    </div>

    <div class="footer-dock">
        <div class="terminal-output" id="terminal">
            > AETHER Cloud Interface käynnistetty...<br>
            > Vercel Serverless ympäristö tunnistettu.<br>
            > Valmiina Pelle Pelottoman apulaiseksi.
        </div>
        <button id="mic-trigger" onclick="startRecognition()">AKTIVOI ÄÄNI</button>
    </div>

    <script>
        const terminal = document.getElementById('terminal');
        const memoryDisp = document.getElementById('memory-display');
        const brain = document.getElementById('brain-core');
        const codeOutput = document.getElementById('code-output');

        // MUISTI (LocalStorage toimii Vercelissä täydellisesti)
        let userName = localStorage.getItem('aether_user') || "Mestari";

        // PUHEENTUNNISTUS
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const synth = window.speechSynthesis;

        let recognition;
        if (Recognition) {
            recognition = new Recognition();
            recognition.lang = 'fi-FI';
            recognition.continuous = false;
        }

        function addLog(msg) {
            terminal.innerHTML += "<br>> " + msg;
            terminal.scrollTop = terminal.scrollHeight;
        }

        function speak(text) {
            const ut = new SpeechSynthesisUtterance(text);
            ut.lang = 'fi-FI';
            ut.pitch = 0.8;
            ut.rate = 1.0;
            synth.speak(ut);
            addLog("AI: " + text);
        }

        function startRecognition() {
            if (!recognition) return alert("Selaimesi ei tue puhetta!");
            recognition.start();
            brain.style.boxShadow = "0 0 100px #ff0044";
            document.getElementById('system-status').innerText = "SYSTEM: LISTENING";
        }

        if (recognition) {
            recognition.onresult = (e) => {
                const cmd = e.results[0][0].transcript.toLowerCase();
                processAether(cmd);
            };

            recognition.onend = () => {
                brain.style.boxShadow = "0 0 60px var(--neon)";
                document.getElementById('system-status').innerText = "SYSTEM: STANDBY";
            };
        }

        function processAether(cmd) {
            addLog("USER: " + cmd);
            hideWindows();

            if (cmd.includes("nimeni on")) {
                userName = cmd.split("on").pop();
                localStorage.setItem('aether_user', userName);
                speak("Muisti päivitetty. Tervehdys " + userName);
                updateMemory();
            }
            else if (cmd.includes("hae") || cmd.includes("etsi")) {
                showWindow('browser-win');
                const q = cmd.replace("hae", "").replace("etsi", "");
                speak("Haetaan pilvipalvelusta tietoa kohteesta " + q);
                document.getElementById('search-results').innerHTML = "Haetaan reaaliaikaista dataa...<br>Analysoidaan Vercel-verkkoa...<br>Löytyi osuma sektoriin: " + q;
            }
            else if (cmd.includes("analysoi") || cmd.includes("koodi")) {
                showWindow('code-win');
                runSecurityScan();
            }
            else if (cmd.includes("hälytys") || cmd.includes("lukitus")) {
                triggerLockdown();
            }
            else {
                speak("Käsittelen pyyntöä kuuden prosentin kapasiteetilla.");
            }
        }

        function showWindow(id) {
            document.getElementById('idle-view').style.display = 'none';
            document.getElementById(id).style.display = 'block';
        }

        function hideWindows() {
            document.querySelectorAll('.window').forEach(w => w.style.display = 'none');
        }

        function runSecurityScan() {
            speak("Käynnistetään turvaskannaus.");
            let code = "SCANNING VERCEL_EDG_NETWORK...\\nIP_PROTECTION: ACTIVE\\nFIREWALL: OMNI_SYNAPSE_V3\\nENCRYPTION: 1024-BIT\\nSTATUS: SAFE";
            codeOutput.innerText = "";
            let i = 0;
            let timer = setInterval(() => {
                codeOutput.innerText += code[i];
                i++;
                if (i >= code.length) clearInterval(timer);
            }, 50);
        }

        function triggerLockdown() {
            speak("AKTIVOIDAAN TURVALUKITUS. JÄRJESTELMÄ VAARASSA.");
            document.getElementById('scanner-overlay').style.display = 'block';
            setTimeout(() => {
                document.getElementById('scanner-overlay').style.display = 'none';
                speak("Väärä hälytys. Järjestelmä on vakaa.");
            }, 5000);
        }

        function updateMemory() {
            memoryDisp.innerHTML = "[MEMORY_LOADED]<br>> User: " + userName + "<br>> Status: Online";
        }

        updateMemory();
    </script>
</body>
</html>
