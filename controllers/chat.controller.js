
module.exports = function (app, server) {
	var socket = require('socket.io');

	var io = socket(server);

	var onlineConnections = [];
	
	io.on('connection', function(socket){
		
		socket.on("name", function (data) {
			var temp = {
				name: data.name,
				socket_id : socket.id
			}
			onlineConnections.push(temp);
			console.log("Connected User Name: ", temp.name);
			console.log(onlineConnections);

			io.emit("onlineUsers",onlineConnections);
			
		});

		socket.on("onetoonechat",function (data, callback) {
			if (!data.msg) {
				//click to start chat
				console.log(data);
				callback("done");
			}else{
				//send to receiver
				socket.broadcast.to(data.receiver).emit('message', data);
				callback("sent to that node");
			}
			
		});





		socket.on("disconnect", function () {
			for(var i=0; i<onlineConnections.length; i++){
				if (onlineConnections[i].socket_id == socket.id) {
					console.log("Disconnected User Name: ",onlineConnections[i].name);
					onlineConnections.splice(i,1);
				}
			}
			console.log(onlineConnections);
			io.emit("onlineUsers",onlineConnections);
		})
	});

	
}

