(function() {

// Manually update these values. meter 98 is the well counter.
const date = '6/3/25'
const efficiencies = [
    [`I-131 (#98) ${date}`, 41],
    [`Tc-99m (#98) ${date}`, 94],
    [`Lu-177 (#98) ${date}`, 93],
    [`F-18 (#98) ${date}`, 35],
    [`I-123 (#98) ${date}`, 86],
];

const form = document.getElementById('form');
const eEff = document.getElementById('eff');
const eBkg = document.getElementById('bkg');
const eLimit = document.getElementById('limit');
const eTime = document.getElementById('time');
const eTimeBkg = document.getElementById('bkg-time')
const eMda = document.getElementById('mda');
const eTrigger = document.getElementById('trigger-level');
const eEffSelector = document.getElementById('eff-select');
const eCalDate = document.getElementById('cal-date');
const eLimitSelector = document.getElementById('limit-select')
const eMdaOptionSelector = form.elements["mda-select"];
const eMdaSameEqn = document.getElementById('mda-same-equation')
const eMdaDifferentEqn = document.getElementById('mda-different-equation')

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
    const bkg_time = parseFloat(eTimeBkg.value);

    // only calculate when all are filled
    if ([eff, bkg, time, limit].reduce((t, v) => {return t && !Number.isNaN(v)}, true)) {
        // check  MDA calculation option
        let mda, trigger
        if(eMdaOptionSelector.value === "same") {
            mda = Math.ceil((2.71 + 4.66 * Math.sqrt(bkg)) / (eff * time));
            trigger = Math.floor(limit * eff * time + bkg);
        } else if(eMdaOptionSelector.value === "different") {
            mda = Math.ceil(((2.71 + 3.29 * Math.sqrt(bkg/bkg_time * time * (1 + time/bkg_time)))/ (eff * time)));
            trigger = Math.floor(limit * time * eff + bkg/bkg_time*time);
        }
        displayText(mda, trigger);
    } else {
        displayText('??', '??');
    }
}

function displayText(mda, trigger) {
    // update MDA equation to match selected option
    if(eMdaOptionSelector.value === "same") {
        eMdaSameEqn.style.display = "block";
        eMdaDifferentEqn.style.display = "none";
    } else if(eMdaOptionSelector.value === "different") {
        eMdaDifferentEqn.style.display = "block";
        eMdaSameEqn.style.display = "none";
    }
    eMda.innerText = mda;
    eTrigger.innerText = trigger;
    
    // indicate when mda is too high (over trigger)
    if (mda > parseInt(eLimit.value)) {
        eMda.classList.add('text-danger');
    } else {
        eMda.classList.remove('text-danger');
    }
}

})();
