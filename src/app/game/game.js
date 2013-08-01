angular.module('ttt.game', [
	'ttt.game.local.normal',
	'ttt.game.local.ultimate'
])

.config(function config($navsProvider) {
	$navsProvider.nav( 'ttt.game', {
		url: '/game',
		controller: 'GameCtrl',
		template: '<div ui-view></div>',
		access: 'free'
	});
})

.config(function config($navsProvider) {
	$navsProvider.nav( 'ttt.game.local', {
		url: '/local',
		controller: 'GameLocalCtrl',
		template: '<div ui-view></div>',
		access: 'free'
	});

	$navsProvider.nav( 'ttt.game.local.normal', {
		url: '/normal',
		controller: 'LocalNormalGameCtrl',
		label: 'Local - Normal',
		access: 'free',
		nav: {left: 2},
		templateUrl: 'game/board/normal.tpl.html'
	});

	$navsProvider.nav( 'ttt.game.local.ultimate', {
		url: '/ultimate',
		controller: 'LocalUltimateGameCtrl',
		label: 'Local - Ultimate',
		access: 'free',
		nav: {left: 3},
		templateUrl: 'game/board/ultimate.tpl.html'
	});
})

.controller('GameCtrl', function GameCtrl() {})

.controller('GameLocalCtrl', function GameCtrl() {})

;
