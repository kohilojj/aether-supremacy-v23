/**
 * 🏛️ AETHER SUPREMACY v28 - OFFICIAL BROWSER EXTENSION
 * "Digitaalinen omatunto jokaiselle selaimelle."
 */

(function() {
    'use strict';

    // JÄRJESTELMÄN ASETUKSET
    const AETHER_CORE = {
        name: "Aether Supremacy",
        version: "28.0",
        creator: "Keksijä",
        shieldActive: true
    };

    // KIELLETTYJEN SANOJEN LISTA (Laajennettu versio)
    const DARKNESS = [
        "vittu", "saatana", "perkele", "helvetti", "paska", "huora", "kyrpä", 
        "pillu", "ruma", "läski", "tyhmä", "idiootti", "luuseri", "vammainen", 
        "vihaan", "tapa", "kuole", "vitun", "pelle", "homo", "neekeri", "manne",
        "huoran", "paskan", "vitusti", "perkeleen", "runkkari"
    ];

    // POSITIIVISET VAIHTOEHDOT (Aurora-protokolla)
    const LIGHT_MESSAGES = [
        "🌸 [Tämä viesti on puhdistettu ystävällisyydellä] 🌸",
        "✨ [Aether muutti pimeyden valoksi] ✨",
        "🌿 [Sauli suosittelee herrasmiesmäistä kielenkäyttöä] 🌿",
        "🕊️ [Tässä oli ilkeyttä, nyt tässä on rauhaa] 🕊️"
    ];

    console.log(`%c🛡️ ${AETHER_CORE.name} v${AETHER_CORE.version} AKTIVOITU`, "color: #00ff41; font-weight: bold; font-size: 15px;");

    /**
     * FUNKTIO: SIVUN PUHDISTUS
     * Käy läpi kaiken tekstin ja muuttaa sen kiltiksi.
     */
    const purifyInternet = () => {
        if (!AETHER_CORE.shieldActive) return;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            let originalText = node.nodeValue;
            let lowerText = originalText.toLowerCase();
            let hasDarkness = false;

            DARKNESS.forEach(word => {
                if (lowerText.includes(word)) {
                    hasDarkness = true;
                }
            });

            if (hasDarkness) {
                const randomLight = LIGHT_MESSAGES[Math.floor(Math.random() * LIGHT_MESSAGES.length)];
                node.nodeValue = randomLight;
                
                // Lisätään visuaalinen tehoste tekstin ympärille
                if (node.parentElement) {
                    node.parentElement.style.transition = "0.5s";
                    node.parentElement.style.color = "#ffafcc";
                    node.parentElement.style.textShadow = "0 0 8px rgba(255,175,204,0.5)";
                }
            }
        }
    };

    // Tarkkaillaan sivun muutoksia livenä (esim. YouTube-kommentit, jotka latautuvat rullatessa)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => purifyInternet());
    });

    observer.observe(document.body, { childList: true, subtree: true });

    /**
     * FUNKTIO: OMAN KIRJOITUKSEN VAHTI
     * Estää sinua lähettämästä ilkeyksiä.
     */
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            let val = (target.value || target.innerText || "").toLowerCase();
            
            if (DARKNESS.some(word => val.includes(word))) {
                triggerEasyShield(target);
            }
        }
    }, true);

    function triggerEasyShield(element) {
        if (document.getElementById('aether-shield-ui')) return;

        const shield = document.createElement('div');
        shield.id = 'aether-shield-ui';
        shield.style = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(10, 10, 10, 0.95); z-index: 999999999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            color: #ff4d4d; font-family: 'Segoe UI', sans-serif; text-align: center;
        `;
        
        shield.innerHTML = `
            <div style="padding: 40px; border: 2px solid #ff4d4d; border-radius: 20px; background: #000;">
                <h1 style="font-size: 40px; margin-bottom: 10px;">🛡️ AETHER ESTO</h1>
                <p style="font-size: 18px; color: #fff;">Sauli huomasi, että olet kirjoittamassa jotain rumaa.</p>
                <p style="font-style: italic; color: #ffafcc;">"Ei se mitään, jokainen meistä suuttuu joskus. Mutta älä anna pimeyden voittaa."</p>
                <button id="fix-my-text" style="
                    margin-top: 30px; padding: 15px 40px; background: #ff4d4d; 
                    color: white; border: none; border-radius: 10px; 
                    font-size: 20px; font-weight: bold; cursor: pointer;
                ">✨ MUUTA VIESTI KILTUKSI ✨</button>
            </div>
        `;

        document.body.appendChild(shield);

        document.getElementById('fix-my-text').onclick = () => {
            const cleanMsg = "Haluan vain sanoa, että arvostan kaikkia ja toivotan hyvää päivää! ✨";
            if (element.value !== undefined) element.value = cleanMsg;
            else element.innerText = cleanMsg;
            shield.remove();
        };
    }

    // Suoritetaan ensimmäinen puhdistus
    purifyInternet();

})();
