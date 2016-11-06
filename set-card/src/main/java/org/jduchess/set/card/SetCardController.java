package org.jduchess.set.card;

import org.springframework.boot.SpringApplication;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

@RestController
@RequestMapping("/cards")
public class SetCardController {
	Map<Integer, List<Card>> games = new HashMap<>();

    @RequestMapping(method = RequestMethod.GET, value="/createGame", produces = "application/json; charset=UTF-8")
    public Integer createGame() {
		Integer gameId = createNewGameId();

        List<Card> newCards = allCardsInOrder();
        Collections.shuffle(newCards);
        games.put(gameId, newCards);

		return gameId;
	}

    @RequestMapping(method = RequestMethod.GET, value="/draw", produces = "application/json; charset=UTF-8")
    public List<Card> drawThreeCards(Integer gameId) {
        List<Card> drawnCards = new ArrayList<>(3);
        List<Card> gameCards = games.get(gameId);
        if(!CollectionUtils.isEmpty(gameCards)) {
            for (int i = 0; i < 3; i++) {
                drawnCards.add(gameCards.get(0));
                drawnCards.remove(0);
            }
        }
        return drawnCards;
    }

	private Integer createNewGameId() {
		Integer lastKey = games.keySet().stream().max((entry1, entry2) -> entry1 > entry2 ? 1 : -1).get();
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
