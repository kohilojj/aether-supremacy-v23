<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <title>AETHER-04 | OMNI-EYE FINAL</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        :root { --neon: #00ff88; --bg: #010108; }
        body { margin: 0; background: var(--bg); color: var(--neon); font-family: 'Share Tech Mono', monospace; height: 100vh; display: flex; flex-direction: column; }
        header { padding: 20px; border-bottom: 1px solid var(--neon); text-align: center; font-family: 'Orbitron'; }
        main { flex: 1; display: grid; grid-template-columns: 300px 1fr; }
        .vision { border-right: 1px solid var(--neon); padding: 20px; }
        #cam { width: 100%; border: 1px solid var(--neon); filter: sepia(1) hue-rotate(100deg); }
        .log { padding: 20px; overflow-y: auto; background: rgba(0,255,136,0.02); }
        .controls { padding: 20px; border-top: 1px solid var(--neon); background: #000; }
        button { background: var(--neon); color: #000; border: none; padding: 15px; width: 100%; font-family: 'Orbitron'; cursor: pointer; }
    </style>
</head>
<body>
    <header>AETHER-04 // OMNI-SYNAPSE v4.1</header>
    <main>
        <div class="vision">
            <video id="cam" autoplay playsinline></video>
            <p style="font-size: 10px;">VISIO_STATUS: <span id="vs">OFFLINE</span></p>
            <button onclick="startApp()">AKTIVOI JÄRJESTELMÄ</button>
        </div>
        <div class="log" id="out">> Odotetaan package.jsonin poistamista...<br>> Kun olet poistanut sen, paina nappia.</div>
    </main>
    <script>
        const out = document.getElementById('out');
        const synth = window.speechSynthesis;
        function log(m) { out.innerHTML += `<br>> ${m}`; out.scrollTop = out.scrollHeight; }

        async function startApp() {
            log("KÄYNNISTETÄÄN PUHDAS YDIN...");
            try {
                const s = await navigator.mediaDevices.getUserMedia({ video: true });
                document.getElementById('cam').srcObject = s;
                document.getElementById('vs').innerText = "ACTIVE";
                log("KAMERA KYTKETTY.");
                const m = new SpeechSynthesisUtterance("Järjestelmä on nyt vakaa. Node.js virheet on eliminoitu.");
                m.lang = 'fi-FI'; synth.speak(m);
            } catch(e) { log("VIRHE: " + e.message); }
        }
    </script>
</body>
</html>
