angular.module('ttt', [
	'templates-app',
	'templates-common',
	'ttt.base',
	'ttt.user-list',
	'ttt.home',
	'ttt.game',
	'ui.router',
	'ui.directives',
	'titleService',
	'filters.util'
])

.config( function myAppConfig ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
})

.run(function run (titleService) {
	titleService.setSuffix( ' | Tic, Tac, Tango' );
})

.controller('AppCtrl', function AppCtrl ($scope, User) {
	$scope.user = User.getUser();
})

.run(function setTitleOfLabel ($rootScope, titleService, $navs) {
	$rootScope.$on('$stateChangeSuccess', function (event, toState) {
		titleService.setTitle($navs.obj[toState.name].label);
	});
})

;
