angular.module('ttt.game.local.ultimate', [
	'services.board'
])

.controller('LocalUltimateGameCtrl', function LocalUltimateGameCtrl($scope, UBoard) {
	$scope.play = function (board, cell) {
		// Both players are on the same computer, so flip
		// the player after every legal move.
		if ($scope.uboard.play(board, cell)) {
			$scope.uboard.flipPlayer();
		}
	};

	$scope.reset = function () {
		$scope.uboard = new UBoard();
		$scope.uboard.randomizePlayer();
		$scope.uboard.player = $scope.uboard.curPlayer;
	};

	$scope.reset();
})

;