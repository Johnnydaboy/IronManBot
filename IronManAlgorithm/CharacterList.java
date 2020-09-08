import java.util.ArrayList;
import java.util.Random;

public class CharacterList {
    private Character[] characters;
    private double[] placeHolderChars;
    private double[] placeHolderCharsOriginal = 
    {5.5, 5.5, 5.5, 5.5, 5, 5, 5, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5, 2, 2, 2, 1, 1, 1, 0.5, 0.5, 0.5, 0.5, 0, 0, 0};
    private Random random = new Random();

    private String[] characterName5_5 = {"Sheik", "Puff", "Peach", "Marth"};
    private String[] characterName5 = {"Fox", "Falco", "Falcon"};
    private String[] characterName2_5 = {"Ganon", "Yoshi", "Pikachu", "Doc", "Luigi", "Samus"};
    private String[] characterName2 = {"DK", "Mario", "Icies"};
    private String[] characterName1 = {"YL", "Link", "G&W"};
    private String[] characterName0_5 = {"Roy", "Mewtwo", "Zelda", "Pichu"};
    private String[] characterName0 = {"Ness", "Kirby", "Bowser"};

    private ArrayList<Character> cName5_5 = new ArrayList<>();
    private ArrayList<Character> cName5 = new ArrayList<>();
    private ArrayList<Character> cName2_5 = new ArrayList<>();
    private ArrayList<Character> cName2 = new ArrayList<>();
    private ArrayList<Character> cName1 = new ArrayList<>();
    private ArrayList<Character> cName0_5 = new ArrayList<>();
    private ArrayList<Character> cName0 = new ArrayList<>();

    public CharacterList() {
        //characters = populateListDefault();
        for(int i = 0; i < characterName5_5.length; i++) {
            cName5_5.add(new Character(characterName5_5[i], 5.5, false));
        }
        for(int i = 0; i < characterName5.length; i++) {
            cName5.add(new Character(characterName5[i], 5, false));
        }
        for(int i = 0; i < characterName2_5.length; i++) {
            cName2_5.add(new Character(characterName2_5[i], 2.5, false));
        }
        for(int i = 0; i < characterName2.length; i++) {
            cName2.add(new Character(characterName2[i], 2, false));
        }
        for(int i = 0; i < characterName1.length; i++) {
            cName1.add(new Character(characterName1[i], 1, false));
        }
        for(int i = 0; i < characterName0_5.length; i++) {
            cName0_5.add(new Character(characterName0_5[i], 0.5, false));
        }
        for(int i = 0; i < characterName0.length; i++) {
            cName0.add(new Character(characterName0[i], 0, false));
        }
    }

    public void reset()
    {
        cName5_5.clear();
        cName5.clear();
        cName2_5.clear();
        cName2.clear();
        cName1.clear();
        cName0_5.clear();
        cName0.clear();

        for(int i = 0; i < characterName5_5.length; i++) {
            cName5_5.add(new Character(characterName5_5[i], 5.5, false));
        }
        for(int i = 0; i < characterName5.length; i++) {
            cName5.add(new Character(characterName5[i], 5, false));
        }
        for(int i = 0; i < characterName2_5.length; i++) {
            cName2_5.add(new Character(characterName2_5[i], 2.5, false));
        }
        for(int i = 0; i < characterName2.length; i++) {
            cName2.add(new Character(characterName2[i], 2, false));
        }
        for(int i = 0; i < characterName1.length; i++) {
            cName1.add(new Character(characterName1[i], 1, false));
        }
        for(int i = 0; i < characterName0_5.length; i++) {
            cName0_5.add(new Character(characterName0_5[i], 0.5, false));
        }
        for(int i = 0; i < characterName0.length; i++) {
            cName0.add(new Character(characterName0[i], 0, false));
        }
    }

    public void generateTeamBin(double min, double max)
    {
        placeHolderChars = new double[placeHolderCharsOriginal.length];
        for(int i = 0; i < placeHolderCharsOriginal.length; i++)
        {
            placeHolderChars[i] = placeHolderCharsOriginal[i];
        }

        //printArr(placeHolderChars);

        // Scramble the temp array
        for(int i = 0; i < placeHolderChars.length; i++)
        {
            int index = random.nextInt(i + 1);

            double temp = placeHolderChars[index];
            placeHolderChars[index] = placeHolderChars[i];
            placeHolderChars[i] = temp;
        }
        //printArr(placeHolderChars);

        //While the generated number in the range is not found, try again with another number in the range
        boolean teamNotFound = true;
        double[] charArr = new double[5];
        while(teamNotFound)
        {
            double target = getRandVal(min, max);
            if(Algorithm.isSubsetSum(placeHolderChars, placeHolderChars.length, target, charArr, 0))
            {
                //System.out.println("Subset found!");
                teamNotFound = false;
            }
        }

        characters = getMatch(charArr);
        printCharArr(characters);
        reset();
    }

    private void printCharArr(Character[] charArr)
    {
        System.out.print("[");
        for(int i = 0; i < charArr.length - 1; i++)
        {
            System.out.printf("%s, ", charArr[i].getName());
        }
        System.out.printf("%s", charArr[charArr.length - 1].getName());
        System.out.print("]");
    }

    public Character[] getMatch(double[] charArr)
    {
        Character[] charList = new Character[5];

        for(int i = 0; i < 5; i++)
        {
            int getChar = 0;
            if(charArr[i] == 5.5)
            {
                getChar = random.nextInt(cName5_5.size());
                charList[i] = cName5_5.get(getChar);
                cName5_5.remove(getChar);
            }
            else if(charArr[i] == 5)
            {
                getChar = random.nextInt(cName5.size());
                charList[i] = cName5.get(getChar);
                cName5.remove(getChar);
            }
            else if(charArr[i] == 2.5)
            {
                getChar = random.nextInt(cName2_5.size());
                charList[i] = cName2_5.get(getChar);
                cName2_5.remove(getChar);
            }
            else if(charArr[i] == 2)
            {
                getChar = random.nextInt(cName2.size());
                charList[i] = cName2.get(getChar);
                cName2.remove(getChar);
            }
            else if(charArr[i] == 1)
            {
                getChar = random.nextInt(cName1.size());
                charList[i] = cName1.get(getChar);
                cName1.remove(getChar);
            }
            else if(charArr[i] == 0.5)
            {
                getChar = random.nextInt(cName0_5.size());
                charList[i] = cName0_5.get(getChar);
                cName0_5.remove(getChar);
            }
            else if(charArr[i] == 0)
            {
                getChar = random.nextInt(cName0.size());
                charList[i] = cName0.get(getChar);
                cName0.remove(getChar);
            }
        }

        return charList;
    }

    public double getRandVal(double minValue, double maxValue)
    {
        double range = maxValue - minValue;
        double value = random.nextDouble() * range + minValue;
        //System.out.println(value);
        value = ((int) (value * 2 + 0.5))/2.0;
        //System.out.println(value);
        return value;
    }
}
