
let text = "";

async function textToDownload() {
    text = document.getElementById('personalnotes').value;

    text += "\n\nYour Trade History\n##########################################################\n\n";

    const response = await fetch('/tradeHistory')
        .catch(function (error) {
            alert(error);
        });
    if (response.ok) {
        const someJSON = await response.json();
        someJSON.forEach(row => {
            let line = "";
            Object.values(row).forEach(value => {
                line += value + ", ";
            });

            text += line.slice(0, -2) + '\n';
        });

    } else {
        console.error("Could not retrieve the trades from the server.");
    }

    const textBlob = new Blob([text], { type: "text/plain" });
    const textUrl = window.URL.createObjectURL(textBlob);
    const fileName = "notes.txt";

    const downloadLink = document.createElement("a");
    downloadLink.download = fileName;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textUrl;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);

    downloadLink.click();
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

window.addEventListener("load", function () {
    document.getElementById('downloadBtn').addEventListener('click', textToDownload);
});