// logic for saving new elements from frontend

var activeCategory = "Middag";

showCategory = function(type){ //Type = Bakeverk, Middag, Forrett, Dessert, Frokost, Snacks
    console.log("Showing category");
    emptyAllRecipeElements();
    recipes = getCategory(type);

    document.getElementById(activeCategory).setAttribute("class", "");
    document.getElementById(type).setAttribute("class", "active");
    activeCategory = type;
}

emptyAllRecipeElements = function(){
    var myNode = document.getElementById("insert");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
}


getCategory = function(type){
    ajaxGet("recipes/category/"+type, function(recipies){
    // ajaxGet("recipes/"+type, function(recipies){
        showRecipeElements(recipies);
    });
}

openRecipe = function(){
    var rec_url="recipes/?" + event.target.getAttribute("db_id");
    window.location.href="/recipes/?"+event.target.getAttribute("db_id");
}


showRecipeElements = function(recipies){
    //read form json object:
    for(i=0; i<recipies.length; i++){
        //adding elements for info on events

        var name=document.createElement("h2");
        name.innerHTML=recipies[i].name;
        name.setAttribute("db_id", recipies[i]._id);

        var colDiv=document.createElement("div");
        colDiv.setAttribute("class","col-sm-4");

        var link=document.createElement("a");
        link.setAttribute("href","#");
        link.setAttribute("onclick", "openRecipe()");
        //Må jeg sette tom id også?
        var td=document.createElement("div");
        td.setAttribute("db_id", recipies[i]._id);
        td.setAttribute("class","to-do-box");
        td.setAttribute("id",i);
        td.setAttribute("homepage", recipies[i].link);
        td.setAttribute("img-url",recipies[i].img);
        td.setAttribute("style", "background-image: url("+recipies[i].img);

        var text=document.createElement("div");
        text.setAttribute("class","text");
        text.appendChild(name);

        td.appendChild(text);
        link.appendChild(td);
        colDiv.appendChild(link);
        var insert=document.getElementById("insert");
        insert.appendChild(colDiv);

        //save info for later on object
        //descripcions contains id and descripcion pairs

        homepage=recipies[i].homepage;
        //homepages[i]=homepage;
    }
}


// document.getElementById('saveNewElement-btn').addEventListener('click', function(){
//     console.log("click in mode: "+popup.mode);
//     if(popup.mode === 'edit'){
//         saveEditedElement(activeCategory);
//     }else{
//         //removed this functionality? now only form at bottom that saves new elements
//         //saveNewElement();
//     }
// });

function inList(el, list){
    console.log("Category is:");
    console.log(el);
    var exist=false;
    for(var i=0; i<list.length; i++){
        console.log("comparing");
        console.log(list[i]);
        console.log(el);
        if(list[i]==el){
            console.log("Finnes!!!!");
            exist=true;
        }
    }
    return exist;
}

function saveNewRecipe(){
    var newElement = getFormElement();

    ajaxGet("/categorys", function(res){
        console.log(res);
    });

    allowedCategories = ["Middag", "Frokost", "Dessert", "Snacks", "Forrett", "Bakeverk"];

    //Set dummy values on missing information:
    if(document.getElementById('form-comment').value.length <1){
        console.log("comment not filled - set to dummy variable");
        document.getElementById('form-comment').value="-";
    }

    var form_ingreedients = document.getElementById('form-ingreedients');
    var form_todo = document.getElementById('form-todo');
    // console.log(form_ingreedients.value)
    // console.log(form_ingreedients.value.length)

    if(inList(newElement.category, allowedCategories) && form_ingreedients.value.length>1 && form_todo.value.length>1){
        console.log('element to save is: ');
        console.log(newElement);
        recipe_id = window.location.href.split("?")[1];

        if(editingMode == "True"){
            ajaxPut("/recipes/"+recipe_id, newElement, function(){
                console.log("element updated");
                window.location.href="";
            });
            editingMode = "False";
        }else{
            ajaxPost("/recipes", newElement, function(){
                console.log('saved!');
                // Reload page to show newly added recipe (if in active category)
                emptyFormElement();
                showCategory(activeCategory);
            });
        }
        //Close popup
        popup('popUpNewEvent');
    }else{
        alert("Kategori, ingredienser og beskrivelse må fylles ut! Husk stor forbokstav på kategori.");
    }
}

function getFormElement(){
    var newElement={};
    formType="form";
    newElement.name=document.getElementById(formType+'-name').value;
    newElement.img=document.getElementById(formType+'-image').value;
    newElement.link=document.getElementById(formType+'-link').value;
    newElement.comment=document.getElementById(formType+'-comment').value;
    newElement.category=document.getElementById(formType+'-category').value;

    newElement.ingreedients = createArrayFromInput(document.getElementById(formType+'-ingreedients').value);
    newElement.todo = createArrayFromInput(document.getElementById(formType+'-todo').value, "todo");

    return newElement;
}

emptyFormElement = function(){ //Call after recipe is saved
    document.getElementById(formType+"-name").value="";
    document.getElementById(formType+"-link").value="";
    document.getElementById(formType+"-category").value="";
    document.getElementById(formType+"-image").value="";
    document.getElementById(formType+"-comment").value="";

    document.getElementById(formType+"-todo").value="";
    document.getElementById(formType+"-ingreedients").value="";
}


function createArrayFromInput(text, type){
    if(type == "todo"){
        var elements = text.split("\n\n");
        console.log("Elements after split:");
        console.log(elements);
    }else{ //ingreedients
        var elements = text.split("\n");
    }
    var list = [];
    for(var i=0; i<elements.length; i++){
        list.push(elements[i]);
    }
    return list;
}

function saveEditedElement(type){ //type = hostels / cites / restaurants
    var element = getFormElement('pop');
    var url = type+"/"+activeElementName;

    if(editingMode == True){
        ajaxPut(url, element, function(){
            console.log("element updated");
            //Reload sidemenu:
            setMenuContent(element, type.substring(0, type.length-1)); //second input = hostel/cite/restaurant -> remove s from type
        });
        editingMode = False;
    }else{
        ajaxPut(url, element, function(){
            console.log("element updated");
            //Reload sidemenu:
            setMenuContent(element, type.substring(0, type.length-1)); //second input = hostel/cite/restaurant -> remove s from type
        });
    }
    activeElementName = ""; //remove as active

    //Close popup
    toggleWindow();
}

function editElementInDB(type){ //type = hostels / cites / restaurants
    console.log("ready to edit");
    popup.mode = "edit";

    var url = type+"/"+activeElementName;
    ajaxGet(url, function(data){
        console.log("found element");
        console.log(data[0]);
        toggleWindow(data[0]); //Sending in current data, to avoid haveing to write everyone again!
    });
}

function deleteElementInDb(type){ //type = hostels / cites / restaurants
    console.log('ready to delete from DB');
    var url = type+"/"+activeElementName;
    console.log(url);
    ajaxDelete(url, function(){
        console.log("deleted element");
    });
}
