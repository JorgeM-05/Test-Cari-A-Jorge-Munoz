document.addEventListener('DOMContentLoaded', function () {
    M.AutoInit();
    if (!loadConceptsFromCache()) {
        preloadConcepts();
    }
    initTimePickers();
});

const attendanceForm = document.getElementById('attendance-form');
const conceptsTable = document.getElementById('concepts-table');
const addConceptButton = document.getElementById('add-concept');
const resultsTable = document.getElementById('results-table');
const resultsChartCanvas = document.getElementById('results-chart');

let concepts = [];
let currentChart = null;
function initTimePickers() {
    const timePickers = document.querySelectorAll('.timepicker');
    M.Timepicker.init(timePickers, {
        twelveHour: true
    });
}
function preloadConcepts() {
    const predefinedConcepts = [
        { id: "HO", name: "HO", start: "08:00", end: "17:59" },
        { id: "HED", name: "HED", start: "18:00", end: "20:59" },
        { id: "HEN", name: "HEN", start: "21:00", end: "05:59" }
    ];
    predefinedConcepts.forEach(concept => addConceptRow(concept));
}

addConceptButton.addEventListener('click', () => {
    addConceptRow();
});

function addConceptRow(concept = { id: '', name: '', start: '', end: '' }) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" placeholder="Nombre" value="${concept.name}" required></td>
        <td><input type="text" class="timepicker" value="${concept.start}" required></td>
        <td><input type="text" class="timepicker" value="${concept.end}" required></td>
        <td><button type="button" class="btn red remove-concept"><i class="material-icons">delete</i></td>
    `;
    conceptsTable.appendChild(newRow);

    M.Autocomplete.init(newRow.querySelectorAll('.autocomplete'), {
        data: {
            "HO": null,
            "HED": null,
            "HEN": null
        }
    });

    M.Timepicker.init(newRow.querySelectorAll('.timepicker'), {
        twelveHour: false
    });

    newRow.querySelector('.remove-concept').addEventListener('click', () => {
        newRow.remove();
    });

    
}

attendanceForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const attendanceIn = document.getElementById('attendanceIn').value;
    const attendanceOut = document.getElementById('attendanceOut').value;

    concepts = [];
    conceptsTable.querySelectorAll('tr').forEach(row => {
        const inputs = row.querySelectorAll('input');
        if (inputs.length === 3) {
            concepts.push({
                id: inputs[0].value,
                name: inputs[0].value,
                start: inputs[1].value,
                end: inputs[2].value
            });
        }
    });

    saveConceptsToCache(concepts);

    if (!attendanceIn || !attendanceOut || concepts.length === 0) {
        M.toast({ html: 'Por favor, complete todos los campos' });
        return;
    }

    try {
        const response = await fetch('https://falconcloud.co/site_srv10_ph/site/api/qserv.php/13465-770721', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attendanceIn,
                attendanceOut,
                concepts
            })
        });

        const data = await response.json();

        displayResults(data);
    } catch (error) {
        M.toast({ html: 'Error al conectar con el servicio REST' });
    }
});

function displayResults(data) {
    resultsTable.innerHTML = '';

    const labels = [];
    const values = [];

    for (const [concept, hours] of Object.entries(data)) {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${concept}</td><td>${hours}</td>`;
        resultsTable.appendChild(row);

        labels.push(concept);
        values.push(hours);
    }

    renderChart(labels, values);
}

function renderChart(labels, values) {
    if (currentChart) {
        currentChart.destroy();
    }

    currentChart = new Chart(resultsChartCanvas, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ['#4caf50', '#2196f3', '#ff5722', '#ffc107']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                }
            }
        }
    });
}
function saveConceptsToCache(concepts) {
    localStorage.setItem('cachedConcepts', JSON.stringify(concepts));
}

function loadConceptsFromCache() {
    const cachedConcepts = localStorage.getItem('cachedConcepts');
    if (cachedConcepts) {
        concepts = JSON.parse(cachedConcepts);
        concepts.forEach(concept => addConceptRow(concept));
        return true;
    }
    return false;
}
