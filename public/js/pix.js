var socket = io();
var timeout;

function pickArt(altTag) {
  artPiece = altTag;
  console.log('art picked' + artPiece);
  socket.emit('artPiece', artPiece);
  $('.gallery').html('<img src="public/images/' + artPiece + '-lrg.gif">');
  timeout = setTimeout(function() {
    $('.gallery').empty();
    timeout = undefined;
  }, 2000)
};

$('.galleryItem').click(function(e){
    e.preventDefault();
    var alt = $(this).children("img").attr("alt");

    if (timeout) {
      clearTimeout(timeout);
    }

    pickArt(alt);
});
