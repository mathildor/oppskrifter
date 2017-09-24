//GLOBAL VARIABLES
activeElementName="";
var editingMode = "False";

window.onload = function(){
    showCategory("Middag");
};

function ajaxGet(url, callback){
    $.ajax({
        url: url,
        method: "GET",
        success: function(data){
            callback(data)
        }
    });
}
function ajaxDelete(url, callback){
    $.ajax({
        url: url,
        method: "DELETE",
        success: function(data){
            callback(data)
        }
    });
}
function ajaxPost(url, inputData, callback){
    $.ajax({
        url: url,
        method: "POST",
        data: inputData,
        success: function(data){
            callback(data)
        }
    });
}
function ajaxPut(url, inputData, callback){
    $.ajax({
        url: url,
        method: "PUT",
        data: inputData,
        success: function(data){
            callback(data)
        }
    });
}


function newText(type, inner, parent, idName){
    var el=document.createElement(type);
    el.innerHTML=inner;
    parent.appendChild(el);
    if(idName){
        el.id=idName;
    }
    return el;
}

function newSrc(type, src, inner, parent, idName){
    var el=document.createElement(type);
    el.innerHTML=inner;
    el.setAttribute('src', src);
    if(idName){
        el.id=idName;
    }
    parent.appendChild(el);
    return el;
}

function newHref(type, src, inner, parent){
    var el=document.createElement(type);
    el.innerHTML=inner;
    el.setAttribute('href', src);
    el.setAttribute('target', '_blank');
    parent.appendChild(el);
    return el;
}
