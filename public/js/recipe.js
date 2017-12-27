var CURRENT_RECIPE;
var currentWineList=[];
window.onload=function(){
    showRecipe();
    document.getElementById('wineDropdownBtn').addEventListener('click', function(e){
        e.preventDefault(); // to avoid form being sent instead
        toggleWineDropdown();
    })
}

showRecipe = function(){
    recipe_id = window.location.href.split("?")[1];
    console.log(recipe_id);

    ajaxGet(recipe_id, function(recipe){
        console.log(recipe);
        CURRENT_RECIPE = recipe[0];
        createRecipeContent(recipe[0]);
    });
}

deleteRecipe = function(){
    if(confirm("Sikker på du vil slette denne oppskriften?")){
        console.log("Deleting recipe");
        recipe_id = window.location.href.split("?")[1];
        console.log(recipe_id);
        ajaxDelete("/recipes/"+recipe_id, function(){
            console.log("Recipe deleted");
        });
        window.location.href="/";
    }
}

editRecipe = function(){
    console.log("Editing recipe");
    recipe_id = window.location.href.split("?")[1];
    ajaxGet("/recipes/"+recipe_id, function(rec){
        popup("popUpNewEvent");
        setFormElement(rec[0]);
        editingMode = "True";
    });
}

setFormElement = function(rec){
    console.log("setting form element");
    document.getElementById("form-name").value=rec.name;
    document.getElementById("form-link").value=rec.link;
    document.getElementById("form-category").value=rec.category;
    document.getElementById("form-image").value=rec.img;
    document.getElementById("form-comment").value=rec.comment;

    document.getElementById("form-todo").value=setArrayForm(rec.todo, "todo");
    document.getElementById("form-ingreedients").value=setArrayForm(rec.ingreedients);
    addAlreadyChosenWines(rec);
}

addAlreadyChosenWines = function(currentRecipe, wine_id) {
    console.log('adding already chosen wine');
    currentRecipe.wine.forEach(function(wine_id) {
        //get wine obj from db
        ajaxGet("/recipes/"+wine_id, function(wineObj){
            addWineInForm(wine_id, wineObj[0]);
            currentWineList.push(wine_id);
            console.log('currentWineList');
            console.log(currentWineList);
        });
    });
}

function setArrayForm(list, type){
    var text = list[0];
    if(type == "todo"){
        splitChar = "\n\n";
    }else {
        splitChar = "\n";
    }
    for(var i = 1; i<list.length; i++){
        text = text +splitChar+ list[i];
    }
    return text;
}

function createRecipeContent(rec){
    var div = document.createElement("div");

    var name = document.createElement("h1");
    name.innerHTML = rec.name;
    div.appendChild(name);

    var img = document.createElement("img");
    img.setAttribute("src",rec.img);
    div.appendChild(img);

    if(rec.link.length>1){
        var link = document.createElement("a");
        link.innerHTML="Se oppskrift på nett";
        link.setAttribute("href", rec.link);
        link.setAttribute("target","_blank");
        div.appendChild(link);
    }

    var row_div = document.createElement("div");
    row_div.id="row_div";

    //INGREEDIENTS
    if(rec.ingreedients.length>1){
        var ing_div = document.createElement("div");
        ing_div.id = "ing_div";
        var name = document.createElement("h2");
        name.innerHTML = "Ingredienser:";
        ing_div.appendChild(name);
        createIngreedientListDOM(rec.ingreedients, ing_div);
        row_div.appendChild(ing_div);
    }

    //todo
    if(rec.todo.length>1){
        var todo_div = document.createElement("div");
        todo_div.id="todo_div";
        var name = document.createElement("h2");
        name.innerHTML = "Fremgangsmåte:";
        todo_div.appendChild(name);
        createTODOListDOM(rec.todo, todo_div);
        row_div.appendChild(todo_div);

        div.appendChild(row_div);
        document.getElementById("content").appendChild(div);
    }
    //comment
    if(rec.comment.length>0){
        var comment_div = document.createElement("div");
        comment_div.id = "comment_div";
        todo_div = document.getElementById("todo_div");
        var name = document.createElement("h2");
        name.innerHTML = "Kommentarer:";
        comment_div.appendChild(name);
        createCommentDOM(rec.comment, comment_div);
        row_div.appendChild(comment_div);
        div.appendChild(row_div);
        document.getElementById("content").appendChild(div);
        //ADDING COMMENT WITHIN todo AREA
        todo_div.appendChild(comment_div);
    }
    if(rec.wine.length>0){
        var wine_div = document.createElement("div");
        var wineDom = createWineDOM(rec.wine, wine_div);
        row_div.appendChild(wineDom);
        div.appendChild(row_div);
        document.getElementById("content").appendChild(div);
        //ADDING COMMENT WITHIN todo AREA
        //todo_div = document.getElementById("todo_div");
        //todo_div.appendChild(wine_div);
    }
}

createWineDOM = function(wineList, wine_div){
    console.log("Adding wine info as child in todo div");
    var wine_div = document.createElement('div');
    wine_div.id="wine_div";
    var name = document.createElement("h2");
    name.innerHTML = "Anbefalt vin:";
    wine_div.appendChild(name);
    //Wine is a list of suggested wines id's
    wineList.forEach(function(wine_id){
        ajaxGet("/recipes/"+wine_id, function(rec){
            wineInfo = document.createElement('a');
            wineInfo.href="/recipes/?"+wine_id;
            wineInfo.innerHTML = rec[0].name;
            wine_div.appendChild(wineInfo);
        });
    });
    return wine_div;
}

createIngreedientListDOM=function(ing, div){
    var ing_list = document.createElement("ul");
    for(var i = 0; i<ing.length; i++){
        var el = document.createElement("li");
        el.innerHTML = ing[i];
        ing_list.appendChild(el);
    }
    div.appendChild(ing_list);
}

createTODOListDOM = function(todo, div){
    var todo_list = document.createElement("ul");
    todo_list.setAttribute("class", "simple");
    for(var i = 0; i<todo.length; i++){
        var el = document.createElement("li");
        el.innerHTML = i+1+".   "+todo[i];
        todo_list.appendChild(el);
    }

    div.appendChild(todo_list);
}

createCommentDOM = function(comment, div){
    var comment_dom = document.createElement("p");
    comment_dom.innerHTML = comment;
    div.appendChild(comment_dom);
}

toggleWineDropdown = function(e){
    //get wine from db
    ajaxGet("/recipes/category/Vin", function(wineObjs){
        console.log(wineObjs);
        emptyWineDropdown();
        createWineDropdown(wineObjs);
        document.getElementById("wineDropdown").classList.toggle("show");
    });
}

emptyWineDropdown = function(){
    var drop = document.getElementById('wineDropdown');
    while(drop.firstChild){
        drop.removeChild(drop.firstChild);
    }
}

createWineDropdown = function(wineObjs){
    console.log("Creating drop");
    var drop = document.getElementById('wineDropdown');
    wineObjs.forEach(function(wine){
        //Check if already added:
        if (!currentWineList.includes(wine._id)) {
            var el = document.createElement('a');
            el.innerHTML = wine.name;
            el.id = wine._id;
            el.addEventListener('click', function(e){
                addWineInForm(e.target.id, wine);
                currentWineList.push(e.target.id);
            });
            drop.appendChild(el);
        } else {
            console.log('Wine exist');
        }
    });
}

addWineInForm = function(wine_id, wineObj) {
    //add info about chosen wine in popup form
    chosenWines = document.getElementById('chosenWines');
    chosenWineDiv = document.createElement('div');
    chosenWineDiv.className = "chosenWineForm";
    chosenWineDiv.id = wine_id;
    chosenWineName = document.createElement('p');
    chosenWineName.innerHTML = wineObj.name;
    chosenWineDiv.appendChild(chosenWineName);
    deleteWineBtn = document.createElement('button');
    deleteWineBtn.className = "deleteWine";
    deleteWineBtn.id = wine_id;
    deleteWineBtn.innerHTML = 'x';
    deleteWineBtn.addEventListener('click', function(e){
        e.preventDefault();
        deleteWineElementFromForm(wine_id);
        removeFromCurrentWineList(wine_id);
    });
    chosenWineDiv.appendChild(deleteWineBtn);
    chosenWines.appendChild(chosenWineDiv);
}

removeFromCurrentWineList = function(wine_id) {
    console.log('removing from list');
    console.log(currentWineList);
    currentWineList.forEach(function(wine, index){
        if(wine === wine_id){
            currentWineList.splice(index, 1);
        }
    });
    console.log(currentWineList);
}


deleteWineElementFromForm = function(wine_id){
    var chosenWines = document.getElementById('chosenWines');
    chosenWines.childNodes.forEach(function(el){
        if (el.id === wine_id) {
            el.remove();
        }
    });
}

//Close dropdown when clicked outside
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
