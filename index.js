const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETHER TERMINAL | PERSISTENT WORLD</title>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@900&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg: #040508;
            --panel: #0a0b10;
            --border: #1a1c26;
            --up: #00ffa3;
            --down: #ff3b6f;
            --accent: #3a86ff;
            --text: #e0e6ed;
        }

        body {
            margin: 0; background: var(--bg); color: var(--text);
            font-family: 'JetBrains Mono', monospace; overflow: hidden;
            display: grid;
            grid-template-columns: 300px 1fr 320px;
            grid-template-rows: 60px 1fr 200px;
            height: 100vh; gap: 2px;
        }

        /* HEADER */
        header {
            grid-column: 1 / 4; background: var(--panel); border-bottom: 1px solid var(--border);
            display: flex; align-items: center; padding: 0 25px; justify-content: space-between;
        }
        .logo { font-family: 'Orbitron'; font-size: 22px; color: var(--accent); letter-spacing: 4px; text-shadow: 0 0 15px rgba(58, 134, 255, 0.4); }

        /* SIDEBARS */
        .sidebar { background: var(--panel); overflow-y: auto; border-right: 1px solid var(--border); }
        .stock-item {
            padding: 18px; border-bottom: 1px solid var(--border); cursor: pointer;
            display: flex; justify-content: space-between; transition: 0.2s;
        }
        .stock-item:hover { background: rgba(58, 134, 255, 0.05); }
        .stock-item.active { background: linear-gradient(90deg, rgba(58, 134, 255, 0.15), transparent); border-left: 5px solid var(--accent); }

        /* MAIN CHART */
        .viewport { background: var(--panel); display: flex; flex-direction: column; position: relative; }
        .chart-hud { padding: 25px; display: flex; justify-content: space-between; align-items: flex-start; }
        .price-tag { font-family: 'Orbitron'; font-size: 45px; font-weight: 900; }

        /* FOOTER / TRADING */
        footer {
            grid-column: 1 / 4; background: var(--panel); border-top: 1px solid var(--border);
            display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 20px; padding: 20px;
        }

        .action-card { background: #0f111a; border: 1px solid var(--border); padding: 15px; border-radius: 8px; position: relative; }
        .btn {
            width: 100%; padding: 15px; border: none; border-radius: 6px; font-family: 'Orbitron';
            font-weight: 900; cursor: pointer; transition: 0.2s; text-transform: uppercase; margin-top: 10px;
        }
        .buy { background: var(--up); color: #000; box-shadow: 0 4px 0 #009e65; }
        .sell { background: var(--down); color: #fff; box-shadow: 0 4px 0 #b3294e; }
        .btn:active { transform: translateY(4px); box-shadow: none; }

        /* NOTIFICATION SYSTEM */
        #notify {
            position: fixed; top: 80px; right: 20px; z-index: 1000;
        }
        .toast {
            background: var(--panel); border: 1px solid var(--accent); padding: 15px 25px;
            margin-bottom: 10px; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
    </style>
</head>
<body onclick="audioInit()">

<div id="notify"></div>

<header>
    <div class="logo">AETHER//ULTRA</div>
    <div style="display: flex; gap: 40px; font-size: 12px; font-weight: bold;">
        <div id="save-status" style="color: var(--accent);">● AUTO-SAVE ENABLED</div>
        <div id="clock">00:00:00</div>
    </div>
</header>

<div class="sidebar" id="market-list"></div>

<main class="viewport">
    <div class="chart-hud">
        <div>
            <div id="target-name" style="font-size: 20px; color: var(--accent);">FACEBOOK / META</div>
            <div id="target-ticker" style="color: #555; font-size: 12px;">ASSET_ID: 001</div>
        </div>
        <div style="text-align: right;">
            <div class="price-tag" id="main-price">0.00</div>
            <div id="price-dir" style="color: var(--up);">+2.14% ▲</div>
        </div>
    </div>
    <canvas id="chart-canvas" style="flex-grow: 1; width: 100%;"></canvas>
</main>

<div class="sidebar" style="border-left: 1px solid var(--border); border-right: none;">
    <div style="padding: 20px; font-weight: bold; font-size: 12px; border-bottom: 1px solid var(--border);">LIVE TRANSACTIONS</div>
    <div id="trade-log" style="font-size: 11px; padding: 10px;"></div>
</div>

<footer>
    <div class="action-card">
        <div style="font-size: 11px; color: #555;">LIQUID CAPITAL</div>
        <div id="ui-bal" style="font-size: 24px; color: white;">$ 100,000</div>
    </div>
    <div class="action-card">
        <div style="font-size: 11px; color: #555;">PORTFOLIO VALUE</div>
        <div id="ui-port" style="font-size: 24px; color: var(--accent);">$ 100,000</div>
    </div>
    <div class="action-card">
        <div style="font-size: 11px; color: #555;">POSITION</div>
        <div id="ui-shares" style="font-size: 24px; color: var(--up);">0.00 UNITS</div>
    </div>
    <div style="display: flex; gap: 10px;">
        <button class="btn buy" onclick="trade('BUY')">Buy</button>
        <button class="btn sell" onclick="trade('SELL')">Sell</button>
    </div>
</footer>

<script>
    // PELIDATA & TALLENNUS
    const STOCKS = [
        { id: 'meta', name: 'FACEBOOK (META)', ticker: 'META', price: 485, vola: 6, hist: Array(100).fill(485) },
        { id: 'posti', name: 'POSTI OYJ', ticker: 'POSTI', price: 14.20, vola: 1.5, hist: Array(100).fill(14.2) },
        { id: 'tsla', name: 'TESLA MOTOR', ticker: 'TSLA', price: 215, vola: 12, hist: Array(100).fill(215) },
        { id: 'nvda', name: 'NVIDIA AI', ticker: 'NVDA', price: 560, vola: 18, hist: Array(100).fill(560) }
    ];

    let state = {
        balance: 100000,
        portfolio: {}, // Esim: { meta: 10.5, tsla: 0 }
        activeId: 'meta'
    };

    // --- TALLENNUSJÄRJESTELMÄ ---
    function loadGame() {
        const saved = localStorage.getItem('AETHER_SAVE_V27');
        if(saved) {
            const parsed = JSON.parse(saved);
            state.balance = parsed.balance;
            state.portfolio = parsed.portfolio;
            toast("WELCOME BACK. DATA RESTORED.");
        }
    }

    function saveGame() {
        localStorage.setItem('AETHER_SAVE_V27', JSON.stringify({
            balance: state.balance,
            portfolio: state.portfolio
        }));
    }

    // --- MOOTTORI ---
    function init() {
        loadGame();
        renderMarkets();
        setInterval(tick, 1000);
        setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000);
        updateUI();
    }

    function tick() {
        STOCKS.forEach(s => {
            let change = (Math.random() * s.vola) - (s.vola/2);
            s.price = Math.max(1, s.price + (change * 0.1));
            s.hist.shift(); s.hist.push(s.price);
        });
        draw();
        updateUI();
    }

    function trade(type) {
        let stock = STOCKS.find(s => s.id === state.activeId);
        if(type === 'BUY' && state.balance > 0) {
            let units = state.balance / stock.price;
            state.portfolio[stock.id] = (state.portfolio[stock.id] || 0) + units;
            state.balance = 0;
            toast("PURCHASE EXECUTED: " + stock.ticker);
        } else if(type === 'SELL' && state.portfolio[stock.id] > 0) {
            state.balance = state.portfolio[stock.id] * stock.price;
            state.portfolio[stock.id] = 0;
            toast("POSITION LIQUIDATED: " + stock.ticker);
        }
        saveGame(); // TALLENTAA HETI KAUPAN JÄLKEEN
        updateUI();
    }

    function updateUI() {
        document.getElementById('ui-bal').innerText = "$ " + Math.floor(state.balance).toLocaleString();
        let currentStock = STOCKS.find(s => s.id === state.activeId);
        document.getElementById('main-price').innerText = currentStock.price.toFixed(2);
        document.getElementById('ui-shares').innerText = (state.portfolio[state.activeId] || 0).toFixed(2) + " UNITS";
        
        // Laske salkun arvo
        let total = state.balance;
        for(let id in state.portfolio) {
            let s = STOCKS.find(x => x.id === id);
            total += state.portfolio[id] * s.price;
        }
        document.getElementById('ui-port').innerText = "$ " + Math.floor(total).toLocaleString();
        renderMarkets();
    }

    function renderMarkets() {
        const list = document.getElementById('market-list');
        list.innerHTML = '';
        STOCKS.forEach(s => {
            const item = document.createElement('div');
            item.className = \`stock-item \${s.id === state.activeId ? 'active' : ''}\`;
            item.onclick = () => { state.activeId = s.id; updateUI(); };
            item.innerHTML = \`
                <div>
                    <div style="font-weight:bold;">\${s.name}</div>
                    <div style="font-size:10px; color:#555;">\${s.ticker}</div>
                </div>
                <div style="font-weight:bold; color:\${s.id === state.activeId ? 'var(--accent)' : 'white'}">
                    \${s.price.toFixed(2)}
                </div>
            \`;
            list.appendChild(item);
        });
    }

    function draw() {
        const c = document.getElementById('chart-canvas');
        const ctx = c.getContext('2d');
        c.width = c.offsetWidth; c.height = c.offsetHeight;
        let s = STOCKS.find(x => x.id === state.activeId);
        let min = Math.min(...s.hist); let max = Math.max(...s.hist);
        let range = max - min;
        
        ctx.strokeStyle = '#3a86ff'; ctx.lineWidth = 4; ctx.beginPath();
        s.hist.forEach((p, i) => {
            let x = i * (c.width/100);
            let y = c.height - ((p - min) / (range || 1) * (c.height * 0.7) + (c.height * 0.15));
            if(i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.stroke();
    }

    function toast(m) {
        const t = document.createElement('div');
        t.className = 'toast'; t.innerText = "> " + m;
        document.getElementById('notify').appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    init();
</script>
</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Aether Persistent Engine Online'));
