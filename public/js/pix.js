var socket = io();

function pickArt(altTag) {
  artPiece = altTag;
  console.log('art picked' + artPiece);
  socket.emit('artPiece', artPiece);
  $('.gallery').append('../images/' + artPiece + '-lrg.gif');
  setTimeout(function() {
    $('.gallery').empty();
  }, 2000)
};

$('.galleryItem').click(function(e){
    e.preventDefault();
    var alt = $(this).children("img").attr("alt");

    pickArt(alt);
});