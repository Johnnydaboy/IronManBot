package com.company;

public class Character {
    private String name;
    private double value;
    private boolean inUse;

    public Character(String newName, double newValue, boolean newInUse) {
        this.name = newName;
        this.value = newValue;
        this.inUse = newInUse;
    }

    public double getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    /*
    public boolean isInUse() {
        return inUse;
    }
     */

    public void setValue(double value) {
        this.value = value;
    }

    public void setName(String name) {
        this.name = name;
    }

    /*
    public void setInUse(boolean inUse) {
        this.inUse = inUse;
    }
     */
}
