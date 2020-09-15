const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token, mysqlPass} = require('./config.json');
const CharacterList = require("./characterList.js");

const { SystemChannelFlags } = require('discord.js');
const { Sequelize, QueryTypes } = require('sequelize');
const sequelize = new Sequelize('test', 'jonathan', '0@MIjR$K!BEZ', {
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
        
        "Additional settings: !ironman [] [] []\n\n" +
        
        "-f\n" +
           "Forces a high tier character in your team comp\n" +
        "```");
    }
    else if(splitMsg[0] === prefix + 'ironman') {
        var min = 0;
        var max = 0;
        var forceHighTier = false;

        // !ironman 5 10 -f
        if (splitMsg.length > 2 && !isNaN(splitMsg[1]) && !isNaN(splitMsg[2])) {
            if (splitMsg.length > 3 && splitMsg[3] === '-f') {
                forceHighTier = true;
            }
            var min = splitMsg[1];
            var max = splitMsg[2];
        }
        // !ironman 10 -f
        else if (splitMsg.length > 1 && !isNaN(splitMsg[1])) {
            if (splitMsg.length > 2 && splitMsg[2] === '-f') {
                forceHighTier = true;
            }
            console.log("splitmsg[1]: "+ splitMsg[1]);
            var min = splitMsg[1];
            var max = splitMsg[1];
        }
        // !ironman -f
        else {
            if (splitMsg[1] === '-f') {
                forceHighTier = true;
            }
            var min = 10.5;
            var max = 10.5;
        }

        // Find a better way to implement commands from the prompt for '-f' setting etc.
        
        getMatch(message, min, max, forceHighTier);
    }
});

client.login(token);

// asynchronous functions

async function getMatch(message, min, max, forceHighTier) {

    let [charName, charValue] = await connectToDatabase();
    console.log(charName, charValue);

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

    console.log(charBins);
    // !!! Check why binTiers doesn't have to be pushed again;
    console.log(binTiers);

    let characterList = new CharacterList(charValue, charBins, binTiers);
    let [cList, teamArrInt] = characterList.generateTeamBin(min, max, 5, forceHighTier);

    let combined = [];

    for(let i = 0; i < cList.length; i++) {
        combined.push(cList[i] + "[" + teamArrInt[i] + "]");
    }
    message.channel.send("```" + combined + "```");
}

async function connectToDatabase() {

    let rowsKey = await sequelize.query("SELECT * FROM characters", { type: QueryTypes.SELECT });
    let rowsValue = [];
    let rowsName = [];
    for(let i = 0; i < rowsKey.length; i++) {
        rowsValue.push(rowsKey[i].value);
        rowsName.push(rowsKey[i].name);
    }

    console.log(rowsName, rowsValue);

    return [rowsName, rowsValue];
}
