const knex = require('knex')(require('./knexfile'))
var mysql = require('mysql');
var alert = require('alert-node')

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'password',
	database: 'Project'
});

module.exports = {
  createUser (data) {
  	name = data.name
  	email = data.email
  	password = data.password
  	publisher = data.publisher
    console.log(`Add user ${name}, email ${email}, password ${password}, publisher ${publisher}`)
    return knex('user').insert({
      name,
      email,
      password,
      publisher
    })
  },

  queryUser (data) {
  	name = data.name
  	var query = "SELECT email FROM user WHERE name = " + mysql.escape(name);
  	//return knex('user').select('email').where('name','=',name)
  	/*con.query(query)
  		.then (rows => {

  		})*/
  	con.query(query, function(err, result, fields) {
  		if (err) throw err;
  		console.log(result[0]['email']);
  		//return result[0]['email']
  	})
  },

  loginUser(data) {
  	email = data.email;
  	password = data.password;

  	var query = "SELECT type FROM user where email = " + mysql.escape(email) + " AND password = " + mysql.escape(password);
  	
  	con.query(query, function(err,result,fields) {
  		if (err) throw err;
  		if(result[0]['type'] == 0){
  			res.sendFile(__dirname + '/reader.html')
  		} else if (result[0]['type'] == 1){
  			res.sendFile(__dirname + '/publisher.html')
  		} else {
  			alert('Invalid username or password.')
  			res.sendFile(__dirname + '/index.html')
  		}
  	})
  }
}