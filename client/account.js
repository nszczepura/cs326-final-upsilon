
//
async function login() {}

async function gotoRegister() {
    location.href = "register.html";
}

async function register() {}

async function cancel() {
    location.href = "account.html";
}

// async function register() {
//     const user = document.getElementById('userID').value;
//     const password = document.getElementById('userPW').value;
//     // const exchange = document.getElementById('exchange').value;
//     // console.log(user + ' - ' + password + ' - ' + exchange);
//     console.log(user + ' - ' + password);
//     const response = await fetch('/register', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             name: user,
//             password: password
//         })
//     }).catch(function (error) {
//         alert(error);
//     });
//     if (!response.ok) {
//         console.error("Could not send the credentials to the server.");
//     }
// }

window.addEventListener("load", function() {
    document.getElementById('loginBtn').addEventListener('click', login);
});

window.addEventListener("load", function() {
    document.getElementById('registerBtn1').addEventListener('click', gotoRegister);
});
window.addEventListener("load", function() {
    document.getElementById('registerBtn2').addEventListener('click', register);
});

window.addEventListener("load", function() {
    document.getElementById('cancelReg').addEventListener('click', cancel);
});