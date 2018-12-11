const knex = require('knex')(require('./knexfile'))
var mysql = require('mysql');

var con = mysql.createConnection({
	host: 'ls-d5e856bd4792d1c8400c321d9e6e0c10c3ffc9e8.c0o4lddlobrx.us-east-1.rds.amazonaws.com',
	user: 'dbmasteruser',
	password: 'password',
	database: 'Project'
});

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

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
	Latitude = data.Latitude
  Longitude = data.Longitude
	Range = data.Range
	Categories = data.Categories
	Media = data.Media

    return knex('message_table').insert({
      UserID,
      Content,
      StartTime,
      EndTime,
      Latitude,
      Longitude,
      Range,
      Categories,
      Media
    })
	
  },

  loginUser(data) {
  	email = data.email;
  	password = data.password;

  	var query = "SELECT publisher FROM user where email = " + mysql.escape(email) + " AND password = " + mysql.escape(password);
  	
  	return (con.query(query, function(err,result,fields) {
      return result[0]['publisher']
  	}))
  },

  searchStories(data) {
  	Category = data.Category
  	Latitude = data.Latitude
    Longitude = data.Longitude

    var query = "SELECT U.name, M.Content, M.Categories FROM message_table M, user U \
                 WHERE id = UserID AND M.Categories = " + mysql.escape(Category) + " \
                 AND message_table.Range >= (SQRT(POWER(((message_table.Latitude * 69.0) - (Latitude * 69.0)),2) + POWER(((message_table.Longitude * 69.0) - (Longitude * 69.0)),2)))";
    con.query(query, function(err,result,fields) {
      result.forEach(function(result){
        console.log(result)
      });
    })
  },

  addCategory(data) {
    CategoryName = data.CategoryName
    Parent = data.Parent

    return knex('categories').insert({
      CategoryName,
      Parent  
    })
  }
}