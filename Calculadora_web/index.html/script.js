const display = document.getElementById('display');
const buttons = document.getElementById('buttons');
const historyList = document.getElementById('historyList');

let current = '';
let lastResult = null;
let history = [];


const formatForEval = (s) => s.replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/');

const formatForDisplay = (n) => {
    if (Number.isFinite(n)) {
        return (Math.round((n + Number.EPSILON) * 1e12) / 1e12)
            .toString()
            .replace('.', ',');
    }
    return String(n);
};


function renderDisplay() {
    display.textContent = current === '' ? '0' : current;
}


function addHistoryItem(expr, result) {
    history.unshift({ expr, result });
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = '';
    history.forEach((it, idx) => {
        const li = document.createElement('li');
        li.innerHTML = `<div>${it.expr} = <strong>${formatForDisplay(it.result)}</strong></div><small>#${idx + 1}</small>`;
        li.title = 'Clique para usar o resultado';
        li.addEventListener('click', () => {
            current = formatForDisplay(it.result);
            renderDisplay();
        });
        historyList.appendChild(li);
    });
}


function clearAll() {
    current = '';
    renderDisplay();
}


function backspace() {
    if (current.length > 0) {
        current = current.slice(0, -1);
        renderDisplay();
    }
}

function handlePercent() {
    if (current === '') return;
    try {
        const val = parseFloat(formatForEval(current));
        if (!isNaN(val)) {
            current = formatForDisplay(val / 100);
            renderDisplay();
        }
    } catch (e) { }
}


function calculate() {
    if (current === '') return;

    try {
        const expr = formatForEval(current);
        const result = eval(expr);

        if (Number.isFinite(result)) {
            addHistoryItem(current, result);
            current = formatForDisplay(result);
        } else {
            current = "Erro";
        }
    } catch {
        current = "Erro";
    }

    renderDisplay();
}


buttons.addEventListener('click', (e) => {
    const btn = e.target;
    if (!btn.classList.contains('btn')) return;

    if (btn.dataset.num) {
        current += btn.dataset.num;
        renderDisplay();
        return;
    }

    if (btn.dataset.op) {
        const op = btn.dataset.op;
        current += op;
        renderDisplay();
        return;
    }

    switch (btn.dataset.action) {
        case "clear":
            clearAll();
            break;

        case "back":
            backspace();
            break;

        case "percent":
            handlePercent();
            break;

        case "equals":
            calculate();
            break;
    }
});
