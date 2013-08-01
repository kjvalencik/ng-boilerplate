var bootstrappedUser;

angular.element(document).ready(function() {
	// Ugly, but I want the app to be all static html
	// TODO: Think of a better way to do this
	$.getJSON('api/user', function (user) {
		bootstrappedUser = user;
		angular.bootstrap(document, [
			'ttt'
		]);
	});
});

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
	'filters.util',
	'filters.navs'
])

.config( function myAppConfig ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
})

.run(function bootstrapAppWithUser (User) {
	User.set(bootstrappedUser);
})

.run(function run (titleService) {
	titleService.setSuffix( ' | Tic, Tac, Tango' );
})

.controller('ttt.AppCtrl', function AppCtrl ($scope, User) {
	$scope.user = User.getUser();
})

.run(function setTitleOfLabel ($rootScope, titleService, $navs) {
	$rootScope.$on('$stateChangeSuccess', function (event, toState) {
		titleService.setTitle($navs.obj[toState.name].label);
	});
})

;
