

// csv loading using example from
// https://blog.mounirmesselmeni.de/2012/11/20/reading-csv-file-with-javascript-and-html5-file-api/

async function postRequest(data, url) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}


async function getAsText(fileToRead) {
  const reader = new FileReader();
  // Read file into memory as UTF-8      
  reader.readAsText(fileToRead);
  // Handle errors load
  reader.onload = loadHandler;
  reader.onerror = errorHandler;
}

function loadHandler(event) {
  const csv = event.target.result;
  processData(csv);
}

function processData(csv) {
  const allTextLines = csv.split(/\r\n|\n/);
  const lines = [];
  for (let i=0; i<allTextLines.length; i++) {
      const data = allTextLines[i].split(',');
          const tarr = [];
          for (let j=0; j<data.length; j++) {
              tarr.push(data[j]);
          }
          lines.push(tarr);
  }
  const wallet = document.getElementById('walletid').value;
  const send = {'data': lines, 'walletid': wallet};
  postRequest(send, 'http://localhost:8080/uploadcsv');
}

function errorHandler(evt) {
  if(evt.target.error.name === "NotReadableError") {
      alert("Cannot read file!");
  }
}
window.addEventListener("load", async function () {
  const inputCSV = document.getElementById('csvFile');
  inputCSV.addEventListener('change', handleFiles, false);
  function handleFiles() {
  // Check for the various File API support.
  if (window.FileReader) {
      // FileReader are supported.
      getAsText(this.files[0]);
  } else {
      alert('FileReader are not supported in this browser.');
  }
}
});