window.addEventListener('load', function() { 
    console.log('loaded');
    if(typeof  error !== 'undefined') {
        console.log(error);
    }
})
// let signupForm = document.getElementById("signupForm");

// signupForm.addEventListener("submit", function(evt) {
//     evt.preventDefault();

//     let firstName = document.getElementById("firstName").value;
//     let lastName = document.getElementById("lastName").value;
//     let username = document.getElementById("username").value;
//     let email = document.getElementById("email").value;
//     let password = document.getElementById("password").value;
//     let confirmPassword = document.getElementById("confirmPassword").value;

//     let userInfos = {
//         firstName,
//         lastName,
//         username,
//         email,
//         password,
//         confirmPassword
//     }

//     axios.post('http://localhost:3000/signup', userInfos)
//     .then(res => console.log(res))
//     .catch(err => console.error(err));


//     // console.log(firstName);
//     // console.log(lastName);
//     // console.log(username);
//     // console.log(email);
// })