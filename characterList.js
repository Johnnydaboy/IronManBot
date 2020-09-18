const Algorithm = require("./algorithm.js")

module.exports = class characterList {

    constructor(newCharValues, newCharBin, newBinTiers) {

        this.charValues = newCharValues;
        this.charBin = newCharBin;
        this.binTiers = newBinTiers;
    }

    // Return a number of characters based on the min and max ad point values of each character
    generateTeamBin(min, max, howManyChars, forceCharTier) {
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
        /*
        if(forceHighTier) {
            tempCharValues.splice(tempCharValues.indexOf(5.5), 1);
        }
        */

        let level = 0;
        let target = Algorithm.getRandVal(min, max);
        console.log("Before forced: " + target);

        // 'target' will be lower if '-f' is enabled
        /*
        if(forceHighTier) {
            target = target - 5.5;
            console.log("After forced: " + target);
        }
        */
        
        /*
        if(forceHighTier) {
            howManyChars--;
        }
        */

        [target, level] = this.forceChars(forceCharTier, tempCharValues, teamArrInt, target, level);

        console.log("After forced: ", teamArrInt);
        console.log("target: ", target);
        console.log("level: ", level);

        if(!(Algorithm.isSubsetSum(tempCharValues, tempCharValues.length, target, teamArrInt, level, howManyChars))) {
            return "Team composition does not exist";
        }

        /*
        if(forceHighTier) {
            teamArrInt.push(5.5);
        }
        */

        // Get a match and reset the character arrays of different tiers
        var cList = this.getMatch(teamArrInt);
        
        console.log(teamArrInt);
        console.log(cList);

        // Figure out a different way to return them as one packet so the error call can still work
        return [cList, teamArrInt];
    }

    // remove from 'tempCharValues', push into 'teamArrInt'
    // !!! Comment this code and how you binned into each quartile
    forceChars(forceCharTier, tempCharValues, teamArrInt, target, level) 
    {
        let [q1, q3] = Algorithm.getQuartile(this.binTiers);
        // High tier
        if(forceCharTier[0] == true) {
            let value = Math.floor(Math.random() * (Math.floor(q1) + 1));
            let forceCharValue = this.binTiers[value];
            tempCharValues.splice(tempCharValues.indexOf(forceCharValue), 1);
            teamArrInt.push(forceCharValue);

            target = target - forceCharValue;
            level++;
        }
        // Mid tier
        if(forceCharTier[1] == true) {
            let mid = 0;
            for(let i = Math.floor(q1) + 1; i < Math.ceil(q3); i++) {
                mid++;
            }

            let value = Math.floor(Math.random() * mid + (Math.floor(q1) + 1));
            let forceCharValue = this.binTiers[value];
            tempCharValues.splice(tempCharValues.indexOf(forceCharValue), 1);
            teamArrInt.push(forceCharValue);

            target = target - forceCharValue;
            level++;
        }
        // Low tier
        if(forceCharTier[2] == true) {
            let value = Math.floor(Math.random() * (this.binTiers.length - Math.ceil(q3)) + Math.ceil(q3));
            let forceCharValue = this.binTiers[value];
            tempCharValues.splice(tempCharValues.indexOf(forceCharValue), 1);
            teamArrInt.push(forceCharValue);

            target = target - forceCharValue;
            level++;
        }

        return [target, level];
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