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
    <link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@300;400;700&family=Oxanium:wght@400;700;800&display=swap" rel="stylesheet">
    <style>
        /* BASE STYLES */
        :root {
            --bg-dark: #00000a;
            --ui-accent: #00e6ff; /* Cyan */
            --ui-danger: #ff3366; /* Red */
            --ui-success: #33ff88; /* Green */
            --ui-gold: #ffcc00;
            --panel-bg: rgba(10, 10, 25, 0.95);
            --border-glow: rgba(0, 230, 255, 0.3);
            --text-light: #e0e6ed;
        }

        * {
            box-sizing: border-box;
            user-select: none;
        }

        body {
            margin: 0;
            padding: 0;
            height: 100vh;
            background-color: var(--bg-dark);
            color: var(--text-light);
            font-family: 'Chakra Petch', sans-serif;
            overflow: hidden;
            display: grid;
            grid-template-columns: 320px 1fr 320px;
            grid-template-rows: 70px 1fr 220px;
            gap: 2px;
        }

        /* GRID COMPONENTS */
        .panel {
            background-color: var(--panel-bg);
            border: 1px solid rgba(0, 230, 255, 0.1);
            position: relative;
            backdrop-filter: blur(8px);
            box-shadow: 0 0 20px rgba(0, 230, 255, 0.05);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* HEADER */
        header {
            grid-column: 1 / 4;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30px;
            border-bottom: 2px solid var(--border-glow);
            font-family: 'Oxanium', sans-serif;
            background-color: rgba(0,0,0,0.8);
        }
        .studio-logo {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: 5px;
            color: var(--ui-accent);
            text-shadow: 0 0 15px var(--ui-accent);
        }
        .game-title {
            font-size: 18px;
            letter-spacing: 3px;
            color: var(--text-light);
        }

        /* SIDEBARS */
        .sidebar { overflow-y: auto; }
        .sidebar-title {
            padding: 15px;
            font-size: 14px;
            font-weight: 700;
            border-bottom: 1px solid var(--border-glow);
            color: var(--ui-gold);
            text-transform: uppercase;
        }

        /* ASSET LIST */
        .asset-item {
            padding: 12px 15px;
            border-bottom: 1px solid rgba(255,255,255,0.05);
            cursor: pointer;
            transition: 0.2s background-color;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .asset-item:hover { background-color: rgba(0, 230, 255, 0.08); }
        .asset-item.active {
            border-left: 4px solid var(--ui-accent);
            background-color: rgba(0, 230, 255, 0.15);
        }
        .asset-name { font-weight: 700; font-size: 15px; }
        .asset-ticker { font-size: 11px; color: #888; }
        .asset-price { font-family: 'Oxanium'; font-size: 16px; color: var(--ui-success); }

        /* MAIN CHART */
        .chart-main {
            padding: 20px;
            border-bottom: 1px solid var(--border-glow);
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            background: radial-gradient(circle at center, rgba(0, 230, 255, 0.05) 0%, transparent 70%);
        }
        .current-price {
            font-family: 'Oxanium', sans-serif;
            font-size: 60px;
            font-weight: 800;
            line-height: 1;
            color: var(--ui-accent);
            text-shadow: 0 0 25px rgba(0, 230, 255, 0.5);
        }

        /* NEWS/LOGS */
        #news-feed-display {
            padding: 10px;
            font-size: 12px;
            flex-grow: 1;
            overflow-y: auto;
        }
        .news-entry {
            margin-bottom: 8px;
            line-height: 1.4;
            opacity: 0.8;
            transition: opacity 0.3s;
        }
        .news-entry.event { color: var(--ui-danger); font-weight: 700; }
        .news-entry.ai { color: var(--ui-gold); }

        /* FOOTER / CONTROLS */
        footer {
            grid-column: 1 / 4;
            display: grid;
            grid-template-columns: 2fr 1.5fr 1.5fr 2fr;
            gap: 20px;
            padding: 20px;
            background-color: rgba(0,0,0,0.8);
            border-top: 2px solid var(--border-glow);
        }
        .footer-card {
            background-color: rgba(20, 20, 40, 0.8);
            border: 1px solid rgba(0, 230, 255, 0.2);
            padding: 15px;
            border-radius: 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .card-label { font-size: 11px; color: #888; text-transform: uppercase; }
        .card-value {
            font-family: 'Oxanium', sans-serif;
            font-size: 24px;
            font-weight: 700;
            margin-top: 5px;
            color: var(--text-light);
        }
        .card-value.gold { color: var(--ui-gold); }
        .card-value.success { color: var(--ui-success); }
        .card-value.danger { color: var(--ui-danger); }

        .action-button {
            padding: 15px;
            border: none;
            border-radius: 5px;
            font-family: 'Oxanium', sans-serif;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
            transition: 0.2s all;
            text-transform: uppercase;
            box-shadow: 0 4px 0 rgba(0,0,0,0.3);
        }
        .action-button.buy { background-color: var(--ui-success); color: #000; }
        .action-button.buy:active { transform: translateY(4px); box-shadow: none; }
        .action-button.sell { background-color: var(--ui-danger); color: #fff; }
        .action-button.sell:active { transform: translateY(4px); box-shadow: none; }
        .action-button:disabled { opacity: 0.4; cursor: not-allowed; }

        /* AI DISPLAY */
        .ai-status {
            display: flex; flex-direction: column; gap: 10px;
            padding: 15px;
            border-bottom: 1px solid var(--border-glow);
        }
        .ai-entry { display: flex; justify-content: space-between; font-size: 12px; }
        .ai-entry .name { color: var(--ui-accent); font-weight: 700; }
        .ai-entry .bal { color: var(--ui-gold); }

        /* NOTIFICATIONS */
        #notification-area {
            position: fixed; top: 90px; right: 20px; z-index: 1000;
            width: 300px;
        }
        .toast {
            background-color: var(--panel-bg);
            border: 1px solid var(--ui-accent);
            padding: 12px 18px;
            margin-bottom: 10px;
            border-radius: 4px;
            box-shadow: 0 0 25px rgba(0, 230, 255, 0.2);
            animation: slideIn 0.4s ease-out;
            font-size: 13px;
        }
        @keyframes slideIn { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

        /* BOOT SCREEN */
        #boot-overlay {
            position: fixed; inset: 0; background-color: var(--bg-dark); z-index: 2000;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        }
        .boot-text {
            font-family: 'Oxanium', sans-serif;
            font-size: 40px;
            letter-spacing: 10px;
            color: var(--ui-accent);
            text-shadow: 0 0 30px var(--ui-accent);
            margin-bottom: 20px;
            animation: boot-pulse 2s infinite alternate;
        }
        @keyframes boot-pulse { 0% { opacity: 0.6; } 100% { opacity: 1; } }
    </style>
</head>
<body onload="bootSequence()">

<div id="boot-overlay">
    <div class="studio-logo">8S ENTERTAINMENT</div>
    <div class="boot-text">AETHER: KINGMAKER PROTOCOL</div>
    <p style="font-family: 'Chakra Petch'; font-size: 16px; color: #888;">[ INITIALIZING CORE SYSTEMS... CLICK TO CONTINUE ]</p>
</div>

<div id="notification-area"></div>

<header>
    <div class="studio-logo">8S</div>
    <div class="game-title">KINGMAKER PROTOCOL</div>
    <div style="font-size: 12px; color: var(--text-light);">
        <span id="player-reputation" style="color:var(--ui-gold);">REPUTATION: NEUTRAL</span> |
        <span id="clock-display" style="color:var(--ui-accent);">00:00:00</span>
    </div>
</header>

<div class="panel sidebar">
    <div class="sidebar-title">MARKET ASSETS</div>
    <div id="asset-list-ui"></div>
    <div class="sidebar-title" style="margin-top:10px;">AI COMPETITORS</div>
    <div id="ai-status-display"></div>
</div>

<div class="panel">
    <div class="chart-main">
        <div>
            <div id="active-asset-name" style="font-size: 18px; font-weight: 700;">GLOBAL RESOURCES LTD</div>
            <div id="active-asset-ticker" style="font-size: 12px; color: #888;">GRLD</div>
        </div>
        <div style="text-align: right;">
            <div class="current-price" id="main-asset-price">0.00</div>
            <div id="price-change-pct" style="font-size: 14px; color: var(--ui-success);">+0.00%</div>
        </div>
    </div>
    <canvas id="main-chart-canvas" style="flex-grow: 1; width: 100%;"></canvas>
</div>

<div class="panel sidebar">
    <div class="sidebar-title">GLOBAL NEWSFEED</div>
    <div id="news-feed-display"></div>
</div>

<footer>
    <div class="footer-card">
        <div class="card-label">AVAILABLE CAPITAL</div>
        <div class="card-value gold" id="player-balance">$ 100,000</div>
    </div>
    <div class="footer-card">
        <div class="card-label">TOTAL PORTFOLIO</div>
        <div class="card-value success" id="player-portfolio">$ 100,000</div>
    </div>
    <div class="footer-card">
        <div class="card-label">ACTIVE HOLDINGS (<span id="active-holding-ticker">---</span>)</div>
        <div class="card-value accent" id="player-shares">0.00 UNITS</div>
    </div>
    <div style="display: flex; gap: 10px;">
        <button class="action-button buy" onclick="playerAction('BUY')">ACQUIRE MAX</button>
        <button class="action-button sell" onclick="playerAction('SELL')">LIQUIDATE ALL</button>
    </div>
</footer>

<script>
    // --- GAME DATA & CONFIGURATION (AAA-LEVEL) ---
    const ASSETS = [
        { id: 'global_res', name: 'GLOBAL RESOURCES LTD', ticker: 'GRLD', price: 1200, vola: 8, hist: Array(100).fill(1200), description: "Mining & energy conglomerate." },
        { id: 'neural_tech', name: 'NEURALINK SYSTEMS', ticker: 'NLNK', price: 450, vola: 15, hist: Array(100).fill(450), description: "Cutting-edge AI and cybernetics." },
        { id: 'aether_comm', name: 'AETHER COMMS CORP', ticker: 'ACOM', price: 85, vola: 3, hist: Array(100).fill(85), description: "Galactic telecommunications giant." },
        { id: 'data_haven', name: 'DATA HAVEN INC', ticker: 'DHAV', price: 2000, vola: 25, hist: Array(100).fill(2000), description: "Secure data storage & dark web services." }
    ];

    const AI_COMPETITORS = [
        { id: 'triton', name: 'AI TRITON', balance: 150000, shares: {}, strategy: 'bullish', lastAction: 0, reputation: 'Aggressive' },
        { id: 'medusa', name: 'AI MEDUSA', balance: 180000, shares: {}, strategy: 'bearish', lastAction: 0, reputation: 'Calculated' }
    ];

    let gameState = {
        playerBalance: 100000,
        playerShares: {},
        activeAssetId: 'global_res',
        playerReputation: 50, // 0-100 scale, 50 is neutral
        gameTime: 0, // for events
        lastEventTick: 0,
        audioContext: null // For sound effects
    };

    const SAVE_KEY = 'AETHER_KINGMAKER_V30';

    // --- CORE GAME ENGINE ---

    function bootSequence() {
        document.getElementById('boot-overlay').addEventListener('click', startGame);
    }

    function startGame() {
        document.getElementById('boot-overlay').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('boot-overlay').remove();
            loadGame();
            initAudio();
            setInterval(gameTick, 800);
            setInterval(updateClock, 1000);
            setInterval(aiAction, 3000);
            setInterval(randomGameEvent, 10000); // Check for events every 10 seconds
            updateUI();
            notify("WELCOME, KINGMAKER. INTERFACE ONLINE.", 'info');
        }, 800);
    }

    function gameTick() {
        gameState.gameTime++;
        updateAssetPrices();
        drawChart();
        updateUI();
    }

    function updateAssetPrices() {
        ASSETS.forEach(asset => {
            let movement = (Math.random() * asset.vola) - (asset.vola / 2);
            asset.price = Math.max(1, asset.price + (movement * 0.1));
            asset.hist.shift();
            asset.hist.push(asset.price);
        });
    }

    function aiAction() {
        AI_COMPETITORS.forEach(ai => {
            const activeAsset = ASSETS.find(a => a.id === gameState.activeAssetId); // AI's also focus on active asset for simplicity
            if (Math.random() < 0.3 && (gameState.gameTime - ai.lastAction > 5)) { // AI acts every few ticks
                ai.lastAction = gameState.gameTime;
                if (ai.strategy === 'bullish' && ai.balance > activeAsset.price * 5) {
                    const buyAmount = Math.floor(ai.balance / activeAsset.price * 0.2);
                    ai.shares[activeAsset.id] = (ai.shares[activeAsset.id] || 0) + buyAmount;
                    ai.balance -= buyAmount * activeAsset.price;
                    addNews(`AI ${ai.name} initiated major BUY of ${activeAsset.ticker}.`, 'ai');
                } else if (ai.strategy === 'bearish' && ai.shares[activeAsset.id] > 0) {
                    const sellAmount = Math.floor(ai.shares[activeAsset.id] * 0.3);
                    ai.balance += sellAmount * activeAsset.price;
                    ai.shares[activeAsset.id] -= sellAmount;
                    addNews(`AI ${ai.name} liquidated ${sellAmount} units of ${activeAsset.ticker}.`, 'ai');
                }
            }
        });
    }

    function randomGameEvent() {
        if (gameState.gameTime - gameState.lastEventTick < 20) return; // Prevent too frequent events
        gameState.lastEventTick = gameState.gameTime;

        const events = [
            { msg: "MARKET CRASH ALERT! SYSTEMIC FAILURE DETECTED! (-20% price drop)", type: 'crash', effect: 0.8 },
            { msg: "TECH BOOM! NEW AI BREAKTHROUGH ANNOUNCED! (+15% price surge)", type: 'boom', effect: 1.15 },
            { msg: "MAJOR CYBER ATTACK ON DATA HAVEN! (-30% for DHAV)", type: 'cyber', asset: 'data_haven', effect: 0.7 }
        ];
        const event = events[Math.floor(Math.random() * events.length)];
        
        ASSETS.forEach(asset => {
            if (!event.asset || event.asset === asset.id) {
                asset.price *= event.effect;
                asset.vola *= (event.effect > 1 ? 1.2 : 0.8); // Volatility changes with events
                asset.price = Math.max(1, asset.price);
            }
        });
        addNews(`GLOBAL EVENT: ${event.msg}`, 'event');
        notify(event.msg, 'event');
        playSound('event');
    }

    // --- PLAYER ACTIONS ---

    function playerAction(type) {
        let activeAsset = ASSETS.find(a => a.id === gameState.activeAssetId);
        if (type === 'BUY' && gameState.playerBalance > 0) {
            let unitsToBuy = gameState.playerBalance / activeAsset.price;
            gameState.playerShares[activeAsset.id] = (gameState.playerShares[activeAsset.id] || 0) + unitsToBuy;
            gameState.playerBalance = 0;
            addNews(`PLAYER executed BUY of ${unitsToBuy.toFixed(2)} ${activeAsset.ticker}.`, 'player');
            notify(`Bought ${unitsToBuy.toFixed(2)} ${activeAsset.ticker}`, 'success');
            playSound('buy');
        } else if (type === 'SELL' && (gameState.playerShares[activeAsset.id] || 0) > 0) {
            let unitsToSell = gameState.playerShares[activeAsset.id];
            gameState.playerBalance += unitsToSell * activeAsset.price;
            gameState.playerShares[activeAsset.id] = 0;
            addNews(`PLAYER executed SELL of ${unitsToSell.toFixed(2)} ${activeAsset.ticker}.`, 'player');
            notify(`Sold ${unitsToSell.toFixed(2)} ${activeAsset.ticker}`, 'danger');
            playSound('sell');
        }
        saveGame();
        updateUI();
    }

    function selectAsset(id) {
        gameState.activeAssetId = id;
        updateUI();
    }

    // --- UI RENDERING & UPDATES ---

    function updateUI() {
        const activeAsset = ASSETS.find(a => a.id === gameState.activeAssetId);

        // Header
        document.getElementById('player-reputation').innerText = `REPUTATION: ${getReputationText(gameState.playerReputation)}`;
        document.getElementById('clock-display').innerText = new Date().toLocaleTimeString();

        // Asset List
        const assetListUI = document.getElementById('asset-list-ui');
        assetListUI.innerHTML = '';
        ASSETS.forEach(asset => {
            const div = document.createElement('div');
            div.className = `asset-item ${asset.id === gameState.activeAssetId ? 'active' : ''}`;
            div.onclick = () => selectAsset(asset.id);
            div.innerHTML = `
                <div>
                    <div class="asset-name">${asset.name}</div>
                    <div class="asset-ticker">${asset.ticker}</div>
                </div>
                <div class="asset-price" style="color:${asset.price >= asset.hist[99] ? 'var(--ui-success)' : 'var(--ui-danger)'}">
                    ${asset.price.toFixed(2)}
                </div>
            `;
            assetListUI.appendChild(div);
        });

        // AI Status
        const aiStatusDisplay = document.getElementById('ai-status-display');
        aiStatusDisplay.innerHTML = '';
        AI_COMPETITORS.forEach(ai => {
            let totalAiValue = ai.balance;
            for(let id in ai.shares) {
                const asset = ASSETS.find(a => a.id === id);
                if (asset) totalAiValue += ai.shares[id] * asset.price;
            }
            const div = document.createElement('div');
            div.className = 'ai-status';
            div.innerHTML = `
                <div class="ai-entry"><span class="name">${ai.name}</span><span>Value: <span class="bal">$ ${Math.floor(totalAiValue).toLocaleString()}</span></span></div>
                <div class="ai-entry"><span style="color:#888;">Strategy: ${ai.strategy}</span><span>Reputation: ${ai.reputation}</span></div>
            `;
            aiStatusDisplay.appendChild(div);
        });

        // Main Chart Area
        document.getElementById('active-asset-name').innerText = activeAsset.name;
        document.getElementById('active-asset-ticker').innerText = activeAsset.ticker;
        document.getElementById('main-asset-price').innerText = activeAsset.price.toFixed(2);
        const priceChangePct = (activeAsset.price - activeAsset.hist[0]) / activeAsset.hist[0] * 100;
        document.getElementById('price-change-pct').innerText = `${priceChangePct >= 0 ? '+' : ''}${priceChangePct.toFixed(2)}%`;
        document.getElementById('price-change-pct').style.color = priceChangePct >= 0 ? 'var(--ui-success)' : 'var(--ui-danger)';

        // Footer
        document.getElementById('player-balance').innerText = `$ ${Math.floor(gameState.playerBalance).toLocaleString()}`;
        
        let totalPortfolioValue = gameState.playerBalance;
        for (let id in gameState.playerShares) {
            const asset = ASSETS.find(a => a.id === id);
            if (asset) totalPortfolioValue += gameState.playerShares[id] * asset.price;
        }
        document.getElementById('player-portfolio').innerText = `$ ${Math.floor(totalPortfolioValue).toLocaleString()}`;

        document.getElementById('active-holding-ticker').innerText = activeAsset.ticker;
        document.getElementById('player-shares').innerText = `${(gameState.playerShares[activeAsset.id] || 0).toFixed(2)} UNITS`;
    }

    function drawChart() {
        const canvas = document.getElementById('main-chart-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        const activeAsset = ASSETS.find(a => a.id === gameState.activeAssetId);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Grid Lines
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 10; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * (canvas.height / 10));
            ctx.lineTo(canvas.width, i * (canvas.height / 10));
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(i * (canvas.width / 10), 0);
            ctx.lineTo(i * (canvas.width / 10), canvas.height);
            ctx.stroke();
        }

        // Chart Line
        const minPrice = Math.min(...activeAsset.hist) * 0.95;
        const maxPrice = Math.max(...activeAsset.hist) * 1.05;
        const priceRange = maxPrice - minPrice;

        ctx.beginPath();
        ctx.strokeStyle = 'var(--ui-accent)';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'var(--ui-accent)';

        activeAsset.hist.forEach((p, i) => {
            const x = i * (canvas.width / activeAsset.hist.length);
            const y = canvas.height - ((p - minPrice) / (priceRange || 1) * canvas.height);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Gradient Fill
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, 'rgba(0, 230, 255, 0.2)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 0;
        ctx.fill();
    }

    function addNews(msg, type = 'info') {
        const newsFeed = document.getElementById('news-feed-display');
        const entry = document.createElement('div');
        entry.className = `news-entry ${type}`;
        entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;
        newsFeed.prepend(entry);
        if (newsFeed.children.length > 20) newsFeed.lastChild.remove();
    }

    function notify(message, type = 'info') {
        const notificationArea = document.getElementById('notification-area');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerText = message;
        notificationArea.prepend(toast);
        setTimeout(() => toast.style.opacity = '0', 3000);
        setTimeout(() => toast.remove(), 3500);
    }

    function getReputationText(score) {
        if (score > 80) return "LEGENDARY";
        if (score > 60) return "RESPECTED";
        if (score > 40) return "NEUTRAL";
        if (score > 20) return "SUSPICIOUS";
        return "CRIMINAL";
    }

    // --- SAVE/LOAD SYSTEM ---
    function saveGame() {
        localStorage.setItem(SAVE_KEY, JSON.stringify(gameState));
        addNews("Game state SAVED.", 'info');
    }

    function loadGame() {
        const savedState = localStorage.getItem(SAVE_KEY);
        if (savedState) {
            gameState = JSON.parse(savedState);
            addNews("Game state LOADED.", 'info');
        }
    }

    // --- AUDIO SYSTEM (BASIC) ---
    function initAudio() {
        gameState.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    function playSound(type) {
        if (!gameState.audioContext) return;
        const oscillator = gameState.audioContext.createOscillator();
        const gainNode = gameState.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(gameState.audioContext.destination);

        if (type === 'buy') {
            oscillator.frequency.setValueAtTime(440, gameState.audioContext.currentTime); // A4
            gainNode.gain.setValueAtTime(0.3, gameState.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, gameState.audioContext.currentTime + 0.2);
        } else if (type === 'sell') {
            oscillator.frequency.setValueAtTime(220, gameState.audioContext.currentTime); // A3
            gainNode.gain.setValueAtTime(0.3, gameState.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, gameState.audioContext.currentTime + 0.2);
        } else if (type === 'event') {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, gameState.audioContext.currentTime);
            oscillator.frequency.linearRampToValueAtTime(50, gameState.audioContext.currentTime + 0.5);
            gainNode.gain.setValueAtTime(0.4, gameState
