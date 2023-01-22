let addedParamCount = 0;
let addedHeaderCount = 0;

import { back_url } from "./url.js";
//utility function to get dom element from string
function getElementfromString(string) {
  let div = document.createElement("div");
  div.innerHTML = string;
  return div.firstElementChild;
}

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

//if user clicks on submit------------------function starts here!!---------------------------------------------->

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
    return console.log("url not entered");
  }
  //log all values in console for debugging
  console.log("url is", url);
  console.log("request type:", method);
  console.log("datap", params);
  console.log("datah", headers);
  console.log("body", body);

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

    let response = await fetch(requestUrl, options);
    const endTime = performance.now();
    const timeTaken = endTime - startTime;
    const status = response.status;
  
    let data2 =await response.text();
    
    
    const size = JSON.stringify(data2).length 
    console.log(size);

    console.log(requestUrl, options, data2);
    document.getElementById("responseJsonText").innerHTML = (data2);
    Prism.highlightAll();
    updateResponseDetails(status, timeTaken.toFixed(2), size);
  } catch (err) {
    console.error(err);
  }
});

function updateResponseDetails(status, timeTaken, size) {
  document.querySelector("[data-status]").textContent = status;
  document.querySelector("[data-time]").textContent = timeTaken;
  document.querySelector("[data-size]").textContent = `${size} bytes`;
}

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
  const res = await fetch(history_api);
  const data = await res.json();
  console.log(data)
  const tableBody = document.getElementById('query-table-body');
  data.forEach(query => {
      const row = document.createElement('tr');
      const userIdCell = document.createElement('td');
      userIdCell.innerHTML = query.userId;
      const urlCell = document.createElement('td');
      urlCell.innerHTML = query.url;
      const methodCell = document.createElement('td');
      methodCell.innerHTML = query.method;
      const headersCell = document.createElement('td');
      headersCell.innerHTML = JSON.stringify(query.headers);
      const paramsCell = document.createElement('td');
      paramsCell.innerHTML = JSON.stringify(query.params);
      const dateCell = document.createElement('td');
      dateCell.innerHTML = query.date;
      row.appendChild(userIdCell);
      row.appendChild(urlCell);
      row.appendChild(methodCell);
      row.appendChild(headersCell);
      row.appendChild(paramsCell);
      row.appendChild(dateCell);
      tableBody.appendChild(row);
  });
}
getLastFiveQueries();