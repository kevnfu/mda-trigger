(function() {

// Manually update these values. meter 98 is the well counter.
const efficiencies = [
    ['I-131 (#98) 1/26/24', 23],
    ['Tc-99m (#98) 1/26/24', 92],
    ['Lu-177 (#98) 1/26/24', 91],
    ['F-18 (#98) 1/26/24', 35],
    ['I-123 (#98) 1/26/24', 84],
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
const eLimitSelector = document.getElementById('limit-select')

// Update Cal Date
eCalDate.textContent = 'Efficiencies: ';

// Create options from efficiencies
for (efficiency of efficiencies) {
    let opt = document.createElement('option');
    [opt.text, opt.value] = efficiency;
    eEffSelector.appendChild(opt);
}

// change efficiency value when item is selected
eEffSelector.addEventListener('change', (e) => {
    eEff.value = eEffSelector.value;
});

eLimitSelector.addEventListener('change', (e) => {
    eLimit.value = eLimitSelector.value;
});

// recalculate when something is changed
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

    // only calculate when all are filled
    if ([eff, bkg, time, limit].reduce((t, v) => {return t && !Number.isNaN(v)}, true)) {
        let mda = Math.ceil((2.71 + 4.66 * Math.sqrt(bkg)) / (eff * time));
        let trigger = Math.floor(limit * eff * time + bkg);

        displayText(mda, trigger);
    } else {
        displayText('??', '??');
    }
}

function displayText(mda, trigger) {
    eMda.innerText = mda;

    // indicate when mda is too high (over trigger)
    if (mda > parseInt(eLimit.value)) {
        eMda.classList.add('text-danger');
    } else {
        eMda.classList.remove('text-danger');
    }

    eTrigger.innerText = trigger;
}

})();
