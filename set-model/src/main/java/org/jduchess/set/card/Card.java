package org.jduchess.set.card;

import java.io.Serializable;

public class Card implements Serializable {

	private CardAmount amount;
	private CardColor color;
	private CardFilling filling;
	private CardShape shape;
	private int id;

    public Card() {
    	// empty constructor for json
    }
    
    public Card(int id, CardAmount amount, CardFilling filling, 
    		CardColor color, CardShape shape) {
        this.id = id;
        this.amount = amount;
        this.filling = filling;
        this.color = color;
        this.shape = shape;
    }

    public CardAmount getAmount() {
        return amount;
    }

    public void setAmount(CardAmount amount) {
        this.amount = amount;
    }

    public CardColor getColor() {
        return color;
    }

    public void setColor(CardColor color) {
        this.color = color;
    }

    public CardFilling getFilling() {
        return filling;
    }

    public void setFilling(CardFilling filling) {
        this.filling = filling;
    }

    public CardShape getShape() {
        return shape;
    }

    public void setShape(CardShape shape) {
        this.shape = shape;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

}
