//Require mongoose
var mongoose = require("mongoose");

// Reference Schema Constructor
var Schema = mongoose.Schema;

// Create a new Schema Object for Articles from Schema Constructor
var NoteSchema = new Schema({
  _articleId: {
    type: Schema.Types.ObjectId,
    ref: "Article",
  },
  _articleTitle: {
    type: String,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },
});

// Create model from schema using model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
