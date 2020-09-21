const Algorithm = require("./algorithm.js")

module.exports = class characterList {

    constructor(newCharValues, newCharBin, newBinTiers) {

        this.charValues = newCharValues;
        this.charBin = newCharBin;
        this.binTiers = newBinTiers;
    }

    // Return a number of characters based on the min and max ad point values of each character
    generateTeamBin(min, max, howManyChars, forceCharTier) {
        min = Number(min);
        max = Number(max);

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
        // debugging use
        
        let teamArrInt = [];
        let level = 0;
        let target = 0;

        console.log("Before forced target: ", target);
        console.log("Before forced level: \n\n", level);

        // Check if initial input is negative, return if so
        if(max < 0 && min < 0) {
            console.log("NEGATIVE VALUES");
            return "Team composition does not exist";
        }

        // Returns an array with forcedChars and new min & max values for the subarray to meet
        [target, level, min, max] = this.forceChars(forceCharTier, tempCharValues, teamArrInt, target, level, min, max);

        /* Debugging use
        console.log("After forced: ", teamArrInt);
        console.log("target: ", target);
        console.log("min ", min);
        console.log("max ", max);
        console.log("level: ", level, "\n\n");
        */

        // If after 'forceChars()', 'max' < 0, no possible team can exist
        if(max < 0) {
            return "Team composition does not exist";
        }
        // If min < 0 set to 0, check for target as well 
        else if(min < 0) {
            min = 0;
        }

        /* Debugging use
        console.log("After Adjusted: ", teamArrInt);
        console.log("target: ", target);
        console.log("min ", min);
        console.log("max ", max);
        console.log("level: ", level, "\n\n");
        */

        // Get 'target' based on min and max value
        target = Algorithm.getRandVal(min, max);

        /* Debugging use
        console.log("After Random: ", teamArrInt);
        console.log("target: ", target);
        console.log("min ", min);
        console.log("max ", max);
        console.log("level: ", level);
        */

        // Create 'tempTarget', a variable the marks where the target originally was
        let tempTarget = target;
        if(!(Algorithm.isSubsetSum(tempCharValues, tempCharValues.length, target, teamArrInt, level, howManyChars))) {
            target = target + 0.5;
            if(target > max) {
                target = min;
            }

            // If 'target' meets 'temptarget', no possible combination can exist
            if(target == tempTarget) {
                return "Team composition does not exist";
            } 
        }

        // Loop by +0.5 increments for target until a possible subarray of 'tempArrInt' can be met
        let teamNotFound = true;
        while(teamNotFound) {
            if(!(Algorithm.isSubsetSum(tempCharValues, tempCharValues.length, target, teamArrInt, level, howManyChars))) {
                console.log("target is: ", target);
                target = target + 0.5;
                if(target > max) {
                    target = min;
                } 
                // If 'target' meets 'temptarget', no possible combination can exist
                if(target == tempTarget) {
                    return "Team composition does not exist";
                }
            } else {
                console.log("target is: ", target);
                teamNotFound = false;
            }
        }

        // Get a match and reset the character arrays of different tiers
        var cList = this.getMatch(teamArrInt);
        
        console.log(teamArrInt);
        console.log(cList);

        let total = 0;
        for(let i = 0; i < teamArrInt.length; i++) {
            total = total + teamArrInt[i];
        }

        console.log("total is: ", total);

        return [cList, teamArrInt];
    }

    // remove from 'tempCharValues', push into 'teamArrInt'
    forceChars(forceCharTier, tempCharValues, teamArrInt, target, level, min, max) 
    {
        let [q1, q3] = Algorithm.getQuartile(this.binTiers);
        // High tier
        if(forceCharTier[0] == true) {
            // number generated from 0 to Q1
            let value = Math.floor(Math.random() * (Math.floor(q1) + 1));
            let forceCharValue = this.binTiers[value];

            tempCharValues.splice(tempCharValues.indexOf(forceCharValue), 1);
            teamArrInt.push(forceCharValue);

            target = target - forceCharValue;
            min = min - forceCharValue;
            max = max - forceCharValue;
            level = level + 1;
        }
        // Mid tier
        if(forceCharTier[1] == true) {
            // Count values from Q1 to Q3 (exclusive)
            let mid = 0;
            for(let i = Math.floor(q1) + 1; i < Math.ceil(q3); i++) {
                mid++;
            }

            // number generated from Q1 to Q3 (excluding Q1 & Q3)
            let value = Math.floor(Math.random() * mid + (Math.floor(q1) + 1));
            let forceCharValue = this.binTiers[value];

            tempCharValues.splice(tempCharValues.indexOf(forceCharValue), 1);
            teamArrInt.push(forceCharValue);

            target = target - forceCharValue;
            min = min - forceCharValue;
            max = max - forceCharValue;
            level = level + 1;
        }
        // Low tier
        if(forceCharTier[2] == true) {
            // number generated from Q3 to 'this.binTiers.length'
            let value = Math.floor(Math.random() * (this.binTiers.length - Math.ceil(q3)) + Math.ceil(q3));
            let forceCharValue = this.binTiers[value];

            tempCharValues.splice(tempCharValues.indexOf(forceCharValue), 1);
            teamArrInt.push(forceCharValue);

            target = target - forceCharValue;
            min = min - forceCharValue;
            max = max - forceCharValue;
            level = level + 1;
        }
        return [target, level, min, max];
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