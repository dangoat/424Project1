const knex = require('knex')(require('./knexfile'))
var mysql = require('mysql');

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
  	console.log(`Name: ${name}`)
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

  postStory (data) {
  	UserID = data.UserID
	Content = data.Content
	StartTime = data.StartTime
	EndTime = data.EndTime
	Location = data.Location
	Range = data.Range
	Categories = data.Categories
	Media = data.Media
	console.log(`Content ${Content}`)
	return knex('message_table').insert({
      UserID,
      Content,
      StartTime,
      EndTime,
      Location,
      Range,
      Categories,
      Media
    })
  }
}