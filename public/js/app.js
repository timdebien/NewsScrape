$(document).ready(function () {
  $('.alert-success').hide()
  $('.alert-danger').hide()
});

// scrape button //
$("#scrape").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape",
  }).done(function (data) {
    console.log(data)
    window.location = "/"
  })
});

// save article button //
$(".save-button").on("click", function (event) {
  event.preventDefault();
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/save/" + thisId
  }).done(function (data) {
    console.log(data);
    $(".alert-success").fadeIn('slow')
    window.location = "/"
  })
});
// .animate({ opacity: 1.0 }, 1500).effect("pulsate", { times: 2 }, 800).fadeOut('slow');

// delete article from saved // 
$(".delete-art").on("click", function () {
  var thisId = $(this).attr("data-id");
  $.ajax({
    method: "POST",
    url: "/articles/delete/" + thisId
  }).done(function (data) {
    window.location.reload()
    window.location = "/saved"
  })
});

// save note button //
// $(".save-note").on("click", function () {
//   event.preventDefault();
//   var thisId = $(this).attr("data-id");
//   console.log($("#note-content-" + thisId).val());
  
//   if ($("#note-content-" + thisId).val() == "") {
//     alert("Note cannot be blank!")
//   } else {
//     $.ajax({
//       method: "POST",
//       url: "/notes/save/" + thisId,
//       data: {
//         noteText: $("#note-content-" + thisId).val()
//       }
//     }).done(function (data) {
//       console.log(data);
//       $("#note-content-" + thisId).val("");
//       $(".note-modal").modal("hide");
//       window.location = "/saved"
//     });
//   }
// });

// //Handle Delete Note button
// $(".delete-note").on("click", function () {
//   var noteId = $(this).attr("data-note-id");
//   var articleId = $(this).attr("data-article-id");
//   $.ajax({
//     method: "DELETE",
//     url: "/notes/delete/" + noteId + "/" + articleId
//   }).done(function (data) {
//     console.log(data)
//     $(".modalNote").modal("hide");
//     window.location = "/saved"
//   })
// });