angular.module('ttt.game.local', [
	'services.board'
])

.controller('LocalGameCtrl', function LocalGameController($scope, Board) {
	$scope.board = new Board(Board);
})

;