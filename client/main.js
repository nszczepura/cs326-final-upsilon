console.log("Accessed main.js");

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