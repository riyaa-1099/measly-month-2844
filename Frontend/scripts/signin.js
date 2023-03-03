import { back_url } from "./url.js";
document.querySelector("#form").addEventListener("submit",myfunction)
   
  async function myfunction(event){
       event.preventDefault()
     let body={
       
        email:form.email.value,
        password:form.password.value,
        
       }; 

       const login_api = `${back_url}/user/login`;
const res = await fetch(login_api, {
  method: "POST",
  body: JSON.stringify(body),
  headers: { "Content-Type": "application/json" },
});
const data = await res.json();
localStorage.setItem("token", data.token);
   localStorage.setItem("refreshToken", data.refreshToken);

         window.location.href="index.html"
 console.log(data)
   }