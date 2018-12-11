const express = require('express')
var bodyParser = require('body-parser')
const store = require('./store')
var path    = require("path");
var nodemailer = require('nodemailer');
var mysql = require('mysql');
var alert = require('alert-node')
const knex = require('knex')(require('./knexfile'))
var fs = require('fs');
//var busboy = require('connect-busboy');

var con = mysql.createConnection({
	host: 'ls-d5e856bd4792d1c8400c321d9e6e0c10c3ffc9e8.c0o4lddlobrx.us-east-1.rds.amazonaws.com',
	user: 'dbmasteruser',
	password: 'password',
	database: 'Project'
});

var ejs = require('ejs')

const app = express()
//app.use(busboy());

var name;
var email;
var password;
var publisher;
var code;
var id;
var categorylist = [];



app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '200mb'
}));

app.post('/createUser', (req, res) => {
	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: '424EmailSender@gmail.com',
			pass: 'databases'
		}
	});

	code = Math.floor(Math.random() * Math.floor(9999));

	var mailOptions = {
		from: '424EmailSender@gmail.com',
		to: req.body.email,
		subject: 'Verification Email',
		text: code.toString()
	};

	console.log(req.body)

	transporter.sendMail(mailOptions,function(error,info){
		if(error){
			console.log(error);
		} else {
			console.log('Email sent: ' + info.response)
			name = req.body.name
			email = req.body.email
			password = req.body.password
			publisher =  req.body.publisher
			res.sendFile(path.join(__dirname + '/createUser.html'))

		}  

	})
})

app.post('/login', (req,res) => {


	var d = new Date().toJSON();

	date = d.toString().split('T')[0].split('-');
	datenumber = date[0] + date[1] + date[2];
	console.log(datenumber)
	var query = "SELECT MessageID from message_table where DATEDIFF(";



	var query = "SELECT CategoryName from categories"
	con.query(query, function(err,result,fields) {
		if(err) throw err;
		if(result === undefined || result.length == 0){
			categorylist = [];
		} else {
			result.forEach(function(r) {
				categorylist.push(r['CategoryName']);
			});
			console.log(categorylist)
			
		}
	})


	//used to login by checking database

	var query = "SELECT publisher, id FROM user where email = " + mysql.escape(req.body.email) + " AND password = " + mysql.escape(req.body.password);

	con.query(query, function(err,result,fields) {
		if (err) throw err;
		if(result === undefined || result.length == 0){
			alert('Invalid email or password.')
			res.sendFile(__dirname + '/index.html')     
		}
		else if(result[0]['publisher'] == 0){
			console.log(categorylist)
			res.render('reader.ejs', {categories: categorylist})
		} else if (result[0]['publisher'] == 1){
			email = req.body.email
			password = req.body.password
			id = result[0]['id']
			console.log(id)
			res.render('publisher.ejs')
		} 
	})



	//testing purpose to login as reader
	/*res.render('reader.ejs', {
		posts: [1,2,3,4,5],
		categories: categorylist
	})*/
	//testing purpose to login as publisher
	/*res.render('publisher.ejs', {
		posts: [
			{name: 'Dan',
			category: 'Colors',
			description: 'blue, red , yellow'
			}
		] 
	})*/

})


app.post('/verifyUser', (req,res) => {
	console.log(req.body)
	if(req.body.entered == code.toString()){
		store
		.createUser({
			name: name,
			email: email,
			password: password,
			publisher: publisher
		})
		.then(() => res.sendStatus(200))
		res.sendFile(path.join(__dirname + '/index.html'))
	} else {
		console.log('incorrect code')
	}
})

app.post('/queryUser', (req, res) => {
	store
	.queryUser({
		name: req.body.name
	})
	res.sendFile(path.join(__dirname+'/index.html'));
})


// Publisher end points

app.post('/postStory', (req, res) => {
  /*var fstream;
  req.pipe(req.busboy);
  req.busboy.on('file', function (fieldname,file,filename) {
    console.log("Uploading: " + filename);
    fstream = fs.createWriteStream(__dirname + '/files/' + filename);
    file.pipe(fstream);
    fstream.on('close', function() {
      res.redirect('back');
    });
  });*/
	console.log('post Story')
	console.log(id)
	console.log(req.body.b64pic);
	store
	.postStory({
		Email: email,
		Password: password,
		UserID: id,
		Content: req.body.comment,
		StartTime: req.body.starttime,
		EndTime: req.body.endtime,
		Latitude: req.body.latitude,
		Longitude: req.body.longitude,
		Range: req.body.range,
		Categories: req.body.category,
		Media: req.body.b64pic
	})
	.then(() => res.sendStatus(200))
	res.render('publisher.ejs');
})

app.post('/searchStories', (req, res) => {
	var query = "SELECT U.name, M.Content, M.Categories, M.Media FROM message_table M \
	INNER JOIN user U ON U.id = M.UserID WHERE M.Categories LIKE \"%{" + mysql.escape(req.body.category) + "}%\"\
	AND M.range > SQRT(POW(M.Latitude * 69 - " + 69*req.body.lat + ", 2) + \
	POW(M.Longitude * 69 - " + 69*req.body.long + ", 2))";
	con.query(query, function(err,result,fields) {
		if(result === undefined || result.length == 0){
			posts = [];
			console.log("empty")
			res.render('publisher.ejs');
		}
		else {
			posts = [];
			result.forEach(function(r){
				posts.push({name: r['name'],
					category: r['Categories'],
					media: r['Media'],
					description: r['Content']
				})       
			});
			res.render('publisher.ejs', posts)
		}
	})
  /*store
    .searchStories({
      Category: req.body.category,
      Latitude: req.body.lat,
      Longitude: req.body.long
  })*/
	//res.render('publisher.ejs', {posts: [req.body.category]})

})

app.post('/addCategory', (req, res) => {
	store.addCategory({
		CategoryName: req.body.categoryname,
		Parent: req.body.parentcategory
	})
	.then(() => res.sendStatus(200))
	res.render('publisher.ejs');
})

// Reader end points

app.post('/findStories', (req, res) =>{
	

	console.log('Lat:' + req.body.lat)
	console.log('Long:' + req.body.long)
	console.log('Categories:' + req.body.categories)

	var cats = req.body.categories.toString().split(',');

	var query = "SELECT U.name, M.Content, M.Categories FROM message_table M, user U \
	WHERE M.range > SQRT(POW(M.Latitude - " + 69*req.body.lat + ", 2) + \
	POW(M.Longitude - " + 69*req.body.long + ", 2))";

	for (var i = cats.length - 1; i >= 0; i--) {
		if (i == cats.length-1) {
			query += " AND (message_table.Categories LIKE \"%{" + cats[i] + "}%\""
		} else {
			query += " OR message_table.Categories LIKE \"%{" + cats[i] + "}%\""
		}	
	}
	if (cats.length > 0) {
		query += ");"

	}

	con.query(query, function(err,result,fields) {
		if(result === undefined || result.length == 0){
			posts = [];
			console.log("empty")
			res.render('reader.ejs', {categories: categorylist});
		}
		else {
			posts = [];
			result.forEach(function(r){
				posts.push({name: r['name'],
					category: r['Categories'],
					media: r['Media'],
					description: r['Content']
				})       
			});
			res.render('reader.ejs', {posts: posts, categories: categorylist})
		}
	})
})




app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(7555, () => {
	console.log('Server running on http://localhost:7555')
})
