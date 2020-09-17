module.exports = class algorithm {

    /* 
    Given a specific set of numbers, this algorithm will recursively attempt 
    to reach a 'subset' of length 'numCharacters' which will add up to the 'sum'. 

    The level tells where to put each element of 'set' into 'subset'.
    */
    static isSubsetSum(set, n, sum, subset, level, numCharacters) {
        //console.log("set: ", set);
        //console.log("subset: ", subset);

        // Base case, if the 'sum' is met and the 'level' matches 'numCharacters', return 'true';
        if(sum == 0 && level == numCharacters ) {
            return true;
        }
        // Base case, return 'false' if 'sum' is met, but the array is not filled to 'numCharacters'
        // Also needs to check that n == 0 so that the last possible solution can be sought out
        // !!! FIGURE OUT WHY n == 0 WORK
        if(sum == 0 && level < numCharacters && n == 0) {
            return false;
        }
        // If 'level' is greater than the 'numCharacters', return 'false' to prevent Array Out of Bounds
        if(level >= numCharacters) {
            return false;
        }
        // return 'false' if there are no more elements 'n' in 'set' to look at
        if(n == 0) {
            return false;
        }

        // If the current element @n - 1 is bigger than the sum, ignore it, move onto the next number in the set
        if(set[n - 1] > sum) {
            //System.out.println("HERE!");
            return this.isSubsetSum(set, n - 1, sum, subset, level, numCharacters);
        }

        // Set the current 'subset' @level to the current value of set which we are looking at
        // The value will be replaced as certain conditions in each branch is not met
        subset[level] = set[n - 1];

        // Branches left and right until a A) the 'sum' is not met and will return 'false' or B) the 'sum' is met and will return 'true'
        return this.isSubsetSum(set, n-1, sum - set[n - 1], subset, level + 1, numCharacters)
                || this.isSubsetSum(set, n - 1, sum, subset, level, numCharacters);
    }

    // A method which returns a random value between 'min' and 'max' rounded to the nearest 0.5
    static getRandVal(min, max) {
        var range = max - min;
        var value = (Math.random() * range) + min;
        console.log("not rounded: ", value);
        var value = Math.round((value * 2))/2.0;
        console.log("rounded: ", value);
        return value;   
    }
}