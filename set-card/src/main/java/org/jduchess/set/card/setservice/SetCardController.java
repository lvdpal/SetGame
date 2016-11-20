package org.jduchess.set.card.setservice;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jduchess.set.card.Card;
import org.jduchess.set.card.CardAmount;
import org.jduchess.set.card.CardColor;
import org.jduchess.set.card.CardFilling;
import org.jduchess.set.card.CardShape;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cards")
public class SetCardController {
	Map<Integer, List<Card>> games = new HashMap<>();

    @CrossOrigin
    @RequestMapping(method = RequestMethod.GET, value="/createGame", produces = "application/json; charset=UTF-8")
    public Integer createGame() {
		Integer gameId = createNewGameId();

        List<Card> newCards = allCardsInOrder();
        Collections.shuffle(newCards);
        games.put(gameId, newCards);

		return gameId;
	}

	@CrossOrigin
    @RequestMapping(method = RequestMethod.GET, value="/draw", produces = "application/json; charset=UTF-8")
    public List<Card> drawThreeCards(@RequestParam("game") Integer gameId) {
        List<Card> drawnCards = new ArrayList<>(3);
        List<Card> gameCards = games.get(gameId);
        if(!CollectionUtils.isEmpty(gameCards)) {
            for (int i = 0; i < 3; i++) {
                drawnCards.add(gameCards.get(0));
                gameCards.remove(0);
            }
        }
        return drawnCards;
    }

	private Integer createNewGameId() {
        Integer lastKey;
        if(CollectionUtils.isEmpty(games)) {
            lastKey = 0;
        } else {
            lastKey = games.keySet()
                    .stream()
                    .max((p1, p2) -> Integer.compare(p1, p2))
                    .get();
        }
		return Integer.valueOf(lastKey.intValue()+1);
	}

	private List<Card> allCardsInOrder() {
		List<Card> cards = new ArrayList<>();
		int id = 0;
		for (CardAmount amount : CardAmount.values()) {
			for(CardFilling filling: CardFilling.values()) {
				for(CardColor color: CardColor.values()) {
					for (CardShape shape: CardShape.values()) {
						cards.add(new Card(id, amount, filling, color, shape));
						id++;
					}
				}
			}
		}
        return cards;
	}
}
