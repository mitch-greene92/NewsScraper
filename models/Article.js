// Require mongoose
var mongoose = require("mongoose");

// Reference Schema Constructor
var Schema = mongoose.Schema;

// Create a new Schema Object for Articles from Schema Constructor
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
  saved: {
    type: Boolean,
    default: false,
  },
});

// Create model from schema using model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
