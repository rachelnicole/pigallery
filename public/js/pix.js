var socket = io();

function pickArt(altTag) {
  artPiece = altTag;
  console.log('art picked' + artPiece);
  socket.emit('artPiece', artPiece);
  $('.gallery').append('<img src="public/images/' + artPiece + '-lrg.gif">');
  setTimeout(function () {
    $('.gallery').empty();
  }, 2000)
};

$('.galleryItem').click(function (e) {
  e.preventDefault();
  var alt = $(this).children("img").attr("alt");

  pickArt(alt);
});

$('.galleryItem').click(function (e) {
  e.preventDefault();
  var alt = $(this).children("img").attr("alt");

  pickArt(alt);
});


var artForm = document.getElementById("artForm");

artForm.addEventListener("submit", function(e) {
  e.preventDefault();
  var formData = new FormData(e.target);
  // $.ajax({
  //   url: "/upload",
  //   method: "POST",
  //   body: formData
  // }).done(function() {
  //   console.log('form is done');
  // });
  fetch('/upload', {
    method: 'POST',
    body: formData
  }).then(function(res) {
    return res.text();
  }).then(function(result){
    console.log(result);
  }).catch(function(reason) {
    console.log(reason);
  });

});