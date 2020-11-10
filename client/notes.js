
let text = "";

function textToDownload() {
    text = document.getElementById('personalnotes').value;
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

window.addEventListener("load", function() {
    document.getElementById('downloadBtn').addEventListener('click', textToDownload);
});