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
        var result = '';
        var loops = determineNumber(card.amount);
        for(var i=0; i<loops; i++) {
            if (angular.isDefined(card) && angular.isDefined(card.shape)) {
	    	    if(card.shape == 'HEART') {
	    	        result += showHeart(card.color, card.filling);
	            } else if (card.shape == 'SQUARE') {
                    result += showSquare(card.color, card.filling);
	            } else if (card.shape == 'ELLIPSE') {
            	    result += showEllipse(card.color, card.filling);
	            }
	        }
        }
        return result;
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
		isHighScore();
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
        	var newCards = response.data;
        	if (angular.isDefined(newCards) && newCards.length > 0) {
	        	// maybe we need to fill some empty spots in the rows after we deleted some cards
	        	var counter = 0;
	        	angular.forEach($scope.deckOfCards, function(row) {
	        		while (row.length < 3) {
	        			row.push(newCards[counter]);
	        			counter = counter + 1;
	        		}
	        	});
	        	// no empty spots found so add all the cards to the deck
	        	if (counter === 0) {
	        		$scope.deckOfCards.push(newCards);
	        	}
        	} else {
        		// No cards found realine cards
        		var allCardsLeft = [];
        		angular.forEach($scope.deckOfCards, function(row) {
        			angular.forEach(row, function(card) {
        				allCardsLeft.push(card);
        			});
        		});
        		$scope.deckOfCards = [];
        		var row = [];
        		angular.forEach(allCardsLeft, function(card) {
        			row.push(card);
        			if (row.length === 3) {
        				$scope.deckOfCards.push(row);
        				row = [];
        			}
        		});
        	}
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
    	var urlIncreamentScore = 'http://localhost:8081/score/increment?game=' + $scope.gameId;
    	$http.put(urlIncreamentScore).then(function(response) {
            getScore();
        }, function (response) {
            console.log('Error: ', response);
        });
    }

    function isHighScore() {
    	var urlIsHighScore = 'http://localhost:8082/highscore/isHigh?highScore=' + $scope.score;
    	$http.get(urlIsHighScore).then(function(response) {
    		var high = response.data;
    		console.log('is high: ' + high);
    		if (high === true) {
    			console.log('high score');
    			$scope.highScore = $scope.score;
    			setHighScore();
    		}
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
	                    	var index = row.indexOf(value);
	                    	if (index > -1) {
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
    	var urlSetHighScore = 'http://localhost:8082/highscore/set?highScore=' + $scope.score;
    	$http.put(urlSetHighScore).then(function(response) {
            //$scope.gameId = response.data;
        }, function (response) {
            console.log('Error: ', response);
        });
    }


    function showHeart(color, filling) {
        var openSvg = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="120px" height="120px"> ';
        var fill = determineFilling(color, filling);
        var crossHatch = crossHatching(color);
        return openSvg + crossHatch + '<path id="template" d="m 7.3167829,940.10498 a 25,25 0 0 0 -1.633615,33.99939 l -0.06431,0.063 1.258795,1.2904 33.6546811,34.50133 35.791745,-34.91353 -0.230478,-0.2362 a 25,25 0 0 0 -0.411677,-34.46271 25,25 0 0 0 -34.499359,-1.19232 25,25 0 0 0 -33.8657781,0.95084 z" '+fill+'/></svg>';
    }

    function showSquare(color, filling) {
        var openSvg = '<svg width="90" height="90" xmlns="http://www.w3.org/2000/svg">';
        var fill = determineFilling(color, filling);
        var crossHatch = crossHatching(color);
        return openSvg + crossHatch + '<g transform="translate(0,-952.36216)" id="layer1"><path d="M10 10 H 70 V 70 H 10 L 10 10" '+fill+'/></g></svg>';
    }

    function showEllipse(color, filling) {
        var openSvg = '<svg width="120" height="60" xmlns="http://www.w3.org/2000/svg">';
        var fill = determineFilling(color, filling);
        var crossHatch = crossHatching(color);
        return openSvg + crossHatch + '<ellipse cx="60" cy="30" rx="50" ry="25" '+fill+'/></svg>';
    }

    function determineFilling(color, filling) {
        var fill;
        if(filling == 'FULL') {
           fill = 'fill="'+color+'"';
        } else if (filling == 'EMPTY') {
           fill = 'stroke="'+color+'" fill="white"';
        } else if (filling == 'SHADED') {
           fill='fill="url(#diagonalHatch)"';
        }
        return fill;
    }

    function crossHatching(color) {
        return '<pattern id="diagonalHatch" patternUnits="userSpaceOnUse" width="4" height="4"><path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style="stroke:'+color+'; stroke-width:1" /></pattern>';
    }

    function determineNumber(number) {
        if(number == 'ONE') {
            return 1;
        } else if(number == 'TWO') {
            return 2;
        } else if(number == 'THREE') {
            return 3;
        }
    }
}]);
