angular.module('ttt', [
	'templates-app',
	'templates-common',
	'ttt.base',
	'ttt.home',
	'ui.router',
	'titleService'
])

.config( function myAppConfig ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise( '/' );
})

.run(function run (titleService) {
	titleService.setSuffix( ' | Tic, Tac, Tango' );
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
})

.run(function setTitleOfLabel ($rootScope, titleService, $navs) {
	$rootScope.$on('$stateChangeSuccess', function (event, toState) {
		titleService.setTitle($navs.obj[toState.name].label);
	});
})

;
