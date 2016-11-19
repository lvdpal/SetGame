'use strict';

angular.module('myApp.game', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/game', {
    templateUrl: 'game/game.html',
    controller: 'GameCtrl'
  });
}])

.controller('GameCtrl', ['$scope', '$http', function($scope, $http) {
	$scope.gameId = {};
	$scope.selectedCards = [];
	$scope.score = {};
	$scope.highScore = -1;
	$scope.validSet = {};
	$scope.deckOfCards = [];


	
	$scope.startGame = function() {
		console.log('start game');
		createGame();		
	}
	
	$scope.checkSet = function() {
		console.log('check set', $scope.selectedCards);
		if ($scope.selectedCards.length === 3) {
			isValidSet();
		} else {
			$scope.validSet = false;
		}
	}
	
	$scope.extraCards = function() {
		console.log('extra cards: ');
		// draw 3 cards
		drawThreeCards();
	}
	
	$scope.stopGame = function() {
		console.log('stop Game');
	}
	
    function createGame() {
    	console.log('create game');
    	var urlCreateGame = 'http://localhost:8080/cards/createGame';
    	$http.get(urlCreateGame).then(function(response) {
            $scope.gameId = response.data;
            console.log('created game: ' + $scope.gameId);
    		$scope.deckOfCards = [];
    		drawThreeCards();
    		drawThreeCards();
    		drawThreeCards();
    		drawThreeCards();
        }, function (response) {
            console.log('Error: ', response);
        });
    }

    function drawThreeCards() {
    	console.log('draw cards');
    	$http.get('http://localhost:8080/cards/draw?game=' + $scope.gameId).then(function(response) {
        	console.log('we found some cards: ', response)
        	$scope.deckOfCards.push(response.data);
        }, function (response) {
            console.log('Error: ', response);
        });
    }
    
    function getScore() {
    	var urlGetScore = 'http://localhost:8081/score/get?game=' + $scope.gameId;
    	$http.get(urlGetScore).then(function(response) {
            $scope.score = response.data;
        }, function (response) {
            console.log('Error: ', response);
        });
    }
    
    function incrementScore() {
    	var urlIncreamentScore = 'http://localhost:8081/score/increment?game=';
    	$http.put(urlIncreamentScore + $scope.gameId).then(function(response) {
            $scope.score = response.data;
        }, function (response) {
            console.log('Error: ', response);
        });
    }

    function isHighScore() {
    	var urlIsHighScore = 'http://localhost:8082/highscore/isHigh?highScore=' + $scope.score;
    	$http.get(urlIsHighScore).then(function(response) {
            return response.data;
        }, function (response) {
            console.log('Error: ', response);
        });
    }

    function isValidSet() {
    	console.log('selectedCards', $scope.selectedCards);
    	//var urlIsValidSet = 'http://10.0.50.12:8080/api/check';
    	var urlIsValidSet = 'http://localhost:8090/check';
    	$http.post(urlIsValidSet, $scope.selectedCards).
	        then(function(response) {
	        	$scope.validSet = response.data;
	        	if ($scope.validSet === true) {
	        		incrementScore();
	        		$scope.deckOfCards.splice($scope.deckOfCards.indexOf($scope.selectedCards[0]), 1);
	        		$scope.deckOfCards.splice($scope.deckOfCards.indexOf($scope.selectedCards[1]), 1);
	        		$scope.deckOfCards.splice($scope.deckOfCards.indexOf($scope.selectedCards[2]), 1);
	        		drawThreeCards();
	        	}
	        	$scope.selectedCards = [];
	        }, function (response) {
	            console.log('Error: ', response);
	        });
    }

    function setHighScore() {
    	var urlSetHighScore = 'http://localhost:8080/highscore/set?highScore=' + $scope.score;
    	$http.put(urlSetHighScore).then(function(response) {
            //$scope.gameId = response.data;
        }, function (response) {
            console.log('Error: ', response);
        });
    }

}]);