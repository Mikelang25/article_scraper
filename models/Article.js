var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({

  _id: {
    type: String,
    required: true
  },

  summary: {
    type: String,
    required: true
  },

  author: {
    type: String,
    required: false
  },

  datePub: {
    type: String,
    required: false
  },

  link: {
    type: String,
    required: true
  },

  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;
