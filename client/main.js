async function renderChart() {
    const labels = [];
    const data = [];
    const response = await fetch('/walletHistory')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        // console.log(someJSON);
        for (let i = 0; i < someJSON.length; ++i) {
            labels.push("" + i);
            data.push(someJSON[i]['walletbalance']);
        }
        console.log(data);
    } else {
        console.error("Could not retrieve the wallet from the server.");
    }
    const chartID = document.getElementById('portfolio').getContext('2d');
    const chart = new Chart(chartID, {
        type: 'line',

        data: {
            labels: labels,
            // labels: ['test1', 'test2', 'test3', 'test4', 'test5'],
            datasets: [{
                label: 'chart test',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                // data: [0, 10, 5, 2, -5]
                data: data
            }]
        },
        options: {}
    });
}

async function renderChart2(id) {
    const labels = [];
    const data = [];
    const response = await fetch('/winLoss')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        // console.log(someJSON);
        for (let i = 0; i < someJSON.length; ++i) {
            labels.push("" + i);
            data.push(someJSON[i]['count']);
        }
        console.log(data);
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
                    label: "Wins",
                    backgroundColor: "green",
                    data: [data[0]]
                },
                {
                    label: "Losses",
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

function renderPie() {
    const chartID = document.getElementById('pie').getContext('2d');
    const chart = new Chart(chartID, {
        type: 'pie',

        data: {
            labels: ['SPDR S&P 500 ETF Trust', 'Tesla Inc', 'Apple Inc', 'Ford Motor Company', 'Clear Channel Outdoor Holdings Inc'],
            datasets: [{
                label: 'pie test',
                backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850"],
                // borderColor: 'rgb(255, 99, 132)',
                data: [15, 5, 4, 3, 2]
            }]
        },
        options: {
            legend: {
                display: false
            }
        }
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
        for (let i = 0; i < 4; ++i) {
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
        for (let i = 0; i < 12; ++i) {
            const ele = document.getElementById("" + i);
            ele.innerText = someJSON[i].quantity;
        }
    } else {
        console.error("Could not retrieve the trades from the server.");
    }

}

setStats();

window.addEventListener("load", async function () {
    renderChart();
    renderChart2('p1');
    renderChart2('p2');
    renderChart2('p3');
    renderChart2('p4');
    renderPie();
});