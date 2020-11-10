
//
function register() {
    const user = document.getElementById('userID').value;
    const password = document.getElementById('userPW').value;
    const exchange = document.getElementById('exchange').value;
    // console.log(user + ' - ' + password + ' - ' + exchange);
    console.log(user + ' - ' + password);


}

window.addEventListener("load", function() {
    document.getElementById('registerBtn').addEventListener('click', register);
});