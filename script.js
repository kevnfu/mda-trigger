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
const eTimeBkg = document.getElementById('bkg-time');
const eTimeBkgDisplay = document.getElementById('bkg-time-display');
const eMda = document.getElementById('mda');
const eTrigger = document.getElementById('trigger-level');
const eEffSelector = document.getElementById('eff-select');
const eLimitSelector = document.getElementById('limit-select');
const eMdaOptionSelector = form.elements["mda-select"];
const eMdaSameEqn = document.getElementById('mda-same-equation');
const eMdaDifferentEqn = document.getElementById('mda-different-equation');
const eSaved = document.getElementById('saved-history');
const eSaveButton = document.getElementById('save-btn');

// update callibration info
for (efficiency of efficiencies) {
    let opt = document.createElement('option');
    [opt.text, opt.value] = efficiency;
    eEffSelector.appendChild(opt);
}

// listeners for efficiency and limit selectors
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
    const time = parseFloat(eTime.value);
    const bkg = parseInt(eBkg.value);
    const bkg_time = parseFloat(eTimeBkg.value);
    const limit = parseInt(eLimit.value);
    let mda, trigger;

    // only calculate and activate save button when all are filled
    if ([eff, bkg, time, limit].reduce((t, v) => {return t && !Number.isNaN(v)}, true)) {
        // check  MDA calculation option
        if(eMdaOptionSelector.value === "same") {
            mda = Math.ceil((2.71 + 4.66 * Math.sqrt(bkg)) / (eff * time));
            trigger = Math.floor(limit * eff * time + bkg);
        } else if(eMdaOptionSelector.value === "different") {
            mda = Math.ceil(((2.71 + 3.29 * Math.sqrt(bkg/bkg_time * time * (1 + time/bkg_time)))/ (eff * time)));
            trigger = Math.floor(limit * time * eff + bkg/bkg_time*time);
        }
        eSaveButton.disabled = false;
        displayText(mda, trigger);
    } else {
        eSaveButton.disabled = true;
        displayText('??', '??');
    }

    return [eff * 100, time, bkg_time, bkg, limit, mda, trigger];
}

function displayText(mda, trigger) {
    // update MDA equation to match selected option
    // display or hide bkg count input
    if(eMdaOptionSelector.value === "same") {
        eMdaSameEqn.style.display = "block";
        eMdaDifferentEqn.style.display = "none";
        eTimeBkgDisplay.style.display = "none";
    } else if(eMdaOptionSelector.value === "different") {
        eMdaDifferentEqn.style.display = "block";
        eMdaSameEqn.style.display = "none";
        eTimeBkgDisplay.style.display = "block";
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

function getHistory() {
    return JSON.parse(localStorage.getItem('history'));
}

function displayHistory() {
    // clear table
    eSaved.replaceChildren();

    let history = getHistory();
    for (const [i, event] of history.entries()) {
        let newRow = document.createElement('tr');
        for (const data of event) {
            let newData = document.createElement('td');
            newData.innerText = data;
            newRow.appendChild(newData);
        }
        // create delete button
        const deleteRowButton = document.createElement('button');
        deleteRowButton.className = 'btn btn-danger';
        // deleteRowButton.setAttribute('data-bs-toggle', 'button');
        // deleteRowButton.style = 'margin: .1rem';
        deleteRowButton.innerText = 'x';
        deleteRowButton.addEventListener('click', (e) => {
            e.preventDefault();
            deleteEntry(i);
        });
        newRow.appendChild(deleteRowButton);
        eSaved.appendChild(newRow);
    }
}

function setHistory(data) {
    localStorage.setItem('history', JSON.stringify(data));
    displayHistory();
}

function deleteEntry(row) {
    let history = getHistory();
    history.splice(row, 1);
    setHistory(history);
}

function deleteHistory() {
    setHistory();
}

// listener for save button
eSaveButton.addEventListener('click', (e) => {
    e.preventDefault();
    // get current date and current calculations
    let history = getHistory();
    let date = new Date().toLocaleDateString();
    let data = calculate();
    data.unshift(date);
    history.push(data);
    setHistory(history);
});

displayHistory();


})();
