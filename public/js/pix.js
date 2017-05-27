var socket = io();

function pickArt() {
  artNumber = $('input[name=art]:checked').val();
  console.log()
  socket.emit('artNumber', artNumber);
};
