var socket = io();

function pickArt(altTag) {
  artNumber = altTag;
  console.log('art picked' + artNumber);
  socket.emit('artNumber', artNumber);
};

$('.galleryItem').click(function(e){
    e.preventDefault();
    var alt = $(this).children("img").attr("alt");

    pickArt(alt);
});