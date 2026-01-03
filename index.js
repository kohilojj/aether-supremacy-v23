const express = require('express');
const app = express();

app.get('/', (req, res) => {
    // Käytetään template literalia (backticks), joten varmistetaan että se sulkeutuu koodin lopussa.
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETHER: KINGMAKER PROTOCOL | 8S ENTERTAINMENT</title>
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;700&family=Oxanium:wght@400;700;800&family=Share+Tech+Mono&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-dark: #00000a;
            --ui-accent: #00e6ff;
            --ui-danger: #ff3366;
            --ui-success: #33ff88;
            --ui-gold: #ffcc00;
            --panel-bg: rgba(10, 10, 25, 0.95);
            --border-glow: rgba(0, 230, 255, 0.3);
            --text-light: #e0e6ed;
        }

        * { box-sizing: border-box; user-select: none; }

        body {
            margin: 0; padding: 0; height: 100vh;
            background-color: var(--bg-dark);
            color: var(--text-light);
            font-family: 'Chakra Petch', sans-serif;
            overflow: hidden;
            display: grid;
            grid-template-columns: 320px 1fr 320px;
            grid-template-rows: 70px 1fr 220px;
            gap: 2px;
        }

        /* UI ELEMENTS */
        .panel {
            background-color: var(--panel-bg);
            border: 1px solid rgba(0, 230, 255, 0.1);
            position: relative;
            backdrop-filter: blur(8px);
            display: flex; flex-direction: column; overflow: hidden;
        }

        header {
            grid-column: 1 / 4; display: flex; justify-content: space-between;
            align-items: center; padding: 0 30px; border-bottom: 2px solid var(--ui-accent);
            background-color: rgba(0,0,0,0.8);
        }

        .studio-logo { font-family: 'Oxanium'; font-size: 28px; font-weight: 800; color: var(--ui-accent); text-shadow: 0 0 15px var(--ui-accent); }

        .sidebar-title { padding: 15px; font-size: 14px; font-weight: 700; border-bottom: 1px solid var(--border-glow); color: var(--ui-gold); text-transform: uppercase; }

        .asset-item { padding: 12px 15px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; display: flex; justify-content: space-between; }
        .asset-item.active { border-left: 4px solid var(--ui-accent); background-color: rgba(0, 230, 255, 0.15); }

        .current-price { font-family: 'Oxanium'; font-size: 60px; font-weight: 800; color: var(--ui-accent); }

        footer {
            grid-column: 1 / 4; display: grid; grid-template-columns: 2fr 1.5fr 1.5fr 2fr;
            gap: 20px; padding: 20px; background-color: rgba(0,0,0,0.8); border-top: 2px solid var(--ui-accent);
        }

        .footer-card { background: rgba(20, 20, 40, 0.8); border: 1px solid rgba(0, 230, 255, 0.2); padding: 15px; border-radius: 5px; }

        .action-button { 
            padding: 15px; border: none; border-radius: 5px; font-family: 'Oxanium'; font-weight: 700; cursor: pointer; text-transform: uppercase; 
        }
        .buy { background: var(--ui-success); color: #000; }
        .sell { background: var(--ui-danger); color: #fff; }

        #notification-area { position: fixed; top: 90px; right: 20px; z-index: 1000; width: 300px; }
        .toast { background: var(--panel-bg); border: 1px solid var(--ui-accent); padding: 12px; margin-bottom: 10px; animation: slide 0.4s ease-out; }
        @keyframes slide { from { transform: translateX(120%); } to { transform: translateX(0); } }

        #boot-overlay { position: fixed; inset: 0; background: #000; z-index: 2000; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    </style>
</head>
<body onload="bootSequence()">

<div id="boot-overlay" onclick="startGame()">
    <div class="studio-logo">8S ENTERTAINMENT</div>
    <div style="color: var(--ui-accent); font-size: 20px; margin-top: 20px;">[ CLICK TO INITIALIZE AETHER ]</div>
</div>

<div id="notification-area"></div>

<header>
    <div class="studio-logo">8S</div>
    <div style="font-family: 'Share Tech Mono'; color: var(--ui-success);">NODE_ONLINE: KINGMAKER_PROTOCOL</div>
    <div id="clock-display" style="color: var(--ui-accent); font-family: 'Oxanium';">00:00:00</div>
</header>

<div class="panel">
    <div class="sidebar-title">MARKET ASSETS</div>
    <div id="asset-list-ui"></div>
</div>

<div class="panel" style="display: flex; flex-direction: column;">
    <div style="padding: 20px; display: flex; justify-content: space-between; align-items: flex-end;">
        <div>
            <div id="active-asset-name" style="font-size: 24px; font-weight: 700;">---</div>
            <div id="active-asset-ticker" style="color: #888;">---</div>
        </div>
        <div style="text-align: right;">
            <div id="main-asset-price" class="current-price">0.00</div>
            <div id="price-change-pct" style="font-size: 18px;">+0.00%</div>
        </div>
    </div>
    <canvas id="main-chart-canvas" style="flex-grow: 1;"></canvas>
</div>

<div class="panel">
    <div class="sidebar-title">INTELLIGENCE FEED</div>
    <div id="news-feed-display" style="padding: 15px; font-family: 'Share Tech Mono'; font-size: 12px; overflow-y: auto;"></div>
</div>

<footer>
    <div class="footer-card">
        <div style="font-size: 11px; color: #888;">LIQUID CAPITAL</div>
        <div id="player-balance" style="font-size: 24px; color: var(--ui-gold); font-weight: 700;">$ 0</div>
    </div>
    <div class="footer-card">
        <div style="font-size: 11px; color: #888;">TOTAL NET WORTH</div>
        <div id="player-portfolio" style="font-size: 24px; color: var(--ui-success); font-weight: 700;">$ 0</div>
    </div>
    <div class="footer-card">
        <div style="font-size: 11px; color: #888;">SHARES (<span id="active-holding-ticker">---</span>)</div>
        <div id="player-shares" style="font-size: 24px; color: var(--ui-accent); font-weight: 700;">0.00</div>
    </div>
    <div style="display: flex; gap: 10px;">
        <button class="action-button buy" style="flex: 1;" onclick="playerAction('BUY')">BUY MAX</button>
        <button class="action-button sell" style="flex: 1;" onclick="playerAction('SELL')">SELL ALL</button>
    </div>
</footer>

<script>
    // --- GAME DATA ---
    let ASSETS = [
        { id: 'GRLD', name: 'GLOBAL RESOURCES LTD', price: 1200, vola: 8, hist: Array(100).fill(1200) },
        { id: 'NLNK', name: 'NEURALINK SYSTEMS', price: 450, vola: 15, hist: Array(100).fill(450) },
        { id: 'ACOM', name: 'AETHER COMMS CORP', price: 85, vola: 3, hist: Array(100).fill(85) },
        { id: 'DHAV', name: 'DATA HAVEN INC', price: 2000, vola: 25, hist: Array(100).fill(2000) }
    ];

    let gameState = {
        playerBalance: 100000,
        playerShares: {},
        activeAssetId: 'GRLD',
        audioContext: null
    };

    // --- ENGINE ---
    function bootSequence() {
        console.log("AETHER SYSTEM READY.");
    }

    function startGame() {
        document.getElementById('boot-overlay').style.display = 'none';
        initAudio();
        setInterval(tick, 1000);
        updateUI();
        notify("KINGMAKER PROTOCOL ACTIVATED.", "info");
    }

    function tick() {
        ASSETS.forEach(a => {
            let move = (Math.random() - 0.5) * a.vola;
            a.price = Math.max(1, a.price + move);
            a.hist.shift();
            a.hist.push(a.price);
        });
        
        if(Math.random() > 0.95) {
            triggerMarketEvent();
        }

        updateUI();
        drawChart();
    }

    function triggerMarketEvent() {
        const asset = ASSETS[Math.floor(Math.random() * ASSETS.length)];
        const crash = Math.random() > 0.5;
        const multiplier = crash ? 0.8 : 1.2;
        asset.price *= multiplier;
        const msg = crash ? "SHORT ATTACK DETECTED ON " : "BULLISH SURGE IN ";
        addNews(msg + asset.id, crash ? 'danger' : 'success');
        playSound('event');
    }

    // --- ACTIONS ---
    function playerAction(type) {
        const asset = ASSETS.find(a => a.id === gameState.activeAssetId);
        if(type === 'BUY' && gameState.playerBalance >= asset.price) {
            let qty = Math.floor(gameState.playerBalance / asset.price);
            gameState.playerShares[asset.id] = (gameState.playerShares[asset.id] || 0) + qty;
            gameState.playerBalance -= qty * asset.price;
            playSound('buy');
            notify("PURCHASED " + qty + " UNITS", "success");
        } else if(type === 'SELL' && (gameState.playerShares[asset.id] || 0) > 0) {
            let qty = gameState.playerShares[asset.id];
            gameState.playerBalance += qty * asset.price;
            gameState.playerShares[asset.id] = 0;
            playSound('sell');
            notify("LIQUIDATED " + qty.toFixed(0) + " UNITS", "danger");
        }
    }

    // --- UI RENDERING ---
    function updateUI() {
        const active = ASSETS.find(a => a.id === gameState.activeAssetId);
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString();
        document.getElementById('player-balance').innerText = "$ " + Math.floor(gameState.playerBalance).toLocaleString();
        
        let net = gameState.playerBalance;
        ASSETS.forEach(a => net += (gameState.playerShares[a.id] || 0) * a.price);
        document.getElementById('player-portfolio').innerText = "$ " + Math.floor(net).toLocaleString();

        document.getElementById('active-asset-name').innerText = active.name;
        document.getElementById('active-asset-ticker').innerText = active.id;
        document.getElementById('main-asset-price').innerText = active.price.toFixed(2);
        document.getElementById('player-shares').innerText = (gameState.playerShares[active.id] || 0).toFixed(2);
        document.getElementById('active-holding-ticker').innerText = active.id;

        const list = document.getElementById('asset-list-ui');
        list.innerHTML = ASSETS.map(a => \`
            <div class="asset-item \${a.id === gameState.activeAssetId ? 'active' : ''}" onclick="gameState.activeAssetId='\${a.id}'">
                <span>\${a.id}</span>
                <span style="color: \${a.price >= a.hist[0] ? 'var(--ui-success)' : 'var(--ui-danger)'}">\${a.price.toFixed(2)}</span>
            </div>
        \`).join('');
    }

    function drawChart() {
        const canvas = document.getElementById('main-chart-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const active = ASSETS.find(a => a.id === gameState.activeAssetId);

        const min = Math.min(...active.hist) * 0.95;
        const max = Math.max(...active.hist) * 1.05;
        const range = max - min;

        ctx.clearRect(0,0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.strokeStyle = '#00e6ff';
        ctx.lineWidth = 3;

        active.hist.forEach((p, i) => {
            const x = (i / 99) * canvas.width;
            const y = canvas.height - ((p - min) / range * canvas.height);
            if(i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    function addNews(msg, type) {
        const feed = document.getElementById('news-feed-display');
        const entry = document.createElement('div');
        entry.style.color = type === 'danger' ? 'var(--ui-danger)' : 'var(--ui-success)';
        entry.innerHTML = \`[\${new Date().toLocaleTimeString()}] \${msg}\`;
        feed.prepend(entry);
    }

    function notify(msg, type) {
        const area = document.getElementById('notification-area');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerText = msg;
        area.prepend(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- AUDIO (PUUTTUNUT OSA) ---
    function initAudio() {
        gameState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(type) {
        if (!gameState.audioContext) return;
        const osc = gameState.audioContext.createOscillator();
        const gain = gameState.audioContext.createGain();
        osc.connect(gain);
        gain.connect(gameState.audioContext.destination);

        if (type === 'buy') {
            osc.frequency.setValueAtTime(600, gameState.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, gameState.audioContext.currentTime + 0.1);
        } else if (type === 'sell') {
            osc.frequency.setValueAtTime(400, gameState.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, gameState.audioContext.currentTime + 0.1);
        } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, gameState.audioContext.currentTime);
        }

        gain.gain.setValueAtTime(0.1, gameState.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, gameState.audioContext.currentTime + 0.2);
        osc.start();
        osc.stop(gameState.audioContext.currentTime + 0.2);
    }
</script>
</body>
</html>
    `); // TÄMÄ SULKEE res.send -kutsun
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("SERVER RUNNING ON PORT " + PORT);
});
