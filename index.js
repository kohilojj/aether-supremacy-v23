const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETHER: KINGMAKER PROTOCOL | 8S ENTERTAINMENT</title>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;700&family=Oxanium:wght@400;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        /* --- KOKONAISUUDEN TYYLITTELY --- */
        :root {
            --bg-dark: #020205;
            --ui-accent: #00e6ff;
            --ui-danger: #ff0055;
            --ui-success: #00ff88;
            --ui-gold: #ffcc00;
            --panel-bg: rgba(5, 5, 20, 0.9);
            --border-glow: rgba(0, 230, 255, 0.4);
            --text-light: #e0e6ed;
            --crt-line: rgba(18, 16, 16, 0.1);
        }

        * { box-sizing: border-box; user-select: none; }

        body {
            margin: 0; padding: 0; height: 100vh;
            background-color: var(--bg-dark);
            color: var(--text-light);
            font-family: 'Chakra Petch', sans-serif;
            overflow: hidden;
            display: grid;
            grid-template-columns: 350px 1fr 350px;
            grid-template-rows: 80px 1fr 240px;
            gap: 4px;
        }

        /* CRT SCANLINE EFFECT */
        body::before {
            content: " "; display: block; position: absolute; top: 0; left: 0; bottom: 0; right: 0;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            z-index: 5000; background-size: 100% 4px, 3px 100%; pointer-events: none;
        }

        .panel {
            background-color: var(--panel-bg);
            border: 1px solid var(--border-glow);
            position: relative;
            backdrop-filter: blur(12px);
            display: flex; flex-direction: column; overflow: hidden;
        }

        /* HEADER */
        header {
            grid-column: 1 / 4;
            display: flex; justify-content: space-between; align-items: center;
            padding: 0 40px;
            border-bottom: 3px solid var(--ui-accent);
            background: linear-gradient(180deg, #000 0%, #050510 100%);
            z-index: 10;
        }

        .studio-logo {
            font-family: 'Oxanium'; font-size: 32px; font-weight: 800;
            color: var(--ui-accent); text-shadow: 0 0 15px var(--ui-accent);
        }

        /* ASSET LIST & SIDEBARS */
        .sidebar { overflow-y: auto; scrollbar-width: none; }
        .sidebar-title {
            padding: 15px; font-size: 14px; font-weight: 700;
            background: rgba(0, 230, 255, 0.1);
            color: var(--ui-gold); text-transform: uppercase;
            border-bottom: 1px solid var(--border-glow);
        }

        .asset-item {
            padding: 20px 15px; border-bottom: 1px solid rgba(255,255,255,0.05);
            cursor: pointer; transition: 0.3s; display: flex; justify-content: space-between;
        }
        .asset-item:hover { background: rgba(0, 230, 255, 0.1); }
        .asset-item.active { border-left: 5px solid var(--ui-accent); background: rgba(0, 230, 255, 0.2); }

        /* HACKING OVERLAY */
        #hacking-modal {
            position: fixed; inset: 0; background: rgba(0,0,0,0.95);
            z-index: 10000; display: none; flex-direction: column;
            align-items: center; justify-content: center;
            font-family: 'Share Tech Mono', monospace;
        }

        .terminal-text { color: var(--ui-success); margin-bottom: 20px; }

        /* MAIN CHART */
        .chart-container { position: relative; flex-grow: 1; display: flex; flex-direction: column; }
        .chart-header { padding: 25px; display: flex; justify-content: space-between; align-items: center; }
        .current-price { font-family: 'Oxanium'; font-size: 72px; font-weight: 800; color: var(--ui-accent); }

        /* FOOTER */
        footer {
            grid-column: 1 / 4; display: grid; grid-template-columns: repeat(4, 1fr);
            gap: 20px; padding: 25px; border-top: 2px solid var(--ui-accent);
            background: #000;
        }

        .stat-box {
            background: rgba(255,255,255,0.03); border: 1px solid rgba(0,230,255,0.2);
            padding: 15px; border-radius: 4px;
        }

        .btn {
            height: 100%; width: 100%; font-family: 'Oxanium'; font-weight: 800;
            font-size: 18px; border: none; cursor: pointer; transition: 0.2s;
            clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
        }
        .btn-buy { background: var(--ui-success); color: #000; }
        .btn-sell { background: var(--ui-danger); color: #fff; }
        .btn-hack { background: var(--ui-gold); color: #000; }
        .btn:hover { filter: brightness(1.2); transform: scale(1.02); }

        /* ANIMATIONS */
        @keyframes pulse { 0% { opacity: 0.4; } 100% { opacity: 1; } }
        .pulse { animation: pulse 1s infinite alternate; }

    </style>
</head>
<body onload="initSystem()">

<div id="hacking-modal">
    <h1 class="terminal-text">> BREACHING CORE_SERVER...</h1>
    <div id="hack-display" style="font-size: 24px; color: var(--ui-success); background: #000; padding: 40px; border: 1px solid var(--ui-success);">
        [ CLICK THE CORRECT SEQUENCE ]
    </div>
    <div id="hack-controls" style="margin-top: 20px; display: flex; gap: 10px;"></div>
</div>

<header>
    <div class="studio-logo">AETHER // 8S</div>
    <div id="system-status" style="font-family: 'Share Tech Mono'; color: var(--ui-success);">
        NODE: HELSINKI-09 | STATUS: SECURE | <span id="clock">00:00:00</span>
    </div>
    <div style="text-align: right;">
        <div style="font-size: 11px; color: #888;">GLOBAL REPUTATION</div>
        <div id="rep-level" style="color: var(--ui-gold); font-weight: 700;">NEUTRAL CITIZEN</div>
    </div>
</header>

<div class="panel sidebar">
    <div class="sidebar-title">Market Nodes</div>
    <div id="asset-list"></div>
</div>

<div class="panel chart-container">
    <div class="chart-header">
        <div>
            <h2 id="active-name" style="margin:0; font-size: 28px;">---</h2>
            <p id="active-desc" style="margin:5px 0; color: #888; font-size: 14px;">---</p>
        </div>
        <div style="text-align: right;">
            <div id="active-price" class="current-price">0.00</div>
            <div id="active-change" style="font-size: 20px;">+0.00%</div>
        </div>
    </div>
    <canvas id="mainChart"></canvas>
</div>

<div class="panel sidebar">
    <div class="sidebar-title">Live Intelligence Feed</div>
    <div id="news-feed" style="padding: 15px; font-size: 13px; font-family: 'Share Tech Mono';"></div>
</div>

<footer>
    <div class="stat-box">
        <div style="font-size: 11px; color: #888;">LIQUID ASSETS</div>
        <div id="balance" style="font-size: 28px; color: var(--ui-gold); font-family: 'Oxanium'; font-weight: 800;">$0</div>
    </div>
    <div class="stat-box">
        <div style="font-size: 11px; color: #888;">NET WORTH</div>
        <div id="net-worth" style="font-size: 28px; color: var(--ui-success); font-family: 'Oxanium'; font-weight: 800;">$0</div>
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <button class="btn btn-buy" onclick="handleTrade('BUY')">ACQUIRE</button>
        <button class="btn btn-sell" onclick="handleTrade('SELL')">LIQUIDATE</button>
    </div>
    <div>
        <button class="btn btn-hack" onclick="startHacking()">INITIALIZE BREACH</button>
    </div>
</footer>

<script>
    // --- PELIN DATARAKENNE ---
    const CONFIG = {
        TICK_RATE: 1000,
        SAVE_KEY: 'AETHER_V4_FINAL',
        INITIAL_CASH: 50000,
        MAX_NEWS: 25
    };

    let world = {
        assets: [
            { id: 'ION', name: 'ION PROPULSION', price: 150, hist: Array(60).fill(150), vola: 5, desc: "Deep space engine manufacturer." },
            { id: 'NEU', name: 'NEURO-SYNC', price: 850, hist: Array(60).fill(850), vola: 12, desc: "Direct neural interface protocols." },
            { id: 'VOID', name: 'VOID MINING', price: 4200, hist: Array(60).fill(4200), vola: 25, desc: "Asteroid belt resource extraction." },
            { id: 'GHOST', name: 'GHOST DATA', price: 65, hist: Array(60).fill(65), vola: 40, desc: "Encrypted offshore cloud storage." }
        ],
        player: {
            cash: CONFIG.INITIAL_CASH,
            holdings: {},
            rep: 50,
            hackSkill: 1
        },
        activeAsset: 'ION'
    };

    // --- MOOTTORI ---
    function initSystem() {
        loadProgress();
        setupChart();
        setInterval(engineTick, CONFIG.TICK_RATE);
        updateUI();
        addLog("SYSTEM INITIALIZED. WELCOME TO AETHER.", "ui-accent");
    }

    function engineTick() {
        // Päivitä kurssit
        world.assets.forEach(a => {
            let change = (Math.random() - 0.5) * a.vola;
            // Markkinamanipulaatio-vaikutus
            a.price = Math.max(1, a.price + change);
            a.hist.shift();
            a.hist.push(a.price);
        });

        // Satunnaiset tapahtumat
        if(Math.random() > 0.96) triggerEvent();

        updateUI();
        renderChart();
    }

    // --- UI JA GRAFIIKKA ---
    function updateUI() {
        const asset = world.assets.find(a => a.id === world.activeAsset);
        
        // Header & Stats
        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
        document.getElementById('balance').innerText = "$" + Math.floor(world.player.cash).toLocaleString();
        
        let net = world.player.cash;
        world.assets.forEach(a => net += (world.player.holdings[a.id] || 0) * a.price);
        document.getElementById('net-worth').innerText = "$" + Math.floor(net).toLocaleString();

        // Active Asset
        document.getElementById('active-name').innerText = asset.name;
        document.getElementById('active-desc').innerText = asset.desc;
        document.getElementById('active-price').innerText = asset.price.toFixed(2);
        
        const change = ((asset.price - asset.hist[0]) / asset.hist[0] * 100).toFixed(2);
        const changeEl = document.getElementById('active-change');
        changeEl.innerText = (change >= 0 ? "+" : "") + change + "%";
        changeEl.style.color = change >= 0 ? "var(--ui-success)" : "var(--ui-danger)";

        // List
        const list = document.getElementById('asset-list');
        list.innerHTML = world.assets.map(a => \`
            <div class="asset-item \${a.id === world.activeAsset ? 'active' : ''}" onclick="world.activeAsset='\${a.id}'">
                <div>
                    <strong>\${a.id}</strong><br>
                    <small style="color:#666">\${(world.player.holdings[a.id] || 0).toFixed(1)} UNITS</small>
                </div>
                <div style="text-align:right">
                    <span style="color:var(--ui-accent)">\${a.price.toFixed(2)}</span>
                </div>
            </div>
        \`).join('');
    }

    function setupChart() {
        const canvas = document.getElementById('mainChart');
        const ctx = canvas.getContext('2d');
        const resize = () => {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight - 150;
        };
        window.onresize = resize;
        resize();
    }

    function renderChart() {
        const canvas = document.getElementById('mainChart');
        const ctx = canvas.getContext('2d');
        const asset = world.assets.find(a => a.id === world.activeAsset);
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        
        const min = Math.min(...asset.hist) * 0.98;
        const max = Math.max(...asset.hist) * 1.02;
        const range = max - min;

        // Piirrä viiva
        ctx.beginPath();
        ctx.strokeStyle = '#00e6ff';
        ctx.lineWidth = 3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00e6ff';

        asset.hist.forEach((p, i) => {
            const x = (i / (asset.hist.length-1)) * canvas.width;
            const y = canvas.height - ((p - min) / range * canvas.height);
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Täyttö
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        const grad = ctx.createLinearGradient(0,0,0, canvas.height);
        grad.addColorStop(0, 'rgba(0, 230, 255, 0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fill();
    }

    // --- PELILOGIIKKA ---
    function handleTrade(type) {
        const asset = world.assets.find(a => a.id === world.activeAsset);
        if(type === 'BUY' && world.player.cash >= asset.price) {
            const amt = Math.floor(world.player.cash / asset.price);
            world.player.holdings[asset.id] = (world.player.holdings[asset.id] || 0) + amt;
            world.player.cash -= amt * asset.price;
            addLog(\`ACQUIRED \${amt} UNITS OF \${asset.id}\`, "ui-success");
        } else if(type === 'SELL' && (world.player.holdings[asset.id] || 0) > 0) {
            const amt = world.player.holdings[asset.id];
            world.player.cash += amt * asset.price;
            world.player.holdings[asset.id] = 0;
            addLog(\`LIQUIDATED \${amt.toFixed(2)} UNITS OF \${asset.id}\`, "ui-danger");
        }
        saveProgress();
    }

    function triggerEvent() {
        const events = [
            { t: "MARKET CRASH", m: "Global system failure!", effect: 0.7, color: "var(--ui-danger)" },
            { t: "TECH BOOM", m: "New AI singularity reached!", effect: 1.3, color: "var(--ui-success)" },
            { t: "CYBER ATTACK", m: "Data nodes compromised!", effect: 0.8, color: "var(--ui-gold)" }
        ];
        const e = events[Math.floor(Math.random() * events.length)];
        world.assets.forEach(a => a.price *= e.effect);
        addLog(\`\${e.t}: \${e.m}\`, e.color);
    }

    function addLog(msg, color) {
        const feed = document.getElementById('news-feed');
        const div = document.createElement('div');
        div.style.color = color;
        div.style.marginBottom = "5px";
        div.innerHTML = \`[\${new Date().toLocaleTimeString()}] > \${msg}\`;
        feed.prepend(div);
        if(feed.children.length > CONFIG.MAX_NEWS) feed.lastChild.remove();
    }

    // --- HAKKERI-MINIPELI ---
    let hackSequence = [];
    function startHacking() {
        const modal = document.getElementById('hacking-modal');
        const controls = document.getElementById('hack-controls');
        modal.style.display = 'flex';
        controls.innerHTML = '';
        
        hackSequence = Array.from({length: 4}, () => Math.floor(Math.random() * 9));
        document.getElementById('hack-display').innerText = "SEQUENCE REQUIRED: " + hackSequence.join(" - ");

        for(let i=0; i<10; i++) {
            const b = document.createElement('button');
            b.innerText = i;
            b.className = 'btn';
            b.style.padding = '10px 20px';
            b.onclick = () => checkHack(i);
            controls.appendChild(b);
        }
    }

    let currentInput = [];
    function checkHack(val) {
        currentInput.push(val);
        if(currentInput[currentInput.length-1] !== hackSequence[currentInput.length-1]) {
            addLog("BREACH FAILED: SECURITY COUNTERMEASURES ACTIVE", "var(--ui-danger)");
            closeHack();
            return;
        }

        if(currentInput.length === hackSequence.length) {
            const asset = world.assets.find(a => a.id === world.activeAsset);
            asset.price *= 1.5; // Manipuloi hintaa ylöspäin!
            addLog("BREACH SUCCESSFUL: MARKET DATA MANIPULATED", "var(--ui-success)");
            closeHack();
        }
    }

    function closeHack() {
        document.getElementById('hacking-modal').style.display = 'none';
        currentInput = [];
    }

    // --- TALLENNUS ---
    function saveProgress() {
        localStorage.setItem(CONFIG.SAVE_KEY, JSON.stringify(world));
    }

    function loadProgress() {
        const data = localStorage.getItem(CONFIG.SAVE_KEY);
        if(data) world = JSON.parse(data);
    }

</script>
</body>
</html>
    `);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SERVER RUNNING AT http://localhost:${PORT}`);
});
