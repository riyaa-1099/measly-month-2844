import { back_url } from "./url.js";

    document.querySelector("#form").addEventListener("submit",formsubmit)


async function formsubmit(event){
    event.preventDefault()

   let body={
       email:form.email.value,
        name:form.firstname.value,
       password:form.password.value,
    };
  
    const reg_api = `${back_url}/user/signup`;
    const res = await fetch(reg_api, {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    alert(JSON.stringify(data.msg))
    window.location.href="index.html"
    console.log("data",data);
  };
