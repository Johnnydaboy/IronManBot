const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token, mysqlPass} = require('./config.json');
const CharacterList = require("./characterList.js");

const { SystemChannelFlags } = require('discord.js');
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize('test', 'jonathan', mysqlPass, {
    host: 'localhost',
    dialect: 'mysql'
});

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {

    console.log(message.content);
    var messageArr = [];
    var msg = message.content;
    var splitMsg = msg.split(" ");
    //console.log(splitMsg);
	if (message.content === prefix + 'ping') {
        // send back "Pong." to the channel the message was sent in
        message.channel.send('Pong.');
    }
    else if(message.content === prefix + 'help') {
        message.channel.send("```" + 
        "Commands: \n\n" +

        "!ironman\n" +
           "Returns you a random team comp that adds up to 10.5\n\n" +
        
        "!ironman #\n" +
           "Returns you a random team comp that adds up to #\n\n" +
        
        "!ironman # #\n" +
           "Returns you a random team comp between # & # that adds up to #\n\n\n" +
        
        "Additional settings: !ironman [] [] [] (Tac it on to any of the above commands)\n\n" +
        
        "-h\n" +
            "Forces a high tier character in your team comp\n" +

        "-m\n" + 
            "Forces a mid tier character in your team comp\n" + 

        "-l\n" +
            "Forces a low tier character in your team comp\n\n" + 

        "Thank god I did argument parsing back in my C days, makes adding settings like this look like a joke" +
        "```");
    }
    else if(splitMsg[0] === prefix + 'ironman') {
        let min = 0;
        let max = 0;
        let forceHighTier = false;
        // [high, mid, low];
        let checkForced = ['-h', '-m', '-l'];
        let forceCharTier = [false, false, false]; 

        // !ironman 5 10 -h -m -l
        if (splitMsg.length > 2 && !isNaN(splitMsg[1]) && !isNaN(splitMsg[2])) {

            // Check if anymore arguments exist
            if (splitMsg.length > 3) {
                // If arguments exist, compare them to 'checkForced'
                for(let i = 3; i < splitMsg.length; i++) {
                    // If 'splitMsg[i]' is in 'checkForced', set the corresponding boolean to true
                    for(let j = 0; j < checkForced.length; j++) { 
                        if(splitMsg[i] === checkForced[j]) {
                            forceCharTier[j] = true;
                        }
                    }
                }
            }
            min = splitMsg[1];
            max = splitMsg[2];
        }
        // !ironman 10 -h -m -l
        else if (splitMsg.length > 1 && !isNaN(splitMsg[1])) {

            // Check if anymore arguments exist
            if (splitMsg.length > 2) {
                // If arguments exist, compare them to 'checkForced'
                for(let i = 2; i < splitMsg.length; i++) {
                    // If 'splitMsg[i]' is in 'checkForced', set the corresponding boolean to true
                    for(let j = 0; j < checkForced.length; j++) { 
                        if(splitMsg[i] === checkForced[j]) {
                            forceCharTier[j] = true;
                        }
                    }
                }
            }
            min = splitMsg[1];
            max = splitMsg[1];
        }
        // !ironman -h -m -l
        else {
            // Check if anymore arguments exist
            if (splitMsg.length > 1) {
                // If arguments exist, compare them to 'checkForced'
                for(let i = 1; i < splitMsg.length; i++) {
                    // If 'splitMsg[i]' is in 'checkForced', set the corresponding boolean to true
                    for(let j = 0; j < checkForced.length; j++) { 
                        if(splitMsg[i] === checkForced[j]) {
                            forceCharTier[j] = true;
                        }
                    }
                }
            }
            min = 10.5;
            max = 10.5;
        }

        console.log("forceCharTier: ", forceCharTier);

        // Find a better way to implement commands from the prompt for '-f' setting etc.
        
        getMatch(message, min, max, forceCharTier);
    }
});

client.login(token);

// asynchronous functions

async function getMatch(message, min, max, forceCharTier) {

    let [charName, charValue] = await connectToDatabase();
    // Debugging use console.log(charName, charValue); 

    // This value stores the arrays of arrays of binned characters
    let charBins = [];
    // Start of with the first value as the top most bin
    let curBinValue = charValue[0];
    // Create empty array to store all characters with the same point value
    let curBin = [];
    // Create bin tiers to use for later
    let binTiers = [];
    binTiers.push(curBinValue);

    for(let i = 0; i < charValue.length; i++) {
        // If a character has the same point value, bin it with the 'curBin'
        if(charValue[i] == curBinValue) {
            curBin.push(charName[i]);
        } 
        // Once we find a different point value character push 'curBin' into 'charBins' and set a new 'curBinValue' for 'curBIn'
        else {
            charBins.push(curBin);
            binTiers.push(charValue[i]);
            curBin = [];
            curBinValue = charValue[i];
            curBin.push(charName[i]);
        }
    }
    // To avoid fence posting, pusht the last binned characters inside 'curBin' to 'charBins'
    charBins.push(curBin);

    // Debugging use console.log(charBins);
    // !!! Check why binTiers doesn't have to be pushed again; I'm never going to get to this aren't I?
    // Debugging use console.log(binTiers);

    let characterList = new CharacterList(charValue, charBins, binTiers);
    let arrTeamList = characterList.generateTeamBin(min, max, 5, forceCharTier);

    // Check if output is not an array to send error message or send the team lists
    if(!(Array.isArray(arrTeamList))){
        message.channel.send("```" + arrTeamList + "```");
    } else {
        let combined = [];

        for(let i = 0; i < arrTeamList[0].length; i++) {
            combined.push(arrTeamList[0][i] + "[" + arrTeamList[1][i] + "]");
        }

        message.channel.send("```" + combined + "```");
    }
}

// Asyncronous function to connect to mysql database
async function connectToDatabase() {

    let rowsKey = await sequelize.query("SELECT * FROM characters", { type: QueryTypes.SELECT });
    let rowsValue = [];
    let rowsName = [];
    // Push values and names of each character in the query into an array
    for(let i = 0; i < rowsKey.length; i++) {
        rowsValue.push(rowsKey[i].value);
        rowsName.push(rowsKey[i].name);
    }

    //console.log(rowsName, rowsValue);

    return [rowsName, rowsValue];
}
