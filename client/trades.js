
async function renderTable() {
    const response = await fetch('/tradeHistory')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        while (document.getElementById("table-of-trades").rows.length > 1) {
            document.getElementById("table-of-trades").deleteRow(1);
        }
        someJSON.forEach(row => {
            const entry = document.getElementById("table-of-trades").insertRow(-1);
            Object.values(row).forEach(value => {
                const cell = entry.insertCell(-1);
                cell.innerText = value;
            });
        });
    } else {
        console.error("Could not retrieve the trades from the server.");
    }

}

renderTable();