var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(3040);

app.get('/', function (req, res) {
  res.status(200);
  res.end('Connected to Playify.');
});

var CLIENTS = [];

var STATUS = {
  track: 'spotify:track:6jdOi5U5LBzQrc4c1VT983'
};

io.on('connection', function (socket) {
  var clientId = socket.id;
  CLIENTS.push(clientId);

  console.log(CLIENTS);

  // Add connected person to clients array
 setTimeout(function () {
    socket.emit('server-control', { type: 'pause', params: [] });
  }, 3000);

  socket.on('client-spotify-connected', function () {
    console.log('Client %s is ready', clientId);
    socket.emit('server-ready',{ id: clientId, status: STATUS });
  });

  socket.on('client-control', function (data) {
    socket.emit('server-control', data);
  });

  socket.on('disconnect', function () {
    CLIENTS.splice(CLIENTS.indexOf(clientId), 1);
  });

});

