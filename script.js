(function() {

// Manually update these values. meter 98 is the well counter.
const calDate = "3/21/22"
const efficiencies = [
    ['Cs-137 (#98)', 33.72],
    ['Ba-133 (#98)', 91.87],
    ['Eu-152 (#98)', 77.15]
];

const form = document.getElementById('form');
const eEff = document.getElementById('eff');
const eBkg = document.getElementById('bkg');
const eLimit = document.getElementById('limit');
const eTime = document.getElementById('time');
const eMda = document.getElementById('mda');
const eTrigger = document.getElementById('trigger-level');
const eEffSelector = document.getElementById('eff-select');
const eCalDate = document.getElementById('cal-date');


// Update Cal Date
eCalDate.textContent = 'Known Efficiencies ' + calDate;

// Create options from efficiencies
for (efficiency of efficiencies) {
    let opt = document.createElement('option');
    [opt.text, opt.value] = efficiency;
    eEffSelector.appendChild(opt);
}

eEffSelector.addEventListener('change', (e) => {
    eEff.value = eEffSelector.options[eEffSelector.selectedIndex].value;
});

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

    // only calculate when all are empty
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
