
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var RecipeSchema   = new Schema({
    name: String,
    ingreedients: Array,
    todo: Array,
    category: String,
    img: String,
    link: String,
    comment: String,
    wine: Array
});

module.exports = mongoose.model('Recipe', RecipeSchema); //first input here defines the collection name in db
