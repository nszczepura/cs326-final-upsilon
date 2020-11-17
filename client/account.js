
//
async function register() {
    const user = document.getElementById('userID').value;
    const password = document.getElementById('userPW').value;
    // const exchange = document.getElementById('exchange').value;
    // console.log(user + ' - ' + password + ' - ' + exchange);
    console.log(user + ' - ' + password);
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: user,
            password: password
        })
    }).catch(function (error) {
        alert(error);
    });
    if (!response.ok) {
        console.error("Could not send the credentials to the server.");
    }
}

window.addEventListener("load", function() {
    document.getElementById('registerBtn').addEventListener('click', register);
});