const Algorithm = require("./algorithm.js")

module.exports = class characterList {

    constructor(newCharValues, newCharBin, newBinTiers) {

        this.charValues = newCharValues;
        this.charBin = newCharBin;
        this.binTiers = newBinTiers;
    }

    // Return a number of characters based on the min and max ad point values of each character
    generateTeamBin(min, max, howManyChars, forceHighTier) {
        let tempCharValues = [];

        for(let i = 0; i < this.charValues.length; i++) {
            tempCharValues[i] = this.charValues[i];
        }

        // Scramble the temp array
        for(let i = 0; i < tempCharValues.length; i++) {
            let index = Math.floor(Math.random() *  (i + 1))

            let temp = tempCharValues[index];
            tempCharValues[index] = tempCharValues[i];
            tempCharValues[i] = temp;
        }        

        // debugging use
        console.log(this.charValues);
        console.log(tempCharValues);
        console.log(this.charBin);
        console.log(this.binTiers);
        
        let teamArrInt = [];

        // Force a higher tier character
        if(forceHighTier) {
            tempCharValues.splice(tempCharValues.indexOf(5.5), 1);
        }

        let target = Algorithm.getRandVal(min, max);
        console.log("Before forced: " + target);

        // 'target' will be lower if '-f' is enabled
        if(forceHighTier) {
            target = target - 5.5;
            console.log("After forced: " + target);
        }
        
        let teamToFind = 5;
        if(forceHighTier) {
            teamToFind--;
        }

        if(!(Algorithm.isSubsetSum(tempCharValues, tempCharValues.length, target, teamArrInt, 0, teamToFind))) {
            // Needs to be []
            return "Team composition does not exist";
        }

        if(forceHighTier) {
            teamArrInt.push(5.5);
        }

        // Get a match and reset the character arrays of different tiers
        var cList = this.getMatch(teamArrInt);
        
        console.log(teamArrInt);
        console.log(cList);

        // Figure out a different way to return them as one packet so the error call can still work
        return [cList, teamArrInt];
    }

    /*
    Get a match based on 'teamArrInt', will remove characters from an array to signify that 
    they are already in use and cannot be used a second time
     */
    getMatch(teamArrInt)
    {
        let charList = [];


        // Loops for 'teamArrInt.length', finding a character that corresponds to that value
        for(let curCharVal = 0; curCharVal < teamArrInt.length; curCharVal++) {
            let getChar = 0;

            console.log("charrArr[" + curCharVal + "] " + teamArrInt[curCharVal]);

            // Loops through each bin tier, checks if a value in 'teamArrInt' corresponds to one in 'binTiers'
            for(let binVal = 0; binVal < this.binTiers.length; binVal++) {
                // Once it finds a corresponding value, move a random character from 'charBin' to 'charList'
                if(teamArrInt[curCharVal] == this.binTiers[binVal]) {
                    getChar = Math.floor(Math.random() * this.charBin[binVal].length);
                    charList.push(this.charBin[binVal][getChar]);

                    console.log(this.charBin[binVal]);
                    console.log(getChar, this.charBin[binVal][getChar]);

                    // removes the character from 'charBin'
                    this.charBin[binVal].splice(getChar, 1);                    
                }
            }
            console.log(charList);
        }

        return charList;
    }
};