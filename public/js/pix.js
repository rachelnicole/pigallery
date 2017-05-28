var socket = io();

function pickArt() {
  artNumber = $('input[name=art]:checked').val();
  console.log('art picked' + artNumber);
  socket.emit('artNumber', artNumber);
};
