var express = require("express");

var webController = require('./controllers/web.controller');
var todoController = require('./controllers/todo.controller');
var chatController = require('./controllers/chat.controller');

var app = express();



//setting template engine
app.set("view engine", 'ejs');

//creating a middleware for static files
app.use(express.static('assets'));

webController(app);
todoController(app);


var server = app.listen(3000, function(){
   console.log("Server is running on 3000 port."); 
});

chatController(app, server);



















// Creating the server by http module 


// var http = require('http');
// var fs = require("fs");


// var server = http.createServer(function (req, res) {
// 	console.log("request is made from: " + req.url);
	
// 	if (req.url == "/home" || req.url == "/") {
// 		res.writeHead(200,{"Content-Type":"text/html"});
// 		fs.createReadStream("index.html").pipe(res);
// 	}else if (req.url == "/contact") {
// 		res.writeHead(200,{"Content-Type":"text/html"});
// 		fs.createReadStream("contact.html").pipe(res);
// 	}else if (req.url == "/api") {
// 		res.writeHead(200,{"Content-Type":"application/json"});
// 		var myobj = {
// 			name:"umer",
// 			age: 23
// 		};
// 		res.end(JSON.stringify(myobj));
// 	}else{
// 		res.writeHead(404,{"Content-Type":"text/html"});
// 		fs.createReadStream("404.html").pipe(res);
		
// 	}
// });

// server.listen(3000, 'localhost');
// console.log("server is live at: 3000");
