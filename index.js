const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
var path    = require("path");
var nodemailer = require('nodemailer');
var mysql = require('mysql');


var con = mysql.createConnection({
  host: 'ls-d5e856bd4792d1c8400c321d9e6e0c10c3ffc9e8.c0o4lddlobrx.us-east-1.rds.amazonaws.com',
  user: 'dbmasteruser',
  password: 'password',
  database: 'Project'
});

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
	
var query = "SELECT publisher FROM user where email = " + mysql.escape(req.body.email) + " AND password = " + mysql.escape(req.body.password);
    
    con.query(query, function(err,result,fields) {
      if (err) throw err;

      if(typeof result == undefined || typeof result[0] == undefined){
      	
      	alert('Invalid email or password.')
      	res.sendFile(__dirname + '/index.html')
      	      
      }

      if(result[0]['publisher'] == 0){
        res.render('reader.ejs')
      } else if (result[0]['publisher'] == 1){
        res.render('publisher.ejs')
      } 
    })

  /*store.loginUser({
    email: req.body.email,
    password: req.body.password
  })
  .then(function(result) {
    console.log(result)
  })*/

	/*if (store.loginUser({
		email: req.body.email,
		password: req.body.password
	})) {
    res.render('publisher.ejs')
  } else {
    res.render('reader.ejs')
  }*/


	//res.sendStatus(200)
	

	//testing purpose to login as reader
	//res.render('reader.ejs', {posts: [1,2,3,4,5]})
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
  store
    .searchStories({
      Category: req.body.category,
      Latitude: req.body.lat,
      Longitude: req.body.long
    })
    .then(() => res.sendStatus(200))
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
