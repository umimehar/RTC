
var data = [
	{item: "milk"},
	{item: "Wood"},
	{item: "Bags"},
	{item: "Watches"},
	{item: "OIL"},
]
module.exports = function (app) {
	var bodyParser = require('body-parser');
	var urlencodedParser = bodyParser.urlencoded({ extended: false });

	//routes
	app.get("/todo",function (req, res) {
		res.render("todo", {data:data,msg:{}});
	});
	
	app.post("/todo", urlencodedParser, function (req, res) {
		var msg = {};
		var present = 0;
		for (var i = 0; i < data.length; i++) {
			if(data[i].item == req.body.item){
				present = 1;
			}
		}
		if (!present) {
			data.push(req.body);
		}else{
			msg.postErr = "Item already present.";
		}
		
		res.render('todo', {data:data,msg:msg});
	});

	app.delete("/todo", urlencodedParser, function (req, res) {
		for (var i = 0; i < data.length; i++) {
			if(data[i].item == req.body.item){
				data.splice(i,1);
				console.log(data);
				res.send("done");
			}
		}
		
	});

	
}

