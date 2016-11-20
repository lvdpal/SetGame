'use strict';

angular.module('myApp.game', ['ngRoute', 'ngSanitize'])

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

    $scope.drawCard = function(card) {
        if(card.shape == 'HEART') {
            return showHeart(card.color);
        } else if (card.shape == 'SQUARE') {
            return showSquare(card.color);
        } else if (card.shape == 'ELLIPSE') {
            return showEllipse(card.color);
        }
    }

	$scope.selectCard = function (card) {
	    var cell = angular.element(document.querySelector('#card'+card.id));
	    if(cell.hasClass("selected")) {
	        cell.removeClass("selected");
	        // remove the card from the array
	        $scope.selectedCards.splice($scope.selectedCards.indexOf(card),1);
	    } else {
	        cell.addClass("selected");
	        $scope.selectedCards.push(card);
	    }
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
    		for (var i=0;i<4;i++) {
    			drawThreeCards();
    		}
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
	        	var cardsToBeRemoved = $scope.selectedCards;
	        	$scope.selectedCards = [];
	        	$scope.validSet = response.data;
	        	if ($scope.validSet === true) {
	        		incrementScore();
	        		// remove used cards from deck
	        		angular.forEach(cardsToBeRemoved, function (value, index) {
	                    angular.forEach($scope.deckOfCards, function(row) {
	                    	console.log('row: ' + row);
	                    	var index = row.indexOf(value);
	                    	if (index > -1) {
	                    		console.log('index: ' + index);
	                    		row.splice(index,1);
	                    	}	                    	
	                    });
	                });
	                cardsToBeRemoved = [];
	        		drawThreeCards();
	        	}
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

    function showHeart(color) {
        return '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="120px" height="120px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"> <path id="template" d="M340.8,98.4c50.7,0,91.9,41.3,91.9,92.3c0,26.2-10.9,49.8-28.3,66.6L256,407.1L105,254.6c-15.8-16.6-25.6-39.1-25.6-63.9 c0-51,41.1-92.3,91.9-92.3c38.2,0,70.9,23.4,84.8,56.8C269.8,121.9,302.6,98.4,340.8,98.4 M340.8,83C307,83,276,98.8,256,124.8 c-20-26-51-41.8-84.8-41.8C112.1,83,64,131.3,64,190.7c0,27.9,10.6,54.4,29.9,74.6L245.1,418l10.9,11l10.9-11l148.3-149.8 c21-20.3,32.8-47.9,32.8-77.5C448,131.3,399.9,83,340.8,83L340.8,83z" fill="'+color+'"/></svg>';
    }

    function showSquare(color) {
        return '<svg width="120" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M10 10 H 90 V 90 H 10 L 10 10" fill="'+color+'"/></svg>'
    }

    function showEllipse(color) {
        return '<svg width="120" height="100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="60" cy="60" rx="50" ry="25" fill="'+color+'"/></svg>';
    }
}]);
