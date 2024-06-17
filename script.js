(function() {

// Manually update these values. meter 98 is the well counter.
const efficiencies = [
    ['I-131 (#98) 1/26/24', 41],
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
const eTimeBKG = document.getElementById('bkg-time')
const eMda1 = document.getElementById('mda1');
const eMda2 = document.getElementById('mda2');
const eTrigger = document.getElementById('trigger-level');
const eEffSelector = document.getElementById('eff-select');
const eCalDate = document.getElementById('cal-date');
const eLimitSelector = document.getElementById('limit-select')
const emdaOption = document.getElementById('mda-select')
const eMDAText = document.getElementById('MDA1text')
const eMDA2Text = document.getElementById('MDA2text')

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
    const bkg_time = parseFloat(eTimeBKG.value);

    // only calculate when all are filled, check for MDA calculation option
    if (emdaOption.value ==='Same BKG and Sample Count Time'  && 
        eff != ' ' &&
        bkg != ' ' &&
        limit != ' ' &&
        time != ' ') {
        let mda1 = Math.ceil((2.71 + 4.66 * Math.sqrt(bkg)) / (eff * time));
        let trigger = Math.floor(limit * eff * time + bkg);

        eMDAText.style.display = "block";
        eMDA2Text.style.display = "none";

        displayText(mda1, trigger);
        displayText2('??', trigger);
    } else if (emdaOption.value ==='Alternate BKG and Sample Count Time'  && 
        eff != ' ' &&
        bkg != ' ' &&
        limit != ' ' &&
        time != ' ' &&
        bkg_time != ' ') { 
        let mda2 = Math.ceil(((2.71 + 3.29 * Math.sqrt(bkg/bkg_time * time * (1 + time/bkg_time)))/ (eff * time)));
        let trigger = Math.floor(limit * time * eff + bkg/bkg_time*time);
        
        eMDA2Text.style.display = "block";
        eMDAText.style.display = "none";

        displayText2(mda2, trigger);
        displayText('??', trigger);
    } else {

        displayText('??', '??')
        displayText2('??', '??')
    }
    
}


function displayText(mda1, trigger) {
    eMda1.innerText = mda1;
    

    // indicate when mda is too high (over trigger)
    if (mda1 > parseInt(eLimit.value)) {
        eMda1.classList.add('text-danger');
    } else {
        eMda1.classList.remove('text-danger');
    }

    eTrigger.innerText = trigger;
}

function displayText2(mda2, trigger) {
    eMda2.innerText = mda2;
    
    // indicate when mda is too high (over trigger)
    if (mda2 > parseInt(eLimit.value)) {
        eMda2.classList.add('text-danger');
    } else {
        eMda2.classList.remove('text-danger');
    }

    eTrigger.innerText = trigger;
}

})();
