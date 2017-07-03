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
        console.log(recipies);
        showRecipeElements(recipies);
    });
}

openRecipe = function(){
    var rec_url="recipes/?" + event.target.getAttribute("db_id");
    console.log("rec_url er:");
    console.log(rec_url);
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
        console.log("id er: ");
        console.log(recipies[i]._id);
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
    for(var i=0; i<list.lengt;i++){
        if(list[i]==el){
            return true;
        }
    }
    return false;
}

function saveNewRecipe(){
    var newElement = getFormElement();

    ajaxGet("/categorys", function(res){
        console.log(res);
    });
    //
    // allowedCategories = ["Middag", "Frokost", "Dessert", "Snacks", "Forrett", "Bakeverk"];
    // if(inList(newElement.category, allowedCategories)){
    //     console.log('element to save is: ');
    //     console.log(newElement);
    //     recipe_id = window.location.href.split("?")[1];
    //
    //     if(editingMode == "True"){
    //         console.log("Editing recipe");
    //         ajaxPut("/recipes/"+recipe_id, newElement, function(){
    //             console.log("element updated");
    //             window.location.href="";
    //         });
    //         editingMode = "False";
    //     }else{
    //         console.log("Saving new recipe");
    //         ajaxPost("/recipes", newElement, function(){
    //             console.log('saved!');
    //             // Reload page to show newly added recipe (if in active category)
    //             showCategory(activeCategory);
    //         });
    //     }
    //     //CLose popup
    //     popup('popUpNewEvent');
    // }else{
    //     alert("Kategori finnes ikke. Husk stor forbokstav!");
    // }
}

//Both for popup and form at bottom of page
function getFormElement(){
    var newElement={};
    formType="form";
    newElement.name=document.getElementById(formType+'-name').value;
    newElement.img=document.getElementById(formType+'-image').value;
    newElement.link=document.getElementById(formType+'-link').value;
    newElement.comment=document.getElementById(formType+'-comment').value;
    newElement.category=document.getElementById(formType+'-category').value;

    console.log("BEFORE");
    newElement.ingreedients = createArrayFromInput(document.getElementById(formType+'-ingreedients').value);
    newElement.todo = createArrayFromInput(document.getElementById(formType+'-todo').value, "todo");

    console.log(newElement)
    return newElement;
}

// comma seperated values
function createArrayFromInput(text, type){
    console.log("Creating input array");
    if(type == "todo"){
        var elements = text.split("\n\n");
    }else{
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
