var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var config = {
  port: 3040
};

server.listen(config.port);

app.get('/', function (req, res) {
  res.status(200);
  res.end('Playify server life on port %s', config.port);
});

var CLIENTS = [];
var TRACK = '';

// Socket connection initialised
io.on('connection', function (socket) {
  var clientId = socket.id;
  CLIENTS.push(clientId);

  // Client event when he/she connected to Spotify
  socket.on('client-spotify-connected', function () {
    socket.emit('server-ready', { id: clientId, track: TRACK });
  });

  // Client event when he/she controls Spotify
  socket.on('client-control', function (data) {
    if (data.type === 'play') {
      console.log('- Client %s played %s -', clientId, TRACK);
      data.params.track = TRACK;
    } else if (data.type === 'changeTrack') {
      TRACK = data.params;
    }
    io.emit('server-control', data);
  });

  // Remove the client from CLIENTS when they disconnect
  socket.on('disconnect', function () {
    CLIENTS.splice(CLIENTS.indexOf(clientId), 1);
  });

});

