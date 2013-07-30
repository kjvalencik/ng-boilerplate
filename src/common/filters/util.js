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

;