
module.exports = function (app) {
	var bodyParser = require('body-parser');

	//routes
	app.get("/",function (req, res) {
		res.render("index");
	});

	app.get("/chat",function (req, res) {
		res.render("chat");
	});

	app.get("/contact",function (req, res) {
		res.render('contact');
	});

	var urlencodedParser = bodyParser.urlencoded({ extended: false })
	app.post("/contact", urlencodedParser, function (req, res) {
		console.log(req.body);
		res.render('contact-success', {data:req.body});
	});

	
}

