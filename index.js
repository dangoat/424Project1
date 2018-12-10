const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
var path    = require("path");
var nodemailer = require('nodemailer');

var ejs = require('ejs')

const app = express()

var name;
var email;
var password;
var publisher;
var code;

app.use(express.static('public'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
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


	//used to login by checking database
	/*
	store.loginUser({
		email = req.body.email,
		password = req.body.password
	})

	res.sendStatus(200)
	*/

	//testing purpose to login as reader
	res.render('reader.ejs', {posts: [1,2,3,4,5]})
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
	console.log('post Story')
	store
		.postStory({
			Email: email,
			Password: password,
			Content: req.body.comment,
			StartTime: req.body.starttime,
			EndTime: req.body.endtime,
			Location: req.body.location,
			Range: req.body.range,
			Categories: req.body.category,
      Media: req.body.pic
		})
    .then(() => res.sendStatus(200))
    res.render('publisher.ejs');
})

app.post('/searchStories', (req, res) => {
	res.render('publisher.ejs', {posts: [req.body.category]})

})

app.post('/addCategory', (req, res) => {
	console.log('Add category:' + req.body.categoryname)
})

// Reader end points

app.post('/findStories', (req, res) =>{
	
	res.render('reader.ejs', {posts: [req.body]})
})




app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
