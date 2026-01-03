const express = require('express');
const app = express();

/**
 * 👑 AETHER SUPREMACY V23 - THE FINAL ARCHITECTURE 👑
 */

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AETHER SUPREMACY | NEURAL INTERFACE</title>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;900&family=Fira+Code&display=swap" rel="stylesheet">
    <style>
        :root { --cyan: #00f2ff; --gold: #ffcc00; --red: #ff0044; --bg: #02020a; --panel: rgba(10, 10, 30, 0.9); }
        body, html { margin: 0; padding: 0; height: 100vh; background: var(--bg); color: #fff; font-family: 'Orbitron', sans-serif; overflow: hidden; }
        .main-frame { display: grid; grid-template-columns: 350px 1fr 350px; grid-template-rows: 80px 1fr 150px; height: 100vh; gap: 15px; padding: 15px; box-sizing: border-box; }
        .ui-node { background: var(--panel); border: 1px solid rgba(0, 242, 255, 0.2); position: relative; overflow: hidden; display: flex; flex-direction: column; backdrop-filter: blur(10px); }
        .header { grid-column: 1 / 4; display: flex; justify-content: space-between; align-items: center; padding: 0 30px; border-left: 5px solid var(--gold); }
        .logo { font-size: 28px; font-weight: 900; letter-spacing: 8px; color: var(--gold); }
        .market-center { grid-column: 2; position: relative; border: 1px solid var(--cyan); }
        .price-display { position: absolute; top: 30px; left: 30px; }
        .price-big { font-size: 70px; color: var(--cyan); text-shadow: 0 0 25px var(--cyan); }
        .terminal { flex-grow: 1; background: #000; margin: 10px; font-family: 'Fira Code', monospace; font-size: 11px; color: #0f0; padding: 15px; overflow-y: hidden; }
        .controls { grid-column: 1 / 4; display: grid; grid-template-columns: 1fr 2fr 2fr 1fr; gap: 15px; }
        .btn { border: none; cursor: pointer; font-family: 'Orbitron'; font-weight: 900; font-size: 18px; transition: 0.2s; text-transform: uppercase; }
        .buy { background: var(--cyan); color: #000; }
        .sell { background: transparent; border: 2px solid var(--red); color: var(--red); }
        #overlay { position: fixed; inset: 0; background: #000; z-index: 9999; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    </style>
</head>
<body onclick="startEngine()">
<div id="overlay">
    <h1 style="color:var(--gold); letter-spacing:15px;">AETHER SUPREMACY</h1>
    <p style="color:var(--cyan); font-family:monospace;">> CORE STABILITY: 100% | NODE: VERCEL_V23</p>
    <div style="margin-top:40px; border:1px solid #fff; padding:20px; cursor:pointer;">[ INITIALIZE NEURAL LINK ]</div>
</div>
<div class="main-frame">
    <div class="ui-node header"><div class="logo">AETHER//CORP</div><div id="clock" style="font-family:monospace; color:var(--cyan);">00:00:00</div></div>
    <div class="ui-node"><div style="padding:15px; font-size:12px; border-bottom:1px solid #222;">SYSTEM_LOGS_V23</div><div class="terminal" id="term">> System idle...</div></div>
    <div class="ui-node market-center">
        <div class="price-display"><div style="font-size:12px; letter-spacing:3px;">GLOBAL_INDEX_VALUE</div><div class="price-big" id="price">500.00</div></div>
        <canvas id="chart-canvas" style="width:100%; height:100%;"></canvas>
    </div>
    <div class="ui-node"><div style="padding:15px; font-size:12px; border-bottom:1px solid #222;">CAPITAL_RESOURCES</div><div style="padding:20px; text-align:center;"><div id="bal" style="font-size:40px; color:var(--gold);">$ 100,000</div><div id="shares" style="color:var(--cyan); margin-top:10px;">SHARES: 0</div></div></div>
    <div class="controls">
        <div class="ui-node" style="justify-content:center; align-items:center; color:var(--gold); font-size:20px;">RANK: NOVICE</div>
        <button class="btn buy" onclick="trade('BUY')">Aggressive Buy</button>
        <button class="btn sell" onclick="trade('SELL')">Instant Sell</button>
        <div class="ui-node" style="justify-content:center; align-items:center; color:var(--cyan);">XP: 0</div>
    </div>
</div>
<script>
    let bal = 100000; let shares = 0; let price = 500; let history = Array(50).fill(500); let engineRunning = false;
    function startEngine() { if(engineRunning) return; engineRunning = true; document.getElementById('overlay').style.display = 'none'; log("Connection established. Welcome King."); setInterval(tick, 800); setInterval(() => { document.getElementById('clock').innerText = new Date().toLocaleTimeString(); }, 1000); }
    function tick() { price = Math.max(10, price + (Math.random() * 40 - 20)); history.shift(); history.push(price); document.getElementById('price').innerText = price.toFixed(2); drawChart(); }
    function trade(type) {
        if(type === 'BUY' && bal > 0) { shares = bal / price; bal = 0; log("BUY EXECUTED: " + shares.toFixed(2)); }
        else if(type === 'SELL' && shares > 0) { bal = shares * price; shares = 0; log("SELL EXECUTED. BAL: $" + Math.floor(bal)); }
        document.getElementById('bal').innerText = "$ " + Math.floor(bal).toLocaleString();
        document.getElementById('shares').innerText = "SHARES: " + shares.toFixed(2);
    }
    function log(m) { const t = document.getElementById('term'); t.innerHTML += "<div>> " + m + "</div>"; t.scrollTop = t.scrollHeight; }
    function drawChart() {
        const c = document.getElementById('chart-canvas'); const ctx = c.getContext('2d');
        c.width = c.offsetWidth; c.height = c.offsetHeight;
        ctx.strokeStyle = '#00f2ff'; ctx.lineWidth = 3; ctx.beginPath();
        let step = c.width / 50;
        history.forEach((p, i) => { let y = c.height - (p / 1000 * c.height); if(i === 0) ctx.moveTo(0, y); else ctx.lineTo(i * step, y); });
        ctx.stroke();
    }
</script>
</body>
</html>
    `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Aether Server Running'));
module.exports = app;
