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
        let range = max - min;
        let value = (Math.random() * range) + min;
        console.log("not rounded: ", value);
        value = Math.round((value * 2))/2.0;
        console.log("rounded: ", value);
        return value;   
    }

    static getQuartile(arr) {
        let length = arr.length;
        let lengthQ1 = 0;
        let lengthQ3 = 0;

        let median = -1;

        // If the dataset is even, the median will be between 2 values in the dataset
        if(length % 2 == 0) {
            // To find the middle of an even dataset we will take the left and right value
            let right = length/2;
            let left = right - 1;
            console.log("left index ", left, " is ", arr[left]);
            console.log("right index ", right, " is ", arr[right]);
            // Average the two left and right values
            //median = (arr[left] + arr[right])/2;
            median = (left + right)/2;

            // The length of the theoretical subarray for Q1 will be the value 'right'
            lengthQ1 = right;
            // The start of the theoretical subarray for Q3 will be the value of 'right'
            lengthQ3 = right;
        } 
        // If the dataset is odd, the median will be the center
        else {
            // Get the center
            let middle = (length - 1) / 2;
            console.log("median index ", middle, " is ", arr[middle]);
            //median = arr[middle];
            median = middle;

            // The length of the theoretical subarray for Q1 will be the value 'middle'
            lengthQ1 = middle;
            // The start of the theoretical subarray for Q3 will be the value of 'middle' + 1
            lengthQ3 = middle + 1;
        }

        console.log("median ", median);
        console.log("lengthQ1 end ", lengthQ1);
        console.log("lengthQ3 start", lengthQ3);

        let q1 = -1;

        // If the theoretical subarray is even, Q1 will be between 2 values
        if(lengthQ1 % 2 == 0) {
            let right = lengthQ1/2;
            let left = right - 1;
            console.log("left index Q1 ", left, " is ", arr[left]);
            console.log("right index Q1 ", right, " is ", arr[right]);
            //q1 = (arr[left] + arr[right])/2;
            q1 = (left + right)/2;
        } 
        // If the dataset is odd, Q1 will be the center
        else {
            let middle = (lengthQ1 - 1) / 2;
            console.log("median index Q1 ", middle, " is ", arr[middle]);
            //q1 = arr[middle];
            q1 = middle;
        }

        console.log("q1 ", q1);

        let q3 = -1;

        // If the theoretical subarray is even, Q3 will be between 2 values
        if((arr.length - lengthQ3) % 2 == 0) {
            let right = (arr.length + lengthQ3)/2;
            let left = right - 1;
            console.log("left index Q3 ", left, " is ", arr[left]);
            console.log("right index Q3 ", right, " is ", arr[right]);
            //q3 = (arr[left] + arr[right])/2;
            q3 = (left + right)/2;
        } 
        // If the theoretical subarray if odd, Q3 will be the center
        else {
            let middle = (arr.length + lengthQ3 - 1) / 2;
            console.log("median index Q3 ", middle, " is ", arr[middle]);
            //q3 = arr[middle];
            q3 = middle;
        }

        console.log("q3 ", q3, "\n\n");

        console.log(arr);
        console.log("median ", median);
        console.log("q1 ", q1);
        console.log("q3 ", q3);
        return[q1, q3];
    }
}