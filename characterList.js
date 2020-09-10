const { SystemChannelFlags } = require("discord.js");
const Algorithm = require("./algorithm.js")

module.exports = class characterList {

    constructor(newPlaceHolderCharsOriginal, newCNameA, newCNameB, newCNameC, 
        newCNameD, newCNameE, newCNameF, newCNameG) {

        this.placeHolderCharsOriginal = newPlaceHolderCharsOriginal;
        this.cNameA = newCNameA;
        this.cNameB = newCNameB;
        this.cNameC = newCNameC;
        this.cNameD = newCNameD;
        this.cNameE = newCNameE;
        this.cNameF = newCNameF;
        this.cNameG = newCNameG;
    }

    // Return a number of characters based on the min and max ad point values of each character
    generateTeamBin(min, max, forceHighTier) {
        var placeHolderChars =
        [5.5, 5.5, 5.5, 5.5, 
            5, 5, 5, 
            2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 
            2, 2, 2, 
            1, 1, 1, 
            0.5, 0.5, 0.5, 0.5, 
            0, 0, 0];

        // Scramble the temp array
        var i;
        for(i = 0; i < placeHolderChars.length; i++) {
            var index = Math.floor(Math.random() *  (i + 1))

            var temp = placeHolderChars[index];
            placeHolderChars[index] = placeHolderChars[i];
            placeHolderChars[i] = temp;
        }        

        // debugging use
        console.log(placeHolderChars);
        console.log(this.cNameA);
        console.log(this.cNameB);
        console.log(this.cNameC);
        console.log(this.cNameD);
        console.log(this.cNameE);
        console.log(this.cNameF);
        console.log(this.cNameG);
        
        var teamNotFound = true;
        var charArrInt = [];

        // Force a higher tier character
        var level = 0;
        if(forceHighTier) {
            charArrInt.push(5.5);
            level++;
        }

        //!!! NEEDS FIXING
        //!!! Will infintely loop if the team comp doesn't exist, needs to be fixed
        //!!! !ironman 6 -f will loop even though a team comp is possible
        while(teamNotFound) {
            var target = Algorithm.getRandVal(min, max);
            console.log("Before forced: " + target);
            // 'target' will be lower if '-f' is enabled
            
            if(forceHighTier) {
                target = target - 5.5;
                console.log("After forced: " + target);
            }
            
            if(Algorithm.isSubsetSum(placeHolderChars, placeHolderChars.length, target, charArrInt, level, 5))
            {
                teamNotFound = false;
            }
        }

        // Get a match and reset the character arrays of different tiers
        var cList = this.getMatch(charArrInt);
        this.reset;
        
        //console.log(charArrInt);
        //console.log(cList);

        return cList;
    }

    /*
    Get a match based on the charArrInt, will remove characters from an array to signify that 
    they are already in use and cannot be used a second time
     */
    getMatch(charArrInt)
    {
        var charList = [];

        for(var i = 0; i < 5; i++) {
            var getChar = 0;
            console.log("charrArr[" + i + "] " + charArrInt[i]);
            if(charArrInt[i] == 5.5) {
                getChar = Math.floor(Math.random() * this.cNameA.length);
                charList.push(this.cNameA[getChar]);
                this.cNameA.splice(getChar, 1);
            }
            else if(charArrInt[i] == 5) {
                getChar = Math.floor(Math.random() * this.cNameB.length);
                charList.push(this.cNameB[getChar]);
                this.cNameB.splice(getChar, 1);
            }
            else if(charArrInt[i] == 2.5) {
                getChar = Math.floor(Math.random() * this.cNameC.length);
                charList.push(this.cNameC[getChar]);
                this.cNameC.splice(getChar, 1);
            }
            else if(charArrInt[i] == 2) {
                getChar = Math.floor(Math.random() * this.cNameD.length);
                charList.push(this.cNameD[getChar]);
                this.cNameD.splice(getChar, 1);
            }
            else if(charArrInt[i] == 1) {
                getChar = Math.floor(Math.random() * this.cNameE.length);
                charList.push(this.cNameE[getChar]);
                this.cNameE.splice(getChar, 1);
            }
            else if(charArrInt[i] == 0.5) {
                getChar = Math.floor(Math.random() * this.cNameF.length);
                charList.push(this.cNameF[getChar]);
                this.cNameF.splice(getChar, 1);
            }
            else if(charArrInt[i] == 0) {
                getChar = Math.floor(Math.random() * this.cNameG.length);
                charList.push(this.cNameG[getChar]);
                this.cNameG.splice(getChar, 1);
            }
            console.log(getChar + " " + charList);
        }

        return charList;
    }

    // resets the character lists of different tiers after 'getMatch()' has been called
    reset() {
        var characterNameA = ["Sheik", "Puff", "Peach", "Marth"]; // 5.5
        var characterNameB = ["Fox", "Falco", "Falcon"]; // 5
        var characterNameC = ["Ganon", "Yoshi", "Pikachu", "Doc", "Luigi", "Samus"]; // 2.5
        var characterNameD = ["DK", "Mario", "Icies"]; // 2
        var characterNameE = ["YL", "Link", "G&W"]; // 1
        var characterNameF = ["Roy", "Mewtwo", "Zelda", "Pichu"]; // 0.5
        var characterNameG = ["Ness", "Kirby", "Bowser"]; // 0

        this.cNameA.splice(0,this.cNameA.length);
        this.cNameB.splice(0,this.cNameB.length);
        this.cNameC.splice(0,this.cNameC.length);
        this.cNameD.splice(0,this.cNameD.length);
        this.cNameE.splice(0,this.cNameE.length);
        this.cNameF.splice(0,this.cNameF.length);
        this.cNameG.splice(0,this.cNameG.length);

        var i;
        for(i = 0; i < characterNameA.length; i++) {
            this.cNameA.push(characterNameA[i]);
        }
        for(i = 0; i < characterNameB.length; i++) {
            this.cNameB.push(characterNameB[i]);
        }
        for(i = 0; i < characterNameC.length; i++) {
            this.cNameC.push(characterNameC[i]);
        }
        for(i = 0; i < characterNameD.length; i++) {
            this.cNameD.push(characterNameD[i]);
        }
        for(i = 0; i < characterNameE.length; i++) {
            this.cNameE.push(characterNameE[i]);
        }
        for(i = 0; i < characterNameF.length; i++) {
            this.cNameF.push(characterNameF[i]);
        }
        for(i = 0; i < characterNameG.length; i++) {
            this.cNameG.push(characterNameG[i]);
        }
    }
};