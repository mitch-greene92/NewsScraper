const db = require("../models");

module.exports = function (app) {
  app.get("/saved", function (req, res) {
    var articleObject = {};

    articleObject["articles"] = [];

    db.Article.find({ $query: { saved: true } })
      .sort({ date: -1 })
      .then(function (found) {
        if (found.length > 0) {
          for (let i = 0; i < found.length; i++) {
            newObject = {
              id: found[i]._id,
              title: found[i].title,
              summary: found[i].summary,
              link: found[i].link,
              photo: found[i].photo,
              saved: found[i].saved,
              notes: found[i].notes,
            };

            articleObject.articles.push(newObject);

            if (i == found.length - 1) {
              res.render("saved", articleObject);
            }
          }
        } else {
          res.render("saved");
        }
      });
  });

  app.get("/", function (req, res) {
    var articlesObject = {};

    articlesObject["articles"] = [];

    db.Article.find({ $query: { saved: false } })
      .sort({ date: -1 })
      .then(function (found) {
        if (found.length > 0) {
          for (let i = 0; i < found.length; i++) {
            newObject = {
              id: found[i]._id,
              title: found[i].title,
              summary: found[i].summary,
              link: found[i].link,
              photo: found[i].photo,
              saved: found[i].saved,
              notes: found[i].notes,
            };

            articlesObject.articles.push(newObject);

            if (i == found.length - 1) {
              res.render("index", articlesObject);
            }
          }
        } else {
          res.render("index");
        }
      });
  });
};
