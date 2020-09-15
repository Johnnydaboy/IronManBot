const { SystemChannelFlags } = require("discord.js");
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

        let teamNotFound = true;

        // Caculate lowest possible min and max based on 'this.charValues'
        
        let lowestMin = 0;
        let highestMax = 0;

        console.log("howmanychars: ", howManyChars);
        if(forceHighTier) {
            for(let i = 1; i < howManyChars; i++) {
                highestMax = highestMax + this.charValues[i];
            }

            for(let i = this.charValues.length - 1; i > this.charValues.length - howManyChars; i--) {
                lowestMin = lowestMin + this.charValues[i];
            }

            highestMax = highestMax + this.charValues[0];
            lowestMin = lowestMin + this.charValues[0];

        } else {
            
            for(let i = 0; i < howManyChars; i++) {
                highestMax = highestMax + this.charValues[i];
            }

            for(let i = this.charValues.length - 1; i >= this.charValues.length - howManyChars; i--) {
                lowestMin = lowestMin + this.charValues[i];
            }
        }

        if(min < lowestMin || max > highestMax) {
            teamNotFound = false;
            return "Team composition not possible";
        }
        
        console.log("lowestMin: ", lowestMin);
        console.log("highestMax: ", highestMax);
        
        //!!! NEEDS FIXING
        //!!! Will infintely loop if the team comp doesn't exist, needs to be fixed
        //!!! !ironman 6 -f will loop even though a team comp is possible
        //!!! !ironman 6 -f is caused by a [0, 0, 0] subset in algorithm, patching needed
        while(teamNotFound) {
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

            if(Algorithm.isSubsetSum(tempCharValues, tempCharValues.length, target, teamArrInt, 0, teamToFind)) {
                teamNotFound = false;
            }
            
            // This isn't very smart but it's a temporary solution to !ironman 6 -f
            for(let i = 0; i < tempCharValues.length; i++) {
                var index = Math.floor(Math.random() *  (i + 1))
    
                var temp = tempCharValues[index];
                tempCharValues[index] = tempCharValues[i];
                tempCharValues[i] = temp;
            } 
        }

        if(forceHighTier) {
            teamArrInt.push(5.5);
        }

        // Get a match and reset the character arrays of different tiers
        var cList = this.getMatch(teamArrInt);
        
        console.log(teamArrInt);
        console.log(cList);

        return cList;
    }

    /*
    Get a match based on 'teamArrInt', will remove characters from an array to signify that 
    they are already in use and cannot be used a second time
     */
    getMatch(teamArrInt)
    {
        let charList = [];

        for(let curCharVal = 0; curCharVal < teamArrInt.length; curCharVal++) {
            let getChar = 0;
            console.log("charrArr[" + curCharVal + "] " + teamArrInt[curCharVal]);

            for(let binVal = 0; binVal < this.binTiers.length; binVal++) {
                if(teamArrInt[curCharVal] == this.binTiers[binVal]) {
                    getChar = Math.floor(Math.random() * this.charBin[binVal].length);
                    charList.push(this.charBin[binVal][getChar]);

                    console.log(this.charBin[binVal]);
                    console.log(getChar, this.charBin[binVal][getChar]);

                    this.charBin[binVal].splice(getChar, 1);                    
                }
            }
            console.log(charList);
        }

        return charList;
    }
};