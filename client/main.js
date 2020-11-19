function renderChart() {
    const chartID = document.getElementById('portfolio').getContext('2d');
    const chart = new Chart(chartID, {
        type: 'line',

        data: {
            labels: ['test1', 'test2', 'test3', 'test4'],
            datasets: [{
                label: 'chart test',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: [0, 10, 5 ,2]
            }]
        },
        options: {}
    });
}

async function setObjective() {
    const response = await fetch('/tradeHistory')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        const docIds = ["starting-capital", "monthly-addition", "percent-gain", "compounded"];
        for(let i = 0; i < 4; ++i){
            const ele = document.getElementById(docIds[i]);
            ele.innerText = someJSON[i].quantity;
        }
    } else {
        console.error("Could not retrieve the data from the server.");
    }

}

setObjective();

async function setStats() {
    const response = await fetch('/tradeHistory')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        for(let i = 0; i < 12; ++i){
            const ele = document.getElementById(""+i);
            ele.innerText = someJSON[i].quantity;
        }
    } else {
        console.error("Could not retrieve the trades from the server.");
    }

}

setStats();

window.addEventListener("load", async function() {
    renderChart();
});