/**
 * AETHER SUPREMACY v27.1 - THE ULTIMATE SHIELD
 * Built for: Google Messages, WhatsApp, YouTube, Reddit & All Web.
 */

(function() {
    const DARK_ENERGY = [
        "vittu", "saatana", "perkele", "helvetti", "paska", "huora", "kyrpä", 
        "pillu", "ruma", "läski", "tyhmä", "idiootti", "luuseri", "vammainen", 
        "vihaan", "tapa", "kuole", "vitun", "pelle", "homo", "neekeri", "manne"
    ];

    const LIGHT_ENERGY = [
        "Valitsen tänään ystävällisyyden ja valon. ✨",
        "Toivotan kaikille pelkkää hyvää tästä lähtien! 🌸",
        "Puhutaan toisillemme kunnioittaen, se kannattaa. 🌿",
        "Aether on muuttanut tämän viestin rakkaudeksi. ❤️"
    ];

    console.log("%c🛡️ AETHER v27.1: SUOJAUS AKTIIVINEN", "color: #ff4d4d; font-weight: bold; font-size: 20px;");

    // 1. AUTOMAATTINEN SIVUN PUHDISTUS (Muiden viestit)
    const scanPage = () => {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            let text = node.nodeValue.toLowerCase();
            let foundBadWord = DARK_ENERGY.some(word => text.includes(word));

            if (foundBadWord) {
                node.nodeValue = "🌸 [Viesti puhdistettu Aether-protokollalla] 🌸";
                if (node.parentElement) {
                    node.parentElement.style.color = "#ffafcc";
                    node.parentElement.style.fontStyle = "italic";
                    node.parentElement.style.textShadow = "0 0 5px #fff";
                }
            }
        }
    };

    // Tarkkaillaan sivua jatkuvasti uusien viestien varalta
    const observer = new MutationObserver(scanPage);
    observer.observe(document.body, { childList: true, subtree: true });

    // 2. LÄHETYKSEN ESTO JA LOCKDOWN (Omat viestit)
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            let val = (target.value || target.innerText || "").toLowerCase();
            
            if (DARK_ENERGY.some(word => val.includes(word))) {
                triggerLockdown(target);
            }
        }
    }, true);

    function triggerLockdown(element) {
        if (document.getElementById('aether-lockdown-ui')) return;

        const lock = document.createElement('div');
        lock.id = 'aether-lockdown-ui';
        lock.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95); z-index: 2147483647;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            color: #ffafcc; font-family: 'Courier New', monospace; text-align: center; padding: 20px;
        `;
        
        lock.innerHTML = `
            <div style="border: 4px solid #ff4d4d; padding: 50px; background: #111; border-radius: 30px; box-shadow: 0 0 100px #ff4d4d;">
                <h1 style="color:#ff4d4d; font-size: 40px; margin-bottom: 20px;">SEIS!</h1>
                <p style="font-size: 20px;">Sauli ja Aurora huomasivat pimeyttä viestissäsi.</p>
                <p style="font-style: italic; margin: 20px 0;">"Noniin... poika. Ei mennä tuolle tielle." - Sauli</p>
                <button id="purify-now" style="
                    margin-top: 30px; padding: 20px 50px; background: #ff4d4d; 
                    color: white; border: none; border-radius: 15px; 
                    font-size: 24px; font-weight: bold; cursor: pointer;
                    box-shadow: 0 0 20px #ff4d4d;
                ">✨ PUHDISTA VIESTISI ✨</button>
            </div>
        `;

        document.body.appendChild(lock);

        document.getElementById('purify-now').onclick = () => {
            const safeText = LIGHT_ENERGY[Math.floor(Math.random() * LIGHT_ENERGY.length)];
            if (element.value !== undefined) element.value = safeText;
            else element.innerText = safeText;
            lock.remove();
            alert("Aurora: 'Sä oot niin paljon parempi ihminen kun puhut kiltisti! ✨'");
        };
    }

    // Alkuajo
    scanPage();
})();
