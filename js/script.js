//  main.js
//  Contains logic for MCQ APP
//  Author: B P Likith Sai

$(function() {
    //  get the JSON Data locally
     // load xml file
     if (window.XMLHttpRequest) {
        xhttp = new XMLHttpRequest();
     } else {    // IE 5/6
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
     }
 
     xhttp.open("GET", "data.xml", false);
     xhttp.send();
     xmlDoc = xhttp.responseXML; 
 
     var uurloon = xmlDoc.getElementsByTagName("uurloon")[0].childNodes[0].textContent;
     var setloon = xmlDoc.getElementsByTagName("setloon")[0].childNodes[0].textContent;
     console.log(uurloon,setloon); //give me "10 100"

})