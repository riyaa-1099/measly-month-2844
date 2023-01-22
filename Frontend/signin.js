let h3=document.getElementById("h3")
let p=document.getElementById("warn")
let signin=document.getElementById("sign")

 signin.onclick=()=>{
    
   h3.innerText="Sign in successfully!"
    
}



const togglePassword = document.querySelector('#togglePassword');
  const password = document.getElementById("credential");

  togglePassword.addEventListener('click', function (e) {
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
});
