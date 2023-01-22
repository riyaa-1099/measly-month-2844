let addedParamCount = 0;
let addedHeaderCount = 0;
let token1 = localStorage.getItem("token");
import { back_url } from "./url.js";

//utility function to get dom element from string
function getElementfromString(string) {
  let div = document.createElement("div");
  div.innerHTML = string;
  return div.firstElementChild;
}

//----------------------------logout feature---------------------------------------

document.getElementById("logoutbtn").addEventListener("click",async function(){
  try {
    let res = await fetch(`${back_url}/user/logout`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token1}`,
        "Content-Type": "application/json",
      },
    });
    let data = await res.json();
    console.log(data);
    alert("User logged out successfully! Login again to use")
    location.reload();
  } 
  catch (err) {
    console.log("something wrong");
    console.log(err);
  }

})

//hide the parameters headers box initially

let parametersBox = document.getElementById("parametersBox");
let headersBox = document.getElementById("headersBox");
parametersBox.style.display = "none";
headersBox.style.display = "none";

//if clicked on param box, hide json headers and show params

let paramsRadio = document.getElementById("paramsRadio");
paramsRadio.addEventListener("click", () => {
  document.getElementById("requestJsonBox").style.display = "none";
  document.getElementById("headersBox").style.display = "none";
  document.getElementById("parametersBox").style.display = "block";
});

//if clicked on json box, hide params headers and show json

let jsonRadio = document.getElementById("jsonRadio");
jsonRadio.addEventListener("click", () => {
  document.getElementById("requestJsonBox").style.display = "block";
  document.getElementById("parametersBox").style.display = "none";
  document.getElementById("headersBox").style.display = "none";
});
//if clicked on header box, hide params and json

let headerRadio = document.getElementById("headersRadio");
headerRadio.addEventListener("click", () => {
  document.getElementById("requestJsonBox").style.display = "none";
  document.getElementById("parametersBox").style.display = "none";
  document.getElementById("headersBox").style.display = "block";
});

//if user clicks on + button

let addParam = document.getElementById("parambtn");
addParam.addEventListener("click", () => {
  let params = document.getElementById("params");
  let string = `<div class="row my-2">
<label for="url" class="col-sm-2 col-form-label">Parameter</label>
<div class="col-md-4">
    <input type="text" class="form-control" placeholder="Enter Parameter Key" id="parameterKey${
      addedParamCount + 2
    }" />
</div>
<div class="col-md-4">
    <input type="text" class="form-control" placeholder="Enter Parameter Value"
        id="parameterValue${addedParamCount + 2}" />
</div>

<button class="col-sm-1 btn btn-primary deleteParam">-</button>

</div>`;
  //converted element string to dom node
  let paramElement = getElementfromString(string);
  params.appendChild(paramElement);

  //add eventlistener to remove on clicking - button
  let deleteParam = document.getElementsByClassName("deleteParam");
  for (item of deleteParam) {
    item.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
  }

  addedParamCount++;
});

let addHeader = document.getElementById("headerbtn");
addHeader.addEventListener("click", () => {
  let headers = document.getElementById("headers");
  let string = `<div class="row my-2">
<label for="url" class="col-sm-2 col-form-label">Headers</label>
<div class="col-md-4">
    <input type="text" class="form-control" placeholder="Enter Key" id="headerKey${
      addedHeaderCount + 2
    }" />
</div>
<div class="col-md-4">
    <input type="text" class="form-control" placeholder="Enter Value"
        id="headerValue${addedHeaderCount + 2}" />
</div>

<button class="col-sm-1 btn btn-primary deleteHeader">-</button>

</div>`;
  //converted element string to dom node
  let headerElement = getElementfromString(string);
  headers.appendChild(headerElement);

  //add eventlistener to remove on clicking - button
  let deleteHeader = document.getElementsByClassName("deleteHeader");
  for (item of deleteHeader) {
    item.addEventListener("click", (e) => {
      e.target.parentElement.remove();
    });
  }

  addedHeaderCount++;
});

//if user clicks on submit------------------function starts here!!------------------------------>

let submit = document.getElementById("submit");

submit.addEventListener("click", async () => {
  //show please wait in response box
  document.getElementById("responseJsonText").innerHTML =
    "Please wait.... fetching request";

  //fetch all the values user has entered
  let url = document.getElementById("urlField").value;
  let method = document.querySelector("[data-method]").value;
  // let contentType=document.querySelector("input[name='contentType']:checked").value;

  //if user has used params option instead of json, collect all in object
  let params = {};
  for (let i = 0; i < addedParamCount + 1; i++) {
    if (document.getElementById("parameterKey" + (i + 1)) != undefined) {
      let key = document.getElementById("parameterKey" + (i + 1)).value;
      let value = document.getElementById("parameterValue" + (i + 1)).value;
      params[key] = value;
    }
  }
  // params2=JSON.stringify(params);

  let body = document.getElementById("requestJsonText").value;

  let headers = {};
  for (let i = 0; i < addedHeaderCount + 1; i++) {
    if (document.getElementById("headerKey" + (i + 1)) != undefined) {
      let key = document.getElementById("headerKey" + (i + 1)).value;
      let value = document.getElementById("headerValue" + (i + 1)).value;
      headers[key] = value;
    }
  }

  if (!url) {
    // setErrorMsg('Request URL is empty!');
    alert("Please enter url")
    return console.log("url not entered");
  }
  //log all values in console for debugging
  // console.log("url is", url);
  // console.log("request type:", method);
  // console.log("datap", params);
  // console.log("datah", headers);
  // console.log("body", body);

  let requestUrl = url;
  if (method === "GET" || method === "DELETE") {
    if (Object.keys(params).length !== 0) {
      for (let k in params) {
        if (k == "") {
          delete params[k];
        }
      }
      const queryString = new URLSearchParams(params).toString();
      requestUrl = `${url}?${queryString}`;
    }
  }
  let options = {
    method: method,
  };
  if (Object.keys(headers).length !== 0) {
    options.headers = headers;
  }
  if (method === "POST" || method === "PUT") {
    if (Object.keys(body).length !== 0) {
      if (checkValidJson(body)===false) {
        // setErrorMsg('Text is not valid json');
        alert("Enter valid json format input")
        return console.log("error not valid json");
      }

      options.body = body;
    }
  }
  const startTime = performance.now();
  try {
    for (let k in options.headers) {
      if (k == "") {
        delete options.headers[k];
      }
    }
// console.log(options)

    let response = await fetch(requestUrl, options);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    const status = response.status;
  
    let data2 =await response.text();
    const size = JSON.stringify(data2).length 

    // console.log(requestUrl, options, data2);
    //--------------------------------------Saving queries------------------------------------->
   
    const history_save = `${back_url}/query/history`;
  
 const res = await fetch(history_save, {
        method: 'POST',
        headers: {Authorization: `Bearer ${token1}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url,method,params,headers})
    });
    const data = await res.json();
    console.log(data);


    document.getElementById("responseJsonText").innerHTML = (data2);
    Prism.highlightAll();
    updateResponseDetails(status, timeTaken.toFixed(2), size);

  }
   catch (err) {
    console.error(err);
  }
});

//updating time, status, size----------------------------------------------------->
function updateResponseDetails(status, timeTaken, size) {
  document.querySelector("[data-status]").textContent = status;
  document.querySelector("[data-time]").textContent = timeTaken;
  document.querySelector("[data-size]").textContent = `${size} bytes`;
}


//checking valid json function----------------------------------------------------->
const checkValidJson = (text) => {
  if (
    /^[\],:{}\s]*$/.test(
      text
        .replace(/\\["\\\/bfnrtu]/g, "@")
        .replace(
          /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
          "]"
        )
        .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
    )
  ) {
    return true;
  } else {
    return false;
  }
};


//history---------------------------------------------------------->
const history_api = `${back_url}/query/showhistory`;

const getLastFiveQueries = async () => {
  const res = await fetch(history_api,{
    method: "GET",
    headers: { Authorization: `Bearer ${token1}`,
     "Content-Type": "application/json" },
  });
  const data = await res.json();

  const tableBody = document.getElementById('query-table-body');
  console.log(data)
  data.forEach(query => {

      const urlCell = document.createElement('p');
      // urlCell.setAttribute("class", "clickquery");
      urlCell.innerHTML = query.url;
urlCell.addEventListener("click",()=>{

  document.getElementById("urlField").value = query.url;

  // document.getElementById("parameterKey1").value = JSON.stringify(query.params);
  // document.getElementById("parameterValue1").value = JSON.stringify(headers);

  let select = document.querySelector("[data-method]");

  // Loop through the options
  for (let i = 0; i < select.options.length; i++) {
    // Check if the option value matches the received method
    if (select.options[i].value === query.method) {
      // Set the selected option
      select.options[i].selected = true;
      break;
    }
  }

})
      tableBody.appendChild(urlCell);
  });
}


//-------------------------checking token-------------------------//

// check for the token in the blacklist
checkTokenInBlacklist(token1)

async function checkTokenInBlacklist(token)  {

  // check for the presence of the token in local storage
  if(!token) return alert("Login please to continue!")

  const api = `${back_url}/user/blacklist`;
  try {
    const response = await fetch(api,{
      method: 'POST',
      body: JSON.stringify({ token }),
      headers: { 'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, },
    });
    const data = await response.json();

    if(data.isBlacklisted==="true"){
  
    document.getElementById("showname").innerHTML="Please Login!"
  }
  else if(data.isBlacklisted==="false"){

    getLastFiveQueries();
  }
  } catch (error) {
    console.error(error);
  }
}




let queryevent = document.getElementsByClassName("clickquery");
  for (item of queryevent) {
    item.addEventListener("click", (e) => {



    });
  }