// o -- &#9702;
// x -- &times;
angular.module('ttt.game', [
	'ttt.game.board',
	'ttt.game.local'
])

.config(function config($navsProvider) {
	$navsProvider.nav( 'ttt.game', {
		url: '/game/local',
		controller: 'LocalGameCtrl',
		label: 'Game',
		templateUrl: 'game/board/board.tpl.html'
	});
})

;
