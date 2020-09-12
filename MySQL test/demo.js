var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'jonathan',
  password : '0@MIjR$K!BEZ',
  database : 'test',
});
 
connection.connect(function(err) {
  console.log("Start of connection");
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);

  connection.query("SELECT * FROM phoneBook", function(err, results, fields){
    if(err) throw err;
    console.log(results);
  });

});
