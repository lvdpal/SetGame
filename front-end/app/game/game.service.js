(function () {

    'use strict';
    angular.module('myApp.game')
        .factory('GameService', GameService);

    /* @ngInject */
    function GameService(Restangular) {
        var service = {
        	createGame: createGame,
        	drawThreeCards: drawThreeCards,
        	getScore: getScore,
        	incrementScore: incrementScore,
          	isHighScore: isHighScore,
        	isValidSet: isValidSet,
        	setHighScore: setHighScore
        };
        return service;
        //----------------------------------------------------------------------------//

        function createGame() {
        	return Restangular.all('cards/createGame').get().then(_cleanResponse);
        }
        
        function drawThreeCards(gameId) {
        	return Restangular.one('cards/draw', gameId).get().then(_cleanResponse);
        }
        
        function getScore(gameId) {
        	return Restangular.all('score/get', gameId).get().then(_cleanResponse);
        }
        
        function incrementScore(gameId) {
        	return Restangular.one('score/increment').put(gameId).then(_cleanResponse);
        }
        
        function isHighScore(highScore) {
        	return Restangular.one('highscore/isHigh', highScore).get().then(_cleanResponse);
        }
        
        function isValidSet(cards) {
        	return Restangular.all('cards/check').post(cards).then(_cleanResponse);
        }
        
        function setHighScore(highScore) {
        	return Restangular.one('highscore/set').put(highScore).then(_cleanResponse);
        }

        function _boolean(response) {
            if (angular.isUndefined(response)) {
                return false;
            }
            return response;
        }

        function _cleanResponse(response) {
            return Restangular.stripRestangular(response);
        }
    }
}());
