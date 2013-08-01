angular.module('filters.util', [
	'ng'
])

.filter('match', function matchFilter () {
	var specialChars = new RegExp('([\\.\\+\\*\\?\\[\\^\\]\\$\\(\\)\\{\\}\\=\\!\\<\\>\\|\\:\\-\\\\])', 'g');
	return function (input, query) {
		query = query || "";
		return input.replace(new RegExp('('+ query.replace(specialChars, "\\$1") + ')', 'ig'), '<span class="match">$1</span>');
	};
})

// has - Check for an object having a key or list of keys
// filters an array context using a string key or list of string keys
// which can be $parse expressions.
.filter('has', function definedFilter ($parse) {
	return function (seq, expr) {
		if (!_.isArray(expr)) {
			expr = [expr];
		}
		var gets = _.map(expr, $parse);
		return _.filter(seq, function (x) {
			return _.every(gets, function (g) {
				return g(x) !== undefined;
			});
		});
	};
})

;