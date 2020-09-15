const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token, mysqlPass} = require('./config.json');

const mysql      = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'jonathan',
    password : mysqlPass,
    database : 'test',
});

client.once('ready', () => {
    console.log('Ready!');

    connection.connect(function(err){
            
        console.log("Start of connection");
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }

        console.log('connected as id ' + connection.threadId);
    }); 
});

client.on('message', message => {

    console.log(message.content);
    var messageArr = [];
    var msg = message.content;
    var splitMsg = msg.split(" ");

    if(splitMsg[0] === prefix + 'ironman') {
        let min = 0;
        let max = 0;
        let forceHighTier = false;

        // !ironman 5 10 -f
        if (splitMsg.length > 2 && !isNaN(splitMsg[1]) && !isNaN(splitMsg[2])) {
            if (splitMsg.length > 3 && splitMsg[3] === '-f') {
                forceHighTier = true;
            }
            min = splitMsg[1];
            max = splitMsg[2];
        }
        // !ironman 10 -f
        else if (splitMsg.length > 1 && !isNaN(splitMsg[1])) {
            if (splitMsg.length > 2 && splitMsg[2] === '-f') {
                forceHighTier = true;
            }
            console.log("splitmsg[1]: "+ splitMsg[1]);
            min = splitMsg[1];
            max = splitMsg[1];
        }
        // !ironman -f
        else {
            if (splitMsg[1] === '-f') {
                forceHighTier = true;
            }
            min = 10.5;
            max = 10.5;
        }

        // Find a better way to implement commands from the prompt for '-f' setting etc.

        // WHY IS IT NOT WAITING FOR THE FUCKEN QUERY 
        let placeHolderCharsOriginal = [];
        placeHolderCharsOriginal = getInfo();
        
        console.log("outside connection: \n" + placeHolderCharsOriginal);

        connection.query("SELECT value FROM characters", function(err, results, fields){
            if(err) throw err;
            console.log("Characters:\n", results);
        });

        let values = [5.5, 5.5, 5.5, 5.5, 5, 5, 5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2, 2, 2, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0, 0, 0];
        
        console.log(values);
        
        var characterNameA = ["Sheik", "Puff", "Peach", "Marth"];
        var characterNameB = ["Fox", "Falco", "Falcon"];
        var characterNameC = ["Ganon", "Yoshi", "Pikachu", "Doc", "Luigi", "Samus"];
        var characterNameD = ["DK", "Mario", "Icies"];
        var characterNameE = ["YL", "Link", "G&W"];
        var characterNameF = ["Roy", "Mewtwo", "Zelda", "Pichu"];
        var characterNameG = ["Ness", "Kirby", "Bowser"];
    }
});

client.login(token);


