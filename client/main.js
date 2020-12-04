async function renderChart() {
    const labels = [];
    const data = [];
    const response = await fetch('/walletHistory')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        for (let i = 0; i < someJSON.length; ++i) {
            labels.push("" + i);
            data.push(someJSON[i]['walletbalance']);
        }
    } else {
        console.error("Could not retrieve the wallet from the server.");
    }
    const chartID = document.getElementById('portfolio').getContext('2d');
    const chart = new Chart(chartID, {
        type: 'line',

        data: {
            labels: labels,
            datasets: [{
                label: 'chart test',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data
            }]
        },
        options: {
            legend: {
                display: false
            }
        }
    });
}

async function renderChart2(id, resource, labels) {
    const data = [];
    const response = await fetch(`/${resource}`)
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        data.push(someJSON[0]['first']);
        data.push(someJSON[0]['second']);
    } else {
        console.error("Could not retrieve the wallet from the server.");
    }
    const chartID = document.getElementById(id).getContext('2d');
    const chart = new Chart(chartID, {
        type: 'bar',

        data: {
            labels: [""],
            datasets: [

                {
                    label: labels[0],
                    backgroundColor: "green",
                    data: [data[0]]
                },
                {
                    label: labels[1],
                    backgroundColor: "red",
                    data: [data[1]]
                }
            ]
        },
        options: {
            scales: {
                xAxes: [{
                    display: false,
                    barPercentage: 1,
                    ticks: {
                        max: 3,
                    }
                }, {
                    display: true,
                    ticks: {
                        autoSkip: false,
                        max: 4,
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    });
}

async function setStats() {
    const data = [];
    const response = await fetch('/tradeHistory')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        for(const i in someJSON){
            data.push(someJSON[i]);
        }
    } else {
        console.error("Could not retrieve the trades from the server.");
    }
    console.log(data[0]);
    let pnlTotal = 0;
    data.forEach(a => pnlTotal += a['pnl'] * 10000);
    document.getElementById("" + 11).innerText = pnlTotal;
    console.log(pnlTotal);
}

setStats();

window.addEventListener("load", async function () {
    renderChart();
    renderChart2('p1', 'winLoss', ['Wins', 'Losses']);
    renderChart2('p2', 'gainsLosses', ['Total Gained', 'Total Lost']);
    renderChart2('p3', 'bestGainWorstLoss', ['Best Gain', 'Worst Loss']);
    renderChart2('p4', 'avgGainLoss', ['Average Gained', 'Average Lost']);
});