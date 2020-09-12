const Discord = require('discord.js');
const client = new Discord.Client();
const {prefix, token} = require('./config.json');
const CharacterList = require("./characterList.js");

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

        var placeHolderCharsOriginal = 
        [5.5, 5.5, 5.5, 5.5, 5, 5, 5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2, 2, 2, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0, 0, 0];
        var characterNameA = ["Sheik", "Puff", "Peach", "Marth"];
        var characterNameB = ["Fox", "Falco", "Falcon"];
        var characterNameC = ["Ganon", "Yoshi", "Pikachu", "Doc", "Luigi", "Samus"];
        var characterNameD = ["DK", "Mario", "Icies"];
        var characterNameE = ["YL", "Link", "G&W"];
        var characterNameF = ["Roy", "Mewtwo", "Zelda", "Pichu"];
        var characterNameG = ["Ness", "Kirby", "Bowser"];

        // send back character list
        let characterList = new CharacterList(placeHolderCharsOriginal, characterNameA, characterNameB, 
            characterNameC, characterNameD, characterNameE, characterNameF, characterNameG);
        var cList = characterList.generateTeamBin(min, max, forceHighTier);

        message.channel.send("```" + cList + "```");
        /*
        for(var i = 0; i < 100; i++) {
            characterList.generateTeamBin(8, 15);
        }
        */
    }
});

client.login(token);