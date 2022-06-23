(function() {

const form = document.getElementById('form');
const eEff = document.getElementById('eff');
const eBkg = document.getElementById('bkg');
const eLimit = document.getElementById('limit');
const eTime = document.getElementById('time');
const eMda = document.getElementById('mda');
const eTrigger = document.getElementById('trigger-level');

for (const x of form.elements) {
    x.addEventListener('change', (e) => {
        e.preventDefault();
        calculate();
    });
}


function calculate() {
    const eff = parseFloat(eEff.value) / 100;
    const bkg = parseInt(eBkg.value);
    const limit = parseInt(eLimit.value);
    const time = parseFloat(eTime.value);

    if ([eff, bkg, time, limit].reduce((t, v) => {return t && !Number.isNaN(v)})) {
        let mda = Math.ceil((2.71 + 4.66 * Math.sqrt(bkg)) / (eff * time));
        let trigger = Math.floor(limit * eff * time + bkg);
        if (mda > limit) {
            eMda.classList.add("warning");
        } else {
            eMda.classList.remove("warning");
        }
        eMda.innerText = mda;
        eTrigger.innerText = trigger;
    }

}


})();
