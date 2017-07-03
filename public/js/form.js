
var hostelForm = document.getElementById('hostel');
var citeForm = document.getElementById('cite');
var restaurantForm = document.getElementById('restaurant');
var placeForm = document.getElementById('place');

var hostel_btn = document.getElementById('hostel-btn');
var cite_btn = document.getElementById('cite-btn');
var restaurant_btn = document.getElementById('restaurant-btn');
var place_btn = document.getElementById('place-btn');


var form = {
    active: 'hostels', // resturant, cite, place
    element: hostelForm,
    btn: hostel_btn
}

//Event listeners:
restaurant_btn.addEventListener('click', function(){
    changeActiveForm(restaurantForm, restaurant_btn, 'restaurants');
});
cite_btn.addEventListener('click', function(){
    console.log("changing to cite");
    changeActiveForm(citeForm, cite_btn, 'cites');
});

hostel_btn.addEventListener('click', function(){
    changeActiveForm(hostelForm, hostel_btn, 'hostels');
});
place_btn.addEventListener('click', function(){
    changeActiveForm(placeForm, place_btn, 'places');
});

//save button event
document.getElementById('saveNewElement-form-btn').addEventListener('click', function(){

    //test if fields are filled out!
    var inputFields = form.element.childNodes;

    if(document.getElementById(form.active+'-form-img').value.length<1){
        //set default img:
        if(form.active == "hostels"){
            document.getElementById(form.active+'-form-img').value = 'http://sr.photos3.fotosearch.com/bthumb/CSP/CSP860/k8604313.jpg';
        }else if(form.active == "cites"){
            document.getElementById(form.active+'-form-img').value = 'https://c1.staticflickr.com/4/3735/9688947414_8298804036.jpg';
        }else if(form.active == "restaurants"){
            document.getElementById(form.active+'-form-img').value = 'http://www.hipafrica.com/app/uploads/2015/06/RESTAURANT.svg';
        }else if(form.active == "places"){
            document.getElementById(form.active+'-form-img').value = 'http://weknownyourdreamz.com/images/star/star-04.jpg';
        }
    }
    if(document.getElementById(form.active+'-form-score').value.length<1){
        document.getElementById(form.active+'-form-img').value = " ";
    }
    if(document.getElementById(form.active+'-form-link').value.length<1){
        document.getElementById(form.active+'-form-link').value = " ";
    }

    for(var i=1; i<inputFields.length; i=i+2){
        if(inputFields[i].value.length < 1){
            alert('Fill out all fields');
            break;
        }
    }
    saveNewElement(form.active);
});


function setFormCoords(coords){
    document.getElementById(form.active+'-form-lat').value=coords[1];
    document.getElementById(form.active+'-form-long').value=coords[0];
}

function setFormValues(place){
    console.log(place);
    document.getElementById(form.active+'-form-name').value = place.name;
    if(place.photos != undefined){
        document.getElementById(form.active+'-form-img').value = place.photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100});
    }
    if(place.rating != undefined){
        document.getElementById(form.active+'-form-score').value = place.rating;
    }
    if(place.website != undefined){
        document.getElementById(form.active+'-form-link').value = place.website;
    }
}

function disableForm(form, form_btn){
    form_btn.className = ""; //remove active class
    form.className = 'input-div hide';     //hide form
}
function enableForm(form, form_btn){
    form_btn.className = "active"; //add active class
    form.className = 'input-div'; //show form by romec hide class
}

function changeActiveForm(newForm, newForm_btn, newFormName){
    disableForm(form.element, form.btn ); //disable prev active
    //set new active
    form.element = newForm;
    form.btn = newForm_btn;
    form.active = newFormName;
    enableForm(form.element, form.btn);
}
