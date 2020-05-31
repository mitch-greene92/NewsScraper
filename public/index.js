$(function () {
  $("#scrape-articles-btn").on("click", function (event) {
    event.preventDefault();
    $(".articlesScrapedBody").empty();

    $.ajax("/api/all", {
      type: "GET",
    }).then(function (response) {
      let originalLength = response;
      $.ajax("/api/scrape", {
        type: "POST",
      }).then(function (response) {
        $.ajax("/api/reduce", {
          type: "DELETE",
        }).then(function (response) {
          let newText = $("<div>");
          let newLength = response.length;
          let articlesChanged = parseInt(newLength) - parseInt(originalLength);

          if (articlesChanged == 0) {
            newText.text("Scraper is up to date");
            $(".articlesScrapedBody").append(newText);
            $("#scrapeArticlesModal").modal("show");
          } else {
            newText.text(articlesChanged + " new articles scraped");
            $(".articlesScrapedBody").append(newText);
            $("#scrapeArticlesModal").modal("show");
          }
        });
      });
    });
  });

  //Close Modal Event Listener
  $(".closeModalButton").on("click", function (event) {
    event.preventDefault();
    $.ajax("/", {
      type: "GET",
    }).then(function () {
      location.reload();
    });
  });

  //Clear Button Functionality
  $(document).on("click", "#clear-articles-btn", function () {
    event.preventDefault();
    $.ajax("/api/clear", {
      type: "GET",
    }).then(function (response) {
      $("#clearArticlesModal").modal("show");
    });
  });

  //Save Article Button Event Listener
  $(".saveArticleButton").on("click", function (event) {
    event.preventDefault();
    let articleId = $(this).data("id");
    $.ajax("/api/save/article/" + articleId, {
      type: "PUT",
    }).then(function () {
      $("#articleSavedModal").modal("show");
    });
  });
});
