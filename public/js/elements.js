// logic for saving new elements from frontend

var activeCategory = "Middag";

showCategory = function(type){ //Type = Bakeverk, Middag, Forrett, Dessert, Frokost, Snacks, Vin
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

    allowedCategories = ["Middag", "Frokost", "Dessert", "Snacks", "Forrett", "Bakeverk", "Vin"];

    //Set dummy values on missing information:
    if(document.getElementById('form-comment').value.length <1){
        console.log("comment not filled - set to dummy variable");
        document.getElementById('form-comment').value="";
    }
    //Set dummy values on missing information:
    if (document.getElementById('form-ingreedients').value.length <1) {
        console.log("comment not filled - set to dummy variable");
        document.getElementById('form-ingreedients').value="";
    }

    var form_ingreedients = document.getElementById('form-ingreedients');
    var form_todo = document.getElementById('form-todo');

    if (inList(newElement.category, allowedCategories)) {
        console.log('element to save is: ');
        console.log(newElement);
        recipe_id = window.location.href.split("?")[1];

        if (editingMode == "True") {
            ajaxPut("/recipes/"+recipe_id, newElement, function() {
                console.log("element updated");
                window.location.href="";
            });
            editingMode = "False";
        } else {
            ajaxPost("/recipes", newElement, function() {
                console.log('saved!');
                // Reload page to show newly added recipe (if in active category)
                emptyFormElement();
                showCategory(activeCategory);
            });
        }
        //Close popup
        popup('popUpNewEvent');
    } else {
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
    newElement.wine = createWineArray();
    return newElement;
}

createWineArray = function() {
    var wines = document.getElementsByClassName('chosenWineForm');
    wines = Array.prototype.slice.call(wines);
    var returnList = [];
    if (wines.length > 0) {
        wines.forEach(function(wineDom){
            returnList.push(wineDom.id);
        });
    }
    return returnList;
}

emptyFormElement = function(){ //Call after recipe is saved
    document.getElementById(formType+"-name").value="";
    document.getElementById(formType+"-link").value="";
    document.getElementById(formType+"-category").value="";
    document.getElementById(formType+"-image").value="";
    document.getElementById(formType+"-comment").value="";

    document.getElementById(formType+"-todo").value="";
    document.getElementById(formType+"-ingreedients").value="";
    //empty chosenWines div
    var wines = document.getElementById('chosenWines');
    console.log(wines);
    if(wines){
        while(wines.firstChild){
            wines.removeChild(wines.firstChild);
        }
    }
}


function createArrayFromInput(text, type){
    if(type == "todo"){
        var elements = text.split("\n\n");
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
        toggleWindow(data[0]); //Sending in current data, to avoid haveing to write everyone again!
    });
}

function deleteElementInDb(type){ //type = hostels / cites / restaurants
    var url = type+"/"+activeElementName;
    ajaxDelete(url, function(){
        console.log("deleted element");
    });
}
