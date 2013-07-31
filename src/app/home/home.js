angular.module('ttt.home', [
	'titleService'
])

.config(function config($navsProvider) {
	$navsProvider.nav( 'ttt.home', {
		url: '/',
		controller: 'HomeCtrl',
		label: 'Home',
		templateUrl: 'home/home.tpl.html'
	});
})

.controller('HomeCtrl', function HomeController($scope, titleService) {
	titleService.setTitle('Home');
})

;