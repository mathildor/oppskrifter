

window.onload=function(){
    showRecipe();
}

showRecipe = function(){
    recipe_id = window.location.href.split("?")[1];
    console.log(recipe_id);

    ajaxGet(recipe_id, function(recipe){
        console.log(recipe);
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
    document.getElementById("form-name").value=rec.name;
    document.getElementById("form-link").value=rec.link;
    document.getElementById("form-category").value=rec.category;
    document.getElementById("form-image").value=rec.img;
    document.getElementById("form-comment").value=rec.comment;

    document.getElementById("form-todo").value=setArrayForm(rec.todo, "todo");
    document.getElementById("form-ingreedients").value=setArrayForm(rec.ingreedients);
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

    //T ODO
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
}

createIngreedientListDOM=function(ing, div){
    console.log("ing");
    console.log(ing);
    var ing_list = document.createElement("ul");
    console.log("ing_list");
    console.log(ing_list);
    for(var i = 0; i<ing.length; i++){
        var el = document.createElement("li");
        el.innerHTML = ing[i];
        ing_list.appendChild(el);
    }

    div.appendChild(ing_list);
}
createTODOListDOM=function(todo, div){
    console.log("todo");
    console.log(todo);
    var todo_list = document.createElement("ul");
    todo_list.setAttribute("class", "simple");
    console.log("todo_list");
    console.log(todo_list);
    for(var i = 0; i<todo.length; i++){
        var el = document.createElement("li");
        el.innerHTML = i+1+".   "+todo[i];
        todo_list.appendChild(el);
    }

    div.appendChild(todo_list);
}
