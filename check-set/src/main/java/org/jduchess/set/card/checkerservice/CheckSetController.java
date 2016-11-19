package org.jduchess.set.card.checkerservice;


import java.util.List;

import org.jduchess.set.card.Card;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CheckSetController {
	
	@CrossOrigin
	@RequestMapping(method = RequestMethod.POST, value="/check", consumes="application/json; charset=UTF-8", produces = "application/json; charset=UTF-8")
	public boolean isValidSet(@RequestBody List<Card> cards) {
		Card card1 = cards.get(0);
		Card card2 = cards.get(1);
		Card card3 = cards.get(2);
		
		if (checkAmount(card1, card2, card3) 
				&& checkColor(card1, card2, card3) 
				&& checkFilling(card1, card2, card3)
				&& checkShape(card1, card2, card3)) {
			return true;
		}
		return false;
	}

	private boolean checkAmount(Card card1, Card card2, Card card3) {
		if (card1.getAmount() == card2.getAmount() 
				&& card2.getAmount() == card3.getAmount()) {
			return true;
		} else if (card1.getAmount() != card2.getAmount() 
				&& card1.getAmount() != card3.getAmount()
				&& card2.getAmount() != card3.getAmount()) {
			return true;
		}
		return false;
	}

	private boolean checkColor(Card card1, Card card2, Card card3) {
		if (card1.getColor() == card2.getColor() 
				&& card2.getColor() == card3.getColor()) {
			return true;
		} else if (card1.getColor() != card2.getColor() 
				&& card1.getColor() != card3.getColor()
				&& card2.getColor() != card3.getColor()) {
			return true;
		}
		return false;
	}

	private boolean checkFilling(Card card1, Card card2, Card card3) {
		if (card1.getFilling() == card2.getFilling() 
				&& card2.getFilling() == card3.getFilling()) {
			return true;
		} else if (card1.getFilling() != card2.getFilling() 
				&& card1.getFilling() != card3.getFilling()
				&& card2.getFilling() != card3.getFilling()) {
			return true;
		}
		return false;
	}

	private boolean checkShape(Card card1, Card card2, Card card3) {
		if (card1.getShape() == card2.getShape() 
				&& card2.getShape() == card3.getShape()) {
			return true;
		} else if (card1.getShape() != card2.getShape() 
				&& card1.getShape() != card3.getShape()
				&& card2.getShape() != card3.getShape()) {
			return true;
		}
		return false;
	}
}
