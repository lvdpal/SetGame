package org.jduchess.set.scoreservice;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/highscore")
public class HighScoreController {
	private static final String COOKIE_NAME = "HighScoreForSet";
	
	@CrossOrigin
	@RequestMapping(method = RequestMethod.PUT, value="/set")
	public void setHighScore(HttpServletRequest request, 
			HttpServletResponse response, @RequestParam("highScore") Integer highScore) {
		Cookie cookie = getHighScoreCookie(request);
		if (cookie == null) {
			cookie = new Cookie(COOKIE_NAME, highScore.toString());
		} else {
			cookie.setValue(highScore.toString());
		}
		response.addCookie(cookie);
	}

	@CrossOrigin
	@RequestMapping(method = RequestMethod.GET, value="/isHigh", produces = "application/json; charset=UTF-8")
	public Boolean isHighScore(HttpServletRequest request, @RequestParam("highScore") Integer highScore) {
		Cookie cookie = getHighScoreCookie(request);
		if (cookie == null) {
			return true;
		}
		return cookie.getValue() == null || new Integer(cookie.getValue()) < highScore;
	}

	private Cookie getHighScoreCookie(HttpServletRequest request) {
		Cookie[] cookies = request.getCookies();
		if (cookies != null) {
			for (int i=0;i<cookies.length;i++) {
				Cookie cookie = cookies[i];
				if (COOKIE_NAME.equals(cookie.getName())) {
					return cookie;
				}
			}
		}
		return null;
	}
}
