angular.module('ttt.game.local.normal', [
	'services.board'
])

.controller('LocalNormalGameCtrl', function LocalNormalGameCtrl($scope, Board) {
	$scope.play = function (cell) {
		if (!$scope.board.isOpen()) {
			return;
		}

		// Both players are on the same computer, so flip
		// the player after every legal move.
		if ($scope.board.play(cell)) {
			$scope.board.flipPlayer();
		}
	};

	$scope.reset = function () {
		$scope.board = new Board();
		$scope.board.randomizePlayer();
		$scope.board.player = $scope.board.curPlayer;
	};

	$scope.reset();
})

;