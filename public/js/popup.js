
var popupForm = {
    mode: 'deafult' //default means new element. other states: edit
}

function popup(windowname, element) {
    //console.log(windowname);
    blanket_size(windowname);
    window_pos(windowname);
    toggle('Blanket');
    try{
        makeContent(windowname, element);

    }catch(error){
        console.log("closing");
    }

    toggle(windowname);
    //contentIntPopup(windowname);
}

function blanket_size(windowActive) {
    if (typeof window.innerWidth != 'undefined') {
        viewportheight = window.innerHeight;
    } else {
        viewportheight = document.documentElement.clientHeight;
    }
    if ((viewportheight > document.body.parentNode.scrollHeight) && (viewportheight > document.body.parentNode.clientHeight)) {
        blanket_height = viewportheight;
    } else {
        if (document.body.parentNode.clientHeight > document.body.parentNode.scrollHeight) {
            blanket_height = document.body.parentNode.clientHeight;
        } else {
            blanket_height = document.body.parentNode.scrollHeight;
        }
    }
    var blanket = document.getElementById('Blanket');
    blanket.style.height = blanket_height + 'px';
    var windowAct = document.getElementById(windowActive);

    popUpDiv_height=blanket_height/2-200;//200 is half popup's height
    windowAct.style.top = popUpDiv_height + 'px';
}
function window_pos(windowActive) {
    if (typeof window.innerWidth != 'undefined') {
        viewportwidth = window.innerHeight;
    } else {
        viewportwidth = document.documentElement.clientHeight;
    }
    if ((viewportwidth > document.body.parentNode.scrollWidth) && (viewportwidth > document.body.parentNode.clientWidth)) {
        window_width = viewportwidth;
    } else {
        if (document.body.parentNode.clientWidth > document.body.parentNode.scrollWidth) {
            window_width = document.body.parentNode.clientWidth;
        } else {
            window_width = document.body.parentNode.scrollWidth;
        }
    }
    var windowAct = document.getElementById(windowActive);
    window_width=window_width/2-200;//200 is half popup's width
    windowAct.style.left = window_width + 'px';
}

function toggle(div_id) {
    var el = document.getElementById(div_id);
    if ( el.style.display == 'none' ) {
        el.style.display = 'block';
    }
    else {
        el.style.display = 'none';
    }
}


//TODO Is this ever used?
function makeContent(windowname, element){
    //console.log("making content");
    if(windowname === "popUpDiv"){
        // console.log(element);
        // var srcn=element.getElementsByClassName('to-do-box')[0].getAttribute("img-url");
        // var img=document.getElementsByClassName("pop-up-photo")[0];
        // img.src=srcn;
        //
        // var nameElement=document.getElementsByClassName("pp-name")[0];
        // var name=element.children[0].children[0].children[0].innerHTML;
        // nameElement.innerHTML=name;
        //
        // var idNumber=element.children[0].getAttribute("id");
        //
        // //Ingredienser:
        // var ingDomList=document.getElementsByClassName("ingredienser")[0];
        // var ingredienser=recipe[idNumber].Ingredienser;
        // console.log("ing "+ingredienser);
        //
        // //empty from last popup
        // while(document.getElementById("ingr").firstChild){
        //     document.getElementById("ingr").removeChild(document.getElementById("ingr").firstChild);
        // }
        //
        // for(var j=0; j<ingredienser.length; j++){
        //     var ingrediensElement=document.createElement("li");
        //     console.log(recipe[idNumber]);
        //     ingrediensElement.innerHTML=recipe[idNumber].Ingredienser[j];
        //     ingDomList.appendChild(ingrediensElement);
        // }
        // //homepageElement.appendChild(ingDomList);
        //
        // var homepageElement=document.getElementsByClassName("pp-homepage")[0];
        // homepageElement.setAttribute("href", element.getAttribute("homepage"));

    }else{//new event
        //console.log("went to else");
    }
}
