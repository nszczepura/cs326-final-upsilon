async function renderChart(obj, walletid) {
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
            if (someJSON[i]['walletid'] === walletid) {
                data.push(someJSON[i]['walletbalance']);
            }
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
                label: 'objective',
                borderColor: 'rgb(255, 142, 0)',
                data: obj
            },
            {
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
    const reqs = ['/largestPercentWinner', '/avgWinner', '/avgLoser', 
    '/largestPercentWinner', '/largestPercentWinner', '/largestPercentWinner',
     '/largestPercentLoser', '/largestDollarWinner', '/largestDollarLoser', '/sumFeesPaid'];

     for(let i = 0; i < 10; ++i){
        const r1 = await fetch(reqs[i]).catch(function (error) {
            alert(error);
        });
        if (r1.ok) {
            const someJSON = await r1.json();
            console.log(someJSON[0]['result']);
            document.getElementById("" + i).innerText = someJSON[0]['result'];
        } else {
            console.error("Could not retrieve the trades from the server.");
        }
     }

    

}

function chart_objective() {
    const start_cap = document.getElementById('starting-capital').value;
    const gain = document.getElementById('percent-gain').value;
    const steps = document.getElementById('number-of-trades').value;
    let obj_list = [parseInt(start_cap)];
    for (let i = 1; i < steps; i++) {
        obj_list.push(parseInt(obj_list[i - 1]) + (parseInt(obj_list[i - 1]) * (parseFloat(gain) * 0.01)));
    }
    return obj_list;
}

setStats();

window.addEventListener("load", async function () {
    const start_cap = document.getElementById('starting-capital').defaultValue = 500000;
    const gain = document.getElementById('percent-gain').defaultValue = 2;
    const steps = document.getElementById('number-of-trades').defaultValue = 37;
    document.getElementById('walletid').defaultValue = 'test';
    renderChart(chart_objective(), 'test');
    renderChart2('p1', 'winLoss', ['Wins', 'Losses']);
    renderChart2('p2', 'gainsLosses', ['Total Gained', 'Total Lost']);
    renderChart2('p3', 'bestGainWorstLoss', ['Best Gain', 'Worst Loss']);
    renderChart2('p4', 'avgGainLoss', ['Average Gained', 'Average Lost']);
});

document.getElementById('load_obj').addEventListener('click', () => {
    renderChart(chart_objective(), document.getElementById('walletid').value);
});

document.getElementById('load_stats').addEventListener('click', () => {
    renderChart(chart_objective(), document.getElementById('walletid').value);
});
