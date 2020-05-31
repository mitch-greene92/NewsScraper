$(function () {
  //Event Listener for Delete
  $(".deleteArticleButton").on("click", function (event) {
    event.preventDefault();

    let articleId = $(this).data("id");

    //Delete Article from Database
    $.ajax("/api/delete/article/" + articleId, {
      type: "PUT",
    }).then(function () {
      $("#articleDeletedModal").modal("show");
    });
  });

  //Event Listener for Notes Button
  $(".notesButton").on("click", function (event) {
    event.preventDefault();

    let articleId = $(this).data("id");

    //Empty Modal Contents
    $(".noteModalBody").empty();
    $(".noteModalTitle").empty();

    //Update Notes Modal Contents
    $.ajax("/api/notes/" + articleId, {
      type: "GET",
    })
      .then(function (result) {
        //Append Article title & id to modal content
        $(".noteModalTitle").append(`<h2>${result.title}</h2>`);
        $(".saveNoteButton").attr("data-id", result._id);

        //display existing notes
        let newCard = $(`
                <div class="card">
                    <div class="card-header">
                        ${result.note.title}
                    </div>
                    <div class="card-body noteCardBody">
                        <p class="card-text">${result.note.body}</p>
                        <button type="button" class="btn btn-danger deleteNoteButton" data-id="">Delete Note</button>
                    </div>
                </div>
                `);
        $(".noteModalBody").append(newCard);
      })
      .then($("#noteModal").modal("show"));
  });

  //Event Listener for Save Note Button
  $(".saveNoteButton").on("click", function (event) {
    let articleId = $(this).data("id");

    //Create new note in Database
    $.ajax("/api/create/notes/" + articleId, {
      type: "POST",
      data: {
        title: $("#titleInput").val(),
        body: $("#bodyInput").val(),
        _articleId: articleId,
      },
    }).then(function (result) {
      let noteSaved = $('<p class="noteAlert">Your note has been saved</p>');
      $(".alertDiv").append(noteSaved);
      $("#titleInput").val("");
      $("#bodyInput").val("");
    });
  });

  //Event Listener for Delete Button
  $(document).on("click", ".deleteNoteButton", function () {
    event.preventDefault();
  });
});
