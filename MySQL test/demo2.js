const { SystemChannelFlags } = require('discord.js');
const { Sequelize, QueryTypes } = require('sequelize');
const {mysqlPass} = require('./config.json');
const sequelize = new Sequelize('test', 'jonathan', mysqlPass, {
    host: 'localhost',
    dialect: 'mysql'
});

async function connectToDatabase2() {
    /*
    try {
        await sequelize.authenticate();
        console.log("Connection successful");
    } catch(err) {
        console.log("Connection failed");
    }
    */

    let rowsKey = await sequelize.query("SELECT * FROM characters", { type: QueryTypes.SELECT });
    let rowsValue = [];
    let rowsName = [];
    for(let i = 0; i < rowsKey.length; i++) {
        rowsValue.push(rowsKey[i].value);
        rowsName.push(rowsKey[i].name);
    }
    console.log(rowsValue, rowsName);
}

connectToDatabase2();

async function connectToDatabase1() {
	const connection = await mysql.createConnection({
		host     : 'localhost',
		user     : 'jonathan',
		password : '0@MIjR$K!BEZ',
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

//connectToDatabase1();