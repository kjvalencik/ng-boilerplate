angular.module('ttt.user-list', [
	'services.socket'
])

.controller( 'UserListCtrl', function UserListController($scope, socket) {
	var OFFLINE      = 0,
		AVAILABLE    = 1,
		UNAVAILABLE  = 2;

	$scope.userFilter = "";
	$scope.users = [];

	socket.on('user-updates', function (users) {
		if (!_.isArray(users)) {
			users = [users];
		}
		_.each(users, function (user) {
			var i;
			for (i = $scope.users.length; --i >= 0;) {
				if ($scope.users[i].username === user.username) {
					// Remove the user if they went offline
					if (user.status === OFFLINE) {
						$scope.users.splice(i, 1);
					}
					// Stop looking for the user
					return;
				}
			}
			// If the user wasn't found and they went online, add them
			if (user.status !== OFFLINE) {
				$scope.users.push(user);
			}
		});
	});
})

;
