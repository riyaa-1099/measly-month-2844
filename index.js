//initialize no of parameters
let addedParamCount=0;

//utility function to get dom element from string
function getElementfromString(string){
let div=document.createElement('div');
div.innerHTML=string;
return div.firstElementChild;
}



//hide the parameters box initially

let parametersBox=document.getElementById("parametersBox");
parametersBox.style.display='none';

//if clicked on param box, hide json and show params

let paramsRadio=document.getElementById("paramsRadio");
paramsRadio.addEventListener('click',()=>{
 document.getElementById("requestJsonBox").style.display='none';
 document.getElementById("parametersBox").style.display='block';

})

//if clicked on json box, hide params and show json

let jsonRadio=document.getElementById("jsonRadio");
jsonRadio.addEventListener('click',()=>{
 document.getElementById("requestJsonBox").style.display='block';
 document.getElementById("parametersBox").style.display='none';

})

//if user clicks on + button

let addParam=document.getElementById("parambtn");
addParam.addEventListener('click',()=>{
let params=document.getElementById("params");
let string=`<div class="row my-2">
<label for="url" class="col-sm-2 col-form-label">Parameter ${addedParamCount + 2}</label>
<div class="col-md-4">
    <input type="text" class="form-control" placeholder="Enter Parameter ${addedParamCount + 2} Key" id="parameterKey${addedParamCount + 2}" />
</div>
<div class="col-md-4">
    <input type="text" class="form-control" placeholder="Enter Parameter ${addedParamCount + 2} Value"
        id="parameterValue${addedParamCount + 2}" />
</div>

<button class="col-sm-1 btn btn-primary deleteParam">-</button>

</div>`;
//converted element string to dom node
let paramElement=getElementfromString(string)
params.appendChild(paramElement)

//add eventlistener to remove on clicking - button
let deleteParam=document.getElementsByClassName('deleteParam')
for (item of deleteParam){
    item.addEventListener('click',(e)=>{
e.target.parentElement.remove();
    })
}

addedParamCount ++;

})

//if user clicks on submit
let submit=document.getElementById("submit");
submit.addEventListener('click',()=>{
//show please wait in response box 
document.getElementById('responseJsonText').innerHTML="Please wait.... fetching request";

//fetch all the values user has entered
let url=document.getElementById("urlField").value;
let requestType=document.querySelector("input[name='requestType']:checked").value;
let contentType=document.querySelector("input[name='contentType']:checked").value;

//if user has used params option instead of json, collect all in object
if(contentType=='params'){
data={};
for(i=0;i<addedParamCount+1;i++){
if(document.getElementById('parameterKey'+(i+1))!=undefined){

let key=document.getElementById('parameterKey'+(i+1)).value;
let value=document.getElementById('parameterValue'+(i+1)).value;
data[key]=value;
}
}
data=JSON.stringify(data);
}
else{
 data=document.getElementById('requestJsonText').value;
 Prism.highlightAll()
}

//log all values in onsole for debugging
console.log('url is',url)
console.log('request type:',requestType)
console.log('contentType:',contentType)
console.log('data',data)

//if request type post create post request
if(requestType=="GET"){
fetch(url,{
    method:"GET",
}).then(response=>response.text())
    .then((text)=>{
document.getElementById('responseJsonText').innerHTML=text;
Prism.highlightAll()
    })
}
else{
    fetch(url,{
        method:"POST",
        body:data,
        headers:{
            "Content-type":"application/json"
        }
    }).then(response=>response.text())
        .then((text)=>{
    document.getElementById('responseJsonText').innerHTML=text;
    Prism.highlightAll()
        })

}
});



