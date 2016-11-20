package org.jduchess.set.scoreservice;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/score")
public class KeepScoreController {
	private Map<Integer, Integer> gameScores = new HashMap<>();
	
	@CrossOrigin
	@RequestMapping(method = RequestMethod.PUT, value="/increment")
	public void incrementScore(@RequestParam("game") Integer gameId) {
		if (!gameScores.containsKey(gameId)) {
			gameScores.put(gameId, Integer.valueOf(0));
		}
		Integer score = gameScores.get(gameId);
		score++;
		gameScores.put(gameId, score);
	}

	@CrossOrigin
	@RequestMapping(method = RequestMethod.GET, value="/get", produces = "application/json; charset=UTF-8")
	public Integer getScore(@RequestParam("game") Integer gameId) {
		if (gameScores.containsKey(gameId)) {
		return gameScores.get(gameId);
		}
		return Integer.valueOf(-1);
	}
	
}
