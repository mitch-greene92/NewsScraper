// Web Scraping Requirements
const axios = require("axios");
const cheerio = require("cheerio");
const db = require("../models");

module.exports = function (app) {
  // POST route to scrape the website
  app.post("/api/scrape", function (req, res) {
    // Use Axios to grab HTML
    axios.get("http://www.npr.org/sections/news/").then(function (response) {
      // Save it to cheerio with $ as a shorthand selector
      var $ = cheerio.load(response.data);

      // Grab every new article and save the elements
      $("article.item").each(function (i, element) {
        let title = $(element)
          .find(".item-info")
          .find(".title")
          .find("a")
          .text();
        let summary = $(element)
          .find(".item-info")
          .find(".teaser")
          .find("a")
          .text();
        let link = $(element)
          .find(".item-info")
          .find(".title")
          .children()
          .attr("href");
        let photo = $(element)
          .find(".item-image")
          .find(".imagewrap")
          .find("a")
          .find("img")
          .attr("src");
        let date = $(element)
          .find(".item-info")
          .find(".teaser")
          .find("a")
          .find("time")
          .attr("datetime");

        let result = {
          title: title,
          summary: summary,
          link: link,
          photo: photo,
          date: date,
        };

        // Create Article using result object
        db.Article.create(result)
          .then(function (dbArticle) {
          })
          .catch(function (err) {
            console.log(err);
          });
      });
      res.send("News Scrape Complete");
    });
  });

  //Get current articles route, sort by newest
  app.get("/api/all", function (req, res) {
    db.Article.find({
      $query: {
        saved: false,
      },
    })
      .sort({
        date: -1,
      })
      .then(function (response) {
        res.json(response.length);
      });
  });

  //Get All Notes route
  app.get("/api/notes/all", function (req, res) {
    db.Note.find({}).then(function (response) {
      res.json(response);
    });
  });

  // Get Route for Articles in DB
  app.get("/api/articles", function (req, res) {
    // Grab every Article
    db.Article.find({})
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Get route for artciles by ID
  app.get("/api/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
      .populate("note")
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  // Save & Update Note
  app.post("/api/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate(
          { _id: req.params.id },
          { note: dbNote._id },
          { new: true }
        );
      })
      .then(function (dbArticle) {
        res.json(dbArticle);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  //save article using ID for list of saved articles
  app.put("/api/save/article/:id", (req, res) => {
    let articleId = req.params.id;
    db.Article.findOneAndUpdate(
      {
        _id: articleId,
      },
      {
        $set: {
          saved: true,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });

  //Delete Article by ID
  app.put("/api/delete/article/:id", (req, res) => {
    let articleId = req.params.id;
    db.Article.findOneAndUpdate(
      {
        _id: articleId,
      },
      {
        $set: {
          saved: false,
        },
      }
    ).then(function (result) {
      res.json(result);
    });
  });

  //route for finding note for specific article
  app.get("/api/notes/:id", (req, res) => {
    let articleId = req.params.id;
    db.Article.findOne({
      _id: articleId,
    })
      .populate("note")
      .then((result) => {
        console.log("This is the notes api result: ");
        console.log(result);
        res.json(result);
      });
  });

  //route for creating new notes
  app.post("/api/create/notes/:id", (req, res) => {
    db.Note.create(req.body)
      .then(function (dbNote) {
        return db.Article.findOneAndUpdate(
          {
            _id: req.params.id,
          },
          {
            note: dbNote._id,
          },
          {
            new: true,
          }
        );
      })
      .then(function (result) {
        res.json(result);
      })
      .catch(function (err) {
        res.json(err);
      });
  });

  app.delete("/api/reduce", (req, res) => {
    db.Article.find({
      $query: {
        saved: false,
      },
    })
      .sort({
        date: -1,
      })
      .then((found) => {
        console.log(found.length);
        let countLength = found.length;
        let overflow = countLength - 25;
        console.log(overflow);
        let overflowArray = [];

        for (var i = 0; i < overflow; i++) {
          overflowArray.push(found[25 + i]._id);
          console.log(overflowArray);
        }

        db.Article.remove(
          {
            _id: {
              $in: overflowArray,
            },
          },
          (error, result) => {
            result["length"] = countLength;
            console.log(result);
            res.json(result);
          }
        );
      });
  });

  // Delete Article documents from DB
  app.get("/api/clear", function (req, res) {
    db.Article.remove().then(function () {
      res.json("Documents removed from Articles");
    });
  });
};
