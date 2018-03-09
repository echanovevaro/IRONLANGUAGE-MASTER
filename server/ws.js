module.exports = (io) => {
	var sockets = {};

	io.on('connection', function (socket) {
		var id = socket.request._query["id"];

		sockets[id] = socket;

		socket.on('disconnect', () => {
			delete sockets[id];
			if (socket.room) {
				socket.leave(socket.room);
			}
		});

		socket.on('sendmessage', (msg) => {
			if (sockets[msg.to._id]) {
				sockets[msg.to._id].emit('newmessage', msg);
			}
		});

		socket.on('addtoroom', (meetupId) => {
			socket.room = meetupId;
			socket.join(meetupId);
		});

		socket.on('sendtoroom', (message) => {
			socket.broadcast.to(socket.room).emit('updateroom', message);
		});
	});
}