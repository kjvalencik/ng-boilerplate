//Services are singletons, so we can rely on this being consistent
angular.module('services.user', [
	'ngResource'
]).factory('User', function ($resource, $rootScope) {
	var route, User, user;

	User = $resource('/api/user', {}, {
		get : { method: 'GET', cache: true },
		put : { method: 'PUT', cache: false }
	});
	user = User.get();

	return {
		set: function (data) {
			user = _.extend(user, data);
			$rootScope.$emit('logged-in');
			$rootScope.$apply();
		},
		getUser: function () {
			return user;
		},
		createUsername: function (username, cb) {
			user.$put({ username: username }, function (data) {
				cb();
			}, function (err) {
				if (err.status === 412) {
					user.authenticated = false;
				}
				cb(err);
			});
		},
		logout: function () {
			if (user.authenticated) {
				user.$remove();
				$rootScope.$emit('logged-out');
			}
		}
	};
});