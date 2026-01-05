/**
 * AETHER v27.1 - THE SILK ROAD (PITKÄ JA HELPPO VERSIO)
 */

const DARKNESS = ["vittu", "saatana", "perkele", "helvetti", "paska", "huora", "ruma", "läski", "tyhmä", "idiootti", "vihaan", "vitun", "pelle"];
const LIGHT_MESSAGES = ["Valitsen tänään ystävällisyyden. ✨", "Toivotan kaikille hyvää päivää! 🌸", "Puhutaan mieluummin kiltisti. 🌿"];

console.log("🛡️ Aether aktivoitu GitHubista!");

// AUTOMAATTINEN PUHDISTUS (Muut ihmiset)
const observer = new MutationObserver(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walker.nextNode()) {
        let text = node.nodeValue.toLowerCase();
        if (DARKNESS.some(word => text.includes(word))) {
            node.nodeValue = "🌸 [Aether: Valitse ystävällisyys] 🌸";
            if (node.parentElement) node.parentElement.style.color = "#ffafcc";
        }
    }
});
observer.observe(document.body, { childList: true, subtree: true });

// HELPPO LÄHETYKSEN ESTO (Sinä itse)
document.addEventListener('input', (e) => {
    const target = e.target;
    let val = (target.value || target.innerText || "").toLowerCase();
    if (DARKNESS.some(word => val.includes(word))) {
        if (!document.getElementById('aether-easy-ui')) {
            const ui = document.createElement('div');
            ui.id = 'aether-easy-ui';
            ui.style = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:9999999; display:flex; align-items:center; justify-content:center; flex-direction:column; color:white; font-family:sans-serif;";
            ui.innerHTML = `<div style="background:#222; padding:40px; border-radius:20px; border:3px solid #ff4d4d; text-align:center;">
                <h1 style="color:#ff4d4d;">STOP.</h1>
                <p>Sauli ja Aurora ehdottavat kiltimpää viestiä.</p>
                <button id="easy-fix-btn" style="padding:20px 40px; background:#ff4d4d; color:white; border:none; border-radius:10px; font-size:22px; cursor:pointer;">✨ MUUTA VIESTI KILTUKSI ✨</button>
            </div>`;
            document.body.appendChild(ui);
            document.getElementById('easy-fix-btn').onclick = () => {
                const cleanText = LIGHT_MESSAGES[Math.floor(Math.random() * LIGHT_MESSAGES.length)];
                if (target.value !== undefined) target.value = cleanText; else target.innerText = cleanText;
                ui.remove();
            };
        }
    }
}, true);
