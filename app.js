
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var path       = require('path');
var mongoose   = require('mongoose');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

//Set root folder
app.use(express.static(path.join(__dirname, 'public')));

mongoose.Promise = global.Promise; // avoid error - don't know what it does though

//Connect to db:hSRXio83BXC50imfa4W14hFdq2LomCLk
mongoose.connect('mongodb://heroku_1jx43111:ok8q77ulaphak6vnh1lrjd7jkq@ds135522.mlab.com:35522/heroku_1jx43111');
// mongoose.connect('mongodb://heroku_8dg8fhxt:d20n7eafi30j543hsil10gslsf@ds157839.mlab.com:57839/heroku_8dg8fhxt');

// =========  API =======================================================================================================================

//Import DB models:
var Recipe      = require('./models/recipe');
var Category      = require('./models/category');

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /
app.use('/', router);

// test route to make sure everything is working (accessed at GET http://localhost:8080/)
router.get('/', function(req, res) {
    res.sendfile('index.html', { root: __dirname + "/public" } );
});
router.get('/recipes', function(req, res) {
    res.sendfile('views/recipe.html', { root: __dirname + "/public" } );
});

// more routes for our API will happen here:

//RECIPE ROUTES:
router.route('/recipes/')
    //create recipe:
    .post(function(req, res){
        postFunction(req, res, 'recipes')
    })
    //get all recipes
    .get(function(req, res) {
        getFunction(req, res, 'recipes')
    });
router.route('/recipes/:element_id')
    //Getting specific recipe
    .get(function(req, res){
        getOneFunction(req, res, 'recipes');
    })

    .delete(function(req, res){
        deleteOneFunction(req, res, 'recipes');
    })

    //update recipe
    .put(function(req, res){
        putOneFunction(req, res, 'recipes');
    });
//Get all recipes for one category
router.route('/recipes/category/:category_id')
    //Getting specific recipe
    .get(function(req, res){
        getCategoryRecipes(req, res, 'recipes');
    });


//Category ROUTES:
router.route('/categorys/')
    //create recipe:
    .post(function(req, res){
        postFunction(req, res, 'categorys')
    })
    //get all categorys
    .get(function(req, res) {
        getFunction(req, res, 'categorys')
    });
router.route('/categorys/:element_id')
    //Getting specific recipe
    .delete(function(req, res){
        deleteOneFunction(req, res, 'categorys');
    })
    //update recipe
    .put(function(req, res){
        putOneFunction(req, res, 'categorys');
    });

modelTypes = {
    'recipes': Recipe,
    'categorys': Category
}

function getFunction(req, res, type){ //type = recipes
    var Model = modelTypes[type];

    console.log("get all: " + type);
    Model.find(function(err, modelElements){
        if (err)
            return res.send(err)
        res.json(modelElements);
    });
}

function postFunction(req, res, type){ //type = recipes
    console.log('in post function');
    var Model = modelTypes[type];

    var element = new Model(req.body); //adding the data from frontend
    console.log('the created element is: ');
    console.log(element);
    element.save(function(err){
            if (err)
                console.log("error when saving element!!");
                return res.send(err);
            res.json({ message: 'Element created!' });
        });
}

function getCategoryRecipes(req, res, type){
    var Model = modelTypes[type];
    Model.find({category: req.params.category_id}, function(err, elements){
        if(err)
            return res.send(err)
        res.json(elements)
    });
}

function getOneFunction(req, res, type){
    var Model = modelTypes[type];
    Model.find({_id: req.params.element_id}, function(err, element){
        if(err)
            return res.send(err)
        res.json(element)
    });
}

function deleteOneFunction(req, res, type){
    console.log('in delete function');
    var Model = modelTypes[type];
    Model.remove({_id: req.params.element_id}, function(err, element) {
        if (err)
            return res.send(err);

        res.json({ message: type+' Successfully deleted' });
    });
}

function putOneFunction(req, res, type){
    console.log('in put function');
    var Model = modelTypes[type];

    Model.find({_id: req.params.element_id}, function(err, elements){
        if (err)
            return res.send(err);
        element = elements[0];

        //Setting new values
        element.name          = req.body.name;
        element.img           = req.body.img;
        element.category      = req.body.category;
        element.link          = req.body.link;
        element.ingreedients  = req.body.ingreedients;
        element.todo          = req.body.todo;
        element.comment       = req.body.comment;

        element.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message:'element updated!' });
        });
    });
}



// START THE SERVER (happens in .bin/www, and therefor have to export the module to make it importable)
// ====================================================================================================

module.exports = app;
