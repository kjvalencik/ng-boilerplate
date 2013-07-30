var redisUtils = require('../util/redis-util'),
	env   = require('../util/env'),
	_     = require('underscore'),
	// Redis clients
	client, userUpdates, userChallenges,
	// Private Functions
	getTS, makeScore, parseScore, makeChallenge, challengeAll;

// Redis data
var USER_UPDATES  = 'user-updates',
	ACTIVE_USERS  = 'active-users',
	ACTIVE_CONNS  = 'active-connections',
	LAST_UPDATED  = 'last-updated';

// Challenge constants
var CHALLENGE_TIME = 5000,
	CHALLENGE = 'active-challenge',
	CHALLENGE_INT = 25 * 60 * 1000,  // Every 25 to 30 minutes,
	CHALLENGE_DELTA = 5 * 60 * 1000; // challenge everyone online.

// User Status
var OFFLINE      = 0,
	AVAILABLE    = 1,
	UNAVAILABLE  = 2,
	LAST_UPDATE  = 9;

getTS = function getTS() {
	return (new Date()).valueOf();
};

makeScore = function makeScore(score, ts) {
	score = score || 9;
	ts = ts || getTS();
	return 10 * ts + score;
};

parseScore = function parseScore(score) {
	var data = {
		status: score % 10
	};
	data.ts = (score - data.status) / 10;
	return data;
};

// Create a client for get / sets
client = redisUtils.createClient();

// Subscribe to all user events
userUpdates = redisUtils.createClient();
userUpdates.subscribe(USER_UPDATES);
userUpdates.on('message', function (channel, msg) {
	try {
		userUpdates.emit('update', JSON.parse(msg));
	} catch (e) {}
});

// Subscribe to user challenges
userChallenges = redisUtils.createClient();
userChallenges.subscribe(CHALLENGE);
userChallenges.on('message', function (channel, msg) {
	try {
		var key;
		msg = JSON.parse(msg);
		key = 'challenge';
		if (msg.isResponse) {
			key += '-response';
		}
		key += '-' + msg.username;
		userChallenges.emit(key);
	} catch (e) {}
});

makeChallenge = function (username) {
	var challengeHandle, challengeResponseListener;

	// Listen for a challenge response
	challengeResponseListener = function () {
		// Clear the timeout to logout
		clearTimeout(challengeHandle);

		// Remove the challenge listener
		userChallenges.removeListener('challenge-response-' + username, challengeResponseListener);
	};
	userChallenges.on('challenge-response-' + username, challengeResponseListener);

	// Wait N seconds for a challenge before signing off
	challengeHandle = setTimeout(function () {
		// Remove the challenge listener
		userChallenges.removeListener('challenge-response-' + username, challengeResponseListener);

		// Remove the user
		client.zrem(ACTIVE_USERS, username);

		// Let everyone know this user has signed off
		client.publish(USER_UPDATES, JSON.stringify({
			username: username,
			status: OFFLINE,
			ts: getTS()
		}));
	}, CHALLENGE_TIME);

	// Make the challenge
	client.publish(CHALLENGE, JSON.stringify({ username : username }));
};

challengeAll = function () {
	client.zrangebyscore([ACTIVE_USERS, '-inf', '+inf', 'WITHSCORES'], function (err, msg) {
		msg.pop();
		for (i = 0; i < msg.length - 1; i += 2) {
			makeChallenge(msg[i]);
		}
	});

	// Schedule the next challenge
	setTimeout(challengeAll, CHALLENGE_INT + (Math.random() * CHALLENGE_DELTA));
};
challengeAll();

module.exports = function (io) {
	io.sockets.on('connection', function (socket) {
		var user = socket.handshake.user,
			ts = getTS(),
			holdMsgs = [],
			recvFullUsers = false,
			userUpdatesListener, userChallengesListener;

		// Subscribe to user updates
		userUpdatesListener = function (data) {
			if (recvFullUsers) {
				socket.emit(USER_UPDATES, data);
			// Save these updates for now
			} else {
				holdMsgs.push(data);
			}
		};
		userUpdates.on('update', userUpdatesListener);

		// Listen for user challenges
		userChallengesListener = function () {
			client.publish(CHALLENGE, JSON.stringify({
				username: user.username,
				isResponse: true
			}));
		};
		userChallenges.on('challenge-' + user.username, userChallengesListener);
		// Run the challenge response once to allow for browser refreshes
		userChallengesListener();

		// Get the active user set
		client.zrangebyscore([ACTIVE_USERS, '-inf', '+inf', 'WITHSCORES'], function (err, msg) {
			var lastUpdated = parseScore(msg.pop()).ts,
				users = [],
				data, username, i;

			// Parse users
			for (i = 0; i < msg.length - 1; i++) {
				username = msg[i];
				data = parseScore(msg[++i]);
				users.push({
					username: username,
					status: data.status,
					ts: data.ts
				});
			}

			// Push additional updates that are newer
			holdMsgs.forEach(function (item) {
				if (item.ts > lastUpdated) {
					users.push(item);
				}
			});
			holdMsgs = null;

			socket.emit(USER_UPDATES, users);
			recvFullUsers = true;
		});

		// Process disconnected user
		socket.on('disconnect', function () {
			// Remove listeners. Do this first so we don't respond to our own challenge.
			userUpdates.removeListener('update', userUpdatesListener);
			userChallenges.removeListener('challenge-' + user.username, userChallengesListener);

			// Check if the user is still online anywhere else. If not, sign off.
			makeChallenge(user.username);
		});

		// Save the user in the master lists
		client.zadd(ACTIVE_USERS, makeScore(AVAILABLE, ts), user.username, makeScore(LAST_UPDATE, ts), LAST_UPDATED);

		// Let everyone know this user has signed on
		client.publish(USER_UPDATES, JSON.stringify({
			username: user.username,
			status: AVAILABLE,
			ts: ts
		}));
	});
};