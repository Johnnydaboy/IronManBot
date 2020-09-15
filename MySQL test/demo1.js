//const { reject } = require('async');
//const { SystemChannelFlags } = require('discord.js');
const { connect } = require('mysql');
//const mysql      = require('mysql2/promise');
const {mysqlPass} = require('./config.json');

/*
async function connectToDatabase() {
	const connection = await mysql.createConnection({
		host     : 'localhost',
		user     : 'jonathan',
		password : mysqlPass,
		database : 'test',
	});

	console.log("connection created");

	let userRows = [];
	
	try{
		userRows = await connection.query("SELECT value FROM characters");
		console.log("Inside try\n", tableRecieved);
	} catch(err) {
		console.error("failed to retrieve values in the table", err);
	}

	console.log("Outside try\n", userRows);

	for(let i = 0; i < userRows[0].length; i++){
		
		
		console.log("in row ", i, userRows[0][i]);
	}
}
*/
//connectToDatabase();

// whoops
/*
function getValues(){
	return new Promise((resolve, reject) => {
		connection.query(
			"SELECT value FROM characters", 
			function (err, result){
				if(result === undefined){
					reject(new Error("Error, row undefined"));
				}else{
					resolve(result);
				}
			}
		)
	});
}
*/


const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'jonathan',
    password : mysqlPass,
    database : 'test',
});

connection.connect(function(err) {
    console.log("Start of connection");
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
 
    console.log('connected as id ' + connection.threadId);
  
    var sql = "CREATE TABLE characters (name VARCHAR(64), value FLOAT)";
    
    connection.query(sql, function(err, results, fields){
        if(err) throw err;
        console.log("Table Created");
    });
    
    
    var sql = "ALTER TABLE characters ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY";
    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table altered");
    });
    
    
    var characterNameA = ["Sheik", "Puff", "Peach", "Marth"]; // 5.5
    var characterNameB = ["Fox", "Falco", "Falcon"]; // 5
    var characterNameC = ["Ganon", "Yoshi", "Pikachu", "Doc", "Luigi", "Samus"]; // 2.5
    var characterNameD = ["DK", "Mario", "Icies"]; // 2
    var characterNameE = ["YL", "Link", "G&W"]; // 1
    var characterNameF = ["Roy", "Mewtwo", "Zelda", "Pichu"]; // 0.5
    var characterNameG = ["Ness", "Kirby", "Bowser"]; // 0

    var populateChar = "INSERT INTO characters (name, value) VALUES?";
    var values = [];
    for(var i = 0; i < characterNameA.length; i++){
      values.push([characterNameA[i], 5.5]);
    }
    for(var i = 0; i < characterNameB.length; i++){
      values.push([characterNameB[i], 5]);
    }
    for(var i = 0; i < characterNameC.length; i++){
      values.push([characterNameC[i], 2.5]);
    }
    for(var i = 0; i < characterNameD.length; i++){
      values.push([characterNameD[i], 2]);
    }
    for(var i = 0; i < characterNameE.length; i++){
      values.push([characterNameE[i], 1]);
    }
    for(var i = 0; i < characterNameF.length; i++){
      values.push([characterNameF[i], 0.5]);
    }
    for(var i = 0; i < characterNameG.length; i++){
      values.push([characterNameG[i], 0]);
    }

    connection.query(populateChar, [values], function(err, results, fields){
      if (err) throw err;
      console.log("Number of records inserted: " + results.affectedRows);
    });
    
});



/*
connection.query("SELECT * FROM characters", function(err, results, fields){
    if(err) throw err;
    console.log("Characters:\n", results);
});
*/

function promiseToDatabaser(sql){
    return new Promise((resolve, reject) => {
        console.log("Starting promise");

        let arr = connection.query(sql, function(err, results, fields){
            if(err) throw err;
            //console.log("results inside\n", results);
            arr = results;
            //console.log("a inside is\n", a);
        });

		resolve(arr);
		reject(arr)
    });
}

/*
async function connect(){
	try{
		await new Promise((resolve, reject) => {
			connection.connect(function(err) {
				if(err){
					console.error('error connecting: ' + err.stack);
					reject(err);
				}
				console.log('connected as id ' + connection.threadId);
				resolve();
			});
		});
	}
	catch(err){
		console.log(err);
	}
}
*/

async function myFunc(){

	let sql = "SELECT value FROM characters";

	const resultData = await promiseToDatabaser(sql);
	console.log("Process recieved!");
	return resultData;
}
