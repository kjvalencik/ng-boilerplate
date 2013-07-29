angular.module('ttt.base', [
	'providers.nav'
])

.config(function ConfigureBaseState ($navsProvider) {
	$navsProvider.nav('ttt', {
		views: {
			'header': {
				controller: 'HeaderCtrl',
				templateUrl: 'base/header.tpl.html'
			},
			'main': {
				controller: 'MainCtrl',
				templateUrl: 'base/main.tpl.html'
			},
			'online-users': {
				controller: 'UserListCtrl',
				templateUrl: 'user-list/user-list.tpl.html'
			}
		}
	});
})

.controller('MainCtrl', function MainCtrl() {})

.controller('HeaderCtrl', function () {})

;
