const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <title>AETHER-03 | OMNI-SYNAPSE</title>
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
            display: grid; grid-template-columns: 380px 1fr 300px;
            grid-template-rows: 1fr 220px; height: 100vh; overflow: hidden;
        }

        /* --- VASEN: AI CORE & MUISTI --- */
        .sidebar-left {
            border-right: 1px solid var(--neon); padding: 20px;
            background: var(--panel); display: flex; flex-direction: column;
        }

        #brain-core {
            width: 220px; height: 220px; margin: 0 auto;
            background: radial-gradient(circle, var(--neon) 0%, transparent 75%);
            border-radius: 50%; box-shadow: 0 0 60px var(--neon);
            position: relative; overflow: hidden;
        }

        .neural-line {
            position: absolute; background: white; opacity: 0.2;
            width: 100%; height: 1px; animation: scanLines 2s infinite;
        }
        @keyframes scanLines { from { top: 0; } to { top: 100%; } }

        .memory-box {
            margin-top: 30px; border: 1px solid rgba(0,255,136,0.3);
            padding: 10px; font-size: 12px; height: 150px; overflow-y: auto;
        }

        /* --- KESKI: PÄÄNÄYTTÖ & SELAIN --- */
        .main-display {
            padding: 20px; overflow: hidden; position: relative;
            background: linear-gradient(180deg, #000 0%, #020804 100%);
        }

        .window {
            border: 1px solid var(--neon); background: rgba(0,0,0,0.9);
            width: 100%; height: 100%; display: none; padding: 20px;
            box-sizing: border-box; overflow-y: auto;
        }

        #browser-view iframe {
            width: 100%; height: 90%; border: none; background: white;
        }

        /* --- OIKEA: DATA & ANALYYSI --- */
        .sidebar-right {
            border-left: 1px solid var(--neon); padding: 20px;
            background: var(--panel); font-size: 11px;
        }

        .data-stream { height: 100%; overflow: hidden; color: #008844; }

        /* --- ALA: KOMENTOKESKUS --- */
        .footer-dock {
            grid-column: 1 / 4; border-top: 2px solid var(--neon);
            display: flex; padding: 15px; background: #000; gap: 20px;
        }

        .terminal-output { flex: 1; overflow-y: auto; background: #000502; padding: 10px; border: 1px solid #111; }
        .controls { width: 400px; display: flex; flex-direction: column; gap: 8px; }

        button {
            background: var(--neon); color: #000; border: none; padding: 12px;
            font-family: 'Orbitron'; font-weight: bold; cursor: pointer;
            transition: 0.2s; text-transform: uppercase;
        }
        button:hover { background: #fff; transform: scale(1.02); }

        .active-ring { animation: pulse 1s infinite alternate; }
        @keyframes pulse { from { opacity: 0.5; } to { opacity: 1; } }
    </style>
</head>
<body>

    <div class="sidebar-left">
        <h3 style="font-family: 'Orbitron';">OMNI-SYNAPSE v3.0</h3>
        <div id="brain-core">
            <div class="neural-line"></div>
            <div class="neural-line" style="animation-delay: 1s"></div>
        </div>
        <p id="system-status">STATUS: OPTIMAL</p>
        
        <div class="memory-box" id="memory-display">
            [NEURAL_MEMORY_LOADED]<br>> Ei aiempia lokeja...
        </div>
    </div>

    <div class="main-display">
        <div id="browser-view" class="window">
            <div style="margin-bottom: 10px;">URL: <span id="current-url">https://aether-search.net</span></div>
            <div id="search-content" style="color: white; padding: 20px; border: 1px dashed var(--neon);">
                Odota, haetaan tietoja maailmanverhosta...
            </div>
        </div>

        <div id="code-view" class="window">
            <h3>CODE_SCANNER_V3</h3>
            <pre id="code-dump" style="color: #00ff88;">// Analysoidaan järjestelmän ydintä...</pre>
        </div>

        <div id="invention-view" class="window">
            <h2 style="text-align:center">PELLE PELOTTOMAN PROTOTYYPPI</h2>
            <div id="blueprint-draw" style="width:100%; height:300px; border:1px solid var(--neon); margin-top:20px;"></div>
        </div>
        
        <div id="idle-msg" style="text-align: center; margin-top: 20%;">
            <h1 style="font-size: 4rem; opacity: 0.05;">AETHER</h1>
            <p>Aktivoi mikrofonisignaali aloittaaksesi.</p>
        </div>
    </div>

    <div class="sidebar-right">
        <h4>REAL-TIME DATA STREAM</h4>
        <div class="data-stream" id="stream"></div>
    </div>

    <div class="footer-dock">
        <div class="terminal-output" id="terminal">
            > AETHER-03 OS kytketty...<br>> Kaikki järjestelmät valmiina.
        </div>
        <div class="controls">
            <button id="mic-start">AKTIVOI ÄÄNIKOMENTO</button>
            <div id="speech-log" style="color: #888; font-size: 12px;">Sano: "Hae tietoa vankiloista", "Analysoi koodi" tai "Muista nimeni on..."</div>
        </div>
    </div>

    <script>
        const terminal = document.getElementById('terminal');
        const stream = document.getElementById('stream');
        const memoryDisplay = document.getElementById('memory-display');
        const brain = document.getElementById('brain-core');

        // --- PUHUMINEN JA KUUNTELU ---
        const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new Recognition();
        recognition.lang = 'fi-FI';
        const synth = window.speechSynthesis;

        function speak(text) {
            const ut = new SpeechSynthesisUtterance(text);
            ut.lang = 'fi-FI';
            ut.pitch = 0.85; // Auktoriteettinen mutta ystävällinen
            ut.rate = 1.0;
            synth.speak(ut);
            addLog("AI: " + text);
        }

        function addLog(msg) {
            terminal.innerHTML += "<br>> " + msg;
            terminal.scrollTop = terminal.scrollHeight;
        }

        document.getElementById('mic-start').onclick = () => {
            recognition.start();
            brain.style.boxShadow = "0 0 100px #ff0044";
            addLog("KUUNNELLAAN...");
        };

        recognition.onresult = (e) => {
            const cmd = e.results[0][0].transcript.toLowerCase();
            processOmni(cmd);
        };

        recognition.onend = () => {
            brain.style.boxShadow = "0 0 60px var(--neon)";
        };

        // --- PÄÄPROSESSORI (OMNI-INTELLIGENCE) ---
        function processOmni(cmd) {
            addLog("KÄYTTÄJÄ: " + cmd);
            document.getElementById('idle-msg').style.display = 'none';
            hideAllWindows();

            // 1. MUISTI-TOIMINTO
            if (cmd.includes("muista") || cmd.includes("nimeni on")) {
                const info = cmd.split("on").pop();
                localStorage.setItem('aether_user', info);
                speak("Ymmärretty. Tallennetaan neural-muistiin: " + info);
                updateMemory();
            }
            // 2. HAKU-TOIMINTO
            else if (cmd.includes("hae") || cmd.includes("etsi")) {
                const query = cmd.replace("hae", "").replace("etsi", "");
                openBrowser(query);
            }
            // 3. KOODIN ANALYSOINTI
            else if (cmd.includes("analysoi") || cmd.includes("koodi")) {
                openCodeScanner();
            }
            // 4. KEKSINTÖJEN PIIRTÄMINEN
            else if (cmd.includes("piirrä") || cmd.includes("keksintö")) {
                openInvention();
            }
            // 5. STATUS-KYSELY
            else if (cmd.includes("status") || cmd.includes("vointi")) {
                const user = localStorage.getItem('aether_user') || "Mestari";
                speak("Kaikki järjestelmät toimivat optimaalisesti, " + user + ". Kuusi prosenttia älystäni on omistettu sinulle.");
            }
            else {
                speak("Komento on monimutkainen. Suoritetaan haku verkosta varmuuden vuoksi.");
                openBrowser(cmd);
            }
        }

        function hideAllWindows() {
            document.querySelectorAll('.window').forEach(w => w.style.display = 'none');
        }

        function openBrowser(q) {
            speak("Kytkeydytään satelliittiverkkoon. Haetaan tietoa kohteesta " + q);
            const win = document.getElementById('browser-view');
            win.style.display = 'block';
            document.getElementById('search-content').innerHTML = "<h3>Ladataan hakutuloksia...</h3><p>Hakusana: " + q + "</p><ul><li>Analysoidaan lähteitä...</li><li>Löydetty 142 osumaa SEKTORILTA 9.</li></ul>";
            
            // Simuloidaan "oikeaa" hakua
            setTimeout(() => {
                document.getElementById('search-content').innerHTML += "<div style='background: #002211; padding: 10px;'><b>AETHER_WIKI:</b> " + q + " on tunnistettu keksijän kannalta kriittiseksi tiedoksi.</div>";
            }, 2000);
        }

        function openCodeScanner() {
            speak("Käynnistetään koodin syväanalyysi.");
            const win = document.getElementById('code-view');
            win.style.display = 'block';
            let i = 0;
            const code = "SYSTEM_BOOT_SECTOR\\n{ \\n  void main() {\\n    neural_link.connect();\\n    ai_logic_gate = 0.06;\\n    process.synapse(OMNI);\\n  }\\n}";
            document.getElementById('code-dump').innerText = "";
            const interval = setInterval(() => {
                document.getElementById('code-dump').innerText += code[i];
                i++;
                if(i >= code.length) clearInterval(interval);
            }, 30);
        }

        function openInvention() {
            speak("Luodaan uusi keksintöpiirros laboratoriossa.");
            const win = document.getElementById('invention-view');
            win.style.display = 'block';
            document.getElementById('blueprint-draw').innerHTML = "<div style='width:100%; height:100%; background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,255,136,0.05) 10px, rgba(0,255,136,0.05) 20px); border: 2px solid var(--neon); display: flex; align-items: center; justify-content: center;'>[ HYDRAULINEN_KIIPEILIJÄ_X1 ]</div>";
        }

        function updateMemory() {
            const user = localStorage.getItem('aether_user');
            if(user) memoryDisplay.innerHTML = "[NEURAL_MEMORY_ACTIVE]<br>> Käyttäjä: " + user + "<br>> Tila: Rekisteröity";
        }

        // --- DATA STREAM SIMULAATIO ---
        setInterval(() => {
            const line = document.createElement('div');
            line.innerText = "> " + Math.random().toString(36).substring(7).toUpperCase() + " : " + (Math.random()*100).toFixed(2);
            stream.prepend(line);
            if(stream.childNodes.length > 30) stream.removeChild(stream.lastChild);
        }, 500);

        updateMemory();
    </script>
</body>
</html>
    `);
});

app.listen(3000, () => console.log('AETHER-03 OMNI-SYNAPSE ONLINE'));
