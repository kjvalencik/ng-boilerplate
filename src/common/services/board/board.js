var Cell, Board, UBoard, _;

if ("object" === typeof angular) {
	_ = window._;
} else {
	_ = require('underscore');
}

Cell = function (i, j) {
	this.i = i;
	this.j = j;
};
Cell.prototype.play = function (player) {
	this.winner = player;
};
Cell.prototype.isOpen = function () {
	return this.winner === undefined;
};
Cell.prototype.isPlayer = function (player) {
	return this.winner === player;
};

Board = function (i, j) {
	var k, m;

	this.curPlayer = 0;
	this.player = 0;
	this.moves = 0;

	// Don't stomp on a UBoard
	if (!this.board) {
		this.board = [];
		for (k = 0; k < 3; k++) {
			this.board.push([]);
			for (m = 0; m < 3; m++) {
				this.board[k].push(new Cell(k, m));
			}
		}
	}

	Cell.apply(this, arguments);
};

Board = _.extendPrototype(Board, Cell);

Board.prototype.flipPlayer = function () {
	this.player ^= 1;
};

Board.prototype.randomizePlayer = function () {
	this.curPlayer = Math.floor(Math.random() * 2);
};

Board.prototype.isTurn = function () {
	return this.player === this.curPlayer;
};

Board.prototype.isFull = function () {
	return this.moves >= 9;
};

Board.prototype.isTie = function () {
	return this.isFull() && this.isOpen();
};

Board.prototype.isWonRow = function (cell) {
	var i;

	// Is it winning?
	for (i = 0; i < this.board[cell.i].length; i++) {
		if (this.board[cell.i][i].winner !== this.curPlayer) {
			return false;
		}
	}

	// Mark it
	for (i = 0; i < this.board[cell.i].length; i++) {
		this.board[cell.i][i].winning = true;
	}

	return true;
};

Board.prototype.isWonCol = function (cell) {
	var i;

	// Is it winning?
	for (i = 0; i < this.board.length; i++) {
		if (this.board[i][cell.j].winner !== this.curPlayer) {
			return false;
		}
	}

	// Mark it
	for (i = 0; i < this.board.length; i++) {
		this.board[i][cell.j].winning = true;
	}

	return true;
};

Board.prototype.isWonDiagLeft = function (cell) {
	var i;

	// Is it on the diagonal?
	if (cell.i !== cell.j) {
		return false;
	}

	// Is it winning?
	for (i = 0; i < this.board.length; i++) {
		if (this.board[i][i].winner !== this.curPlayer) {
			return false;
		}
	}

	// Mark it
	for (i = 0; i < this.board.length; i++) {
		this.board[i][i].winning = true;
	}

	return true;
};

Board.prototype.isWonDiagRight = function (cell) {
	var i;

	// Is it on the diagonal?
	if ((this.board.length - cell.i - 1) !== cell.j) {
		return false;
	}

	// Is it winning?
	for (i = 0; i < this.board.length; i++) {
		if (this.board[i][this.board.length - i - 1].winner !== this.curPlayer) {
			return false;
		}
	}

	// Mark it
	for (i = 0; i < this.board.length; i++) {
		this.board[i][this.board.length - i - 1].winning = true;
	}

	return true;
};

Board.prototype.isWonDiag = function (cell) {
	return this.isWonDiagLeft(cell) || this.isWonDiagRight(cell);
};

Board.prototype.isWon = function (cell) {
	return this.isWonRow(cell) || this.isWonCol(cell) || this.isWonDiag(cell);
};

Board.prototype.play = function (cell) {
	// Check players turn
	if (!this.isTurn()) {
		return false;
	}
	// Check if the game is still in progress
	if (!this.isOpen()) {
		return false;
	}
	// Check that the board isn't full
	if (this.isFull()) {
		return false;
	}
	// Check if this space is open
	if (!cell.isOpen()) {
		return false;
	}

	// Make the move and inc the move count
	cell.play(this.curPlayer);
	this.moves += 1;

	// Check if the player won
	if (this.isWon(cell)) {
		this.winner = this.curPlayer;
	}

	// Switch players
	this.curPlayer ^= 1;

	return true;
};

UBoard = function () {
	var k, m;

	this.lastMove = [-1, -1];

	this.board = [];
	for (k = 0; k < 3; k++) {
		this.board.push([]);
		for (m = 0; m < 3; m++) {
			this.board[k].push(new Board(k, m));
		}
	}

	Board.apply(this, arguments);
};

UBoard = _.extendPrototype(UBoard, Board);

UBoard.prototype.getNextBoard = function () {
	return this.board[this.lastMove[0]][this.lastMove[1]];
};

UBoard.prototype.allowAny = function () {
	return this.lastMove[0] < 0 || this.getNextBoard().isFull();
};

UBoard.prototype.isNextBoard = function (board) {
	return (board.i === this.lastMove[0]) && (board.j === this.lastMove[1]);
};

UBoard.prototype.play = function (board, cell) {
	// Check the players turn
	if (!this.isTurn()) {
		return false;
	}
	// Check that the game is still in progress
	if (!this.isOpen()) {
		return false;
	}
	// Check that this is an allowed board
	if (!this.allowAny() && !this.isNextBoard(board)) {
		return false;
	}
	// Check that this small board isn't full
	if (board.isFull()) {
		return false;
	}
	// Check that this cell is open
	if (!cell.isOpen()) {
		return false;
	}

	// Make the move
	this.lastMove = [cell.i, cell.j];
	cell.play(this.curPlayer);
	board.moves += 1;

	// Check for a winner on this board
	board.curPlayer = this.curPlayer;
	if (board.isOpen() && board.isWon(cell)) {
		this.moves += 1;
		board.winner = this.curPlayer;

		// Check for a game winner
		if (this.isWon(board)) {
			this.winner = this.curPlayer;
		}
	}

	this.curPlayer ^= 1;

	return true;
};

// Hack to make this file work in angular or CommonJS
if ('object' === typeof angular) {
	angular.module('services.board', [])

	.factory("Cell", function () {
		return Cell;
	})	
	.factory("Board", function () {
		return Board;
	})
	.factory("UBoard", function () {
		return UBoard;
	})

	;
} else {
	exports.Cell = Cell;
	exports.Board = Board;
	exports.UBoard = UBoard;
}