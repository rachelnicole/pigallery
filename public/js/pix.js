let socket = io();

let pickArt = imgSrc => {
  artPiece = imgSrc;
  console.log('art picked ' + artPiece);
  socket.emit('artPiece', artPiece);
  $('.gallery').append('<img src="' + artPiece + '" width="384px" height="384px">');
  setTimeout(function () {
    $('.gallery').empty();
  }, 2000)
};

$('.galleryItem').click(function (e) {
  e.preventDefault();
  var alt = $(this).children("img").attr("src");

  pickArt(alt);
});


let artForm = document.getElementById("artForm");

artForm.addEventListener("submit", function(e) {
  e.preventDefault();
  let formData = new FormData(e.target);
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