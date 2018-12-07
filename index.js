const express = require('express')
const bodyParser = require('body-parser')
const store = require('./store')
var path    = require("path");
var nodemailer = require('nodemailer');
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
    res.sendFile(__dirname + '/index.html')
  } else {
  	console.log('incorrect code')
  }
})

app.post('/queryUser', (req, res) => {
	store
		.queryUser({
			name: req.body.name
		})
	res.sendStatus(200)
})

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname+'/index.html'));
});

app.listen(7555, () => {
  console.log('Server running on http://localhost:7555')
})
