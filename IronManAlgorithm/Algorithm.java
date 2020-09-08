public class Algorithm
{
    private static final int numCharacters = 5;
    public static boolean isSubsetSum(double set[], int n, double sum, double[] subset, int level)
    {
        if (sum == 0 && level == numCharacters ) {
            printArr(subset);
            //System.out.printf("level is %d\n", level);
            return true;
        }
        // return false if sum is met, but the array is not filled
        if (sum == 0 && level < numCharacters ) {
            return false;
        }
        // If level is greater than the numCharacters, return false so it doesn't over populate subset
        if (level >= numCharacters)
        {
            return false;
        }
        // return false if there are no more elements in set to look at
        if (n == 0) {
            return false;
        }

        // If the current element @n - 1 is bigger than the sum, ignore it
        if (set[n - 1] > sum) {
            //System.out.println("HERE!");
            return isSubsetSum(set, n - 1, sum, subset, level);
        }

        subset[level] = set[n - 1];
        //System.out.printf("subset[level]: %d\n", subset[level]);
        //System.out.printf("level: %d\n", level);
        ////printArr(subset);
        // Branches left until a A) the sum is not met and will return false or B) the sum is met and will return true
        //
        double[] newArr = copyArr(set, n - 1);
        //System.out.println("newArr is: ");
        ////printArr(newArr);
        return isSubsetSum(set, n-1, sum - set[n - 1], subset, level + 1)
                || isSubsetSum(set, n - 1, sum, subset, level);

    }

    public static double[] copyArr(double[] arr, int n)
    {
        double[] newArr = new double[n];
        for(int i = 0; i < n; i++)
        {
            newArr[i] = arr[i];
        }
        return newArr;
    }

    public static void printArr(double[] arr)
    {
        for(int i = 0; i < arr.length; i++)
        {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }
}
