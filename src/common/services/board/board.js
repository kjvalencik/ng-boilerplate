var Board, Cell;

//markers = ['&#9702;', '&times;'];

Cell = function (i, j) {
	this.i = i;
	this.j = j;
};
Cell.prototype.play = function (player) {
	this.winner = player;
};

// Pass in a cell prototype, so that boards of boards
// can be created.
Board = function (CellProto) {
	var i, j;

	CellProto = CellProto || Cell;

	this.curPlayer = 0;
	this.board = [];
	for (i = 0; i < 3; i++) {
		this.board.push([]);
		for (j = 0; j < 3; j++) {
			this.board[i].push(new CellProto(i, j));
		}
	}
};
Board.prototype.isWonRow = function (cell) {
	var i;
	for (i = 0; i < this.board[cell.i].length; i++) {
		if (this.board[cell.i][i].winner !== this.curPlayer) {
			return false;
		}
	}
	return true;
};
Board.prototype.isWonCol = function (cell) {
	var i;
	window.a = this;
	for (i = 0; i < this.board.length; i++) {
		if (this.board[i][cell.j].winner !== this.curPlayer) {
			return false;
		}
	}
	return true;
};
Board.prototype.isWonDiagLeft = function (cell) {
	var i;
	if (cell.i !== cell.j) {
		return false;
	}
	for (i = 0; i < this.board.length; i++) {
		if (this.board[i][i].winner !== this.curPlayer) {
			return false;
		}
	}
	return true;
};
Board.prototype.isWonDiagRight = function (cell) {
	var i;
	if ((this.board.length - cell.i - 1) !== cell.j) {
		return false;
	}
	for (i = 0; i < this.board.length; i++) {
		if (this.board[i][this.board.length - i - 1].winner !== this.curPlayer) {
			return false;
		}
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
	if (this.winner !== undefined) {
		return;
	}
	if (this.gameOver) {
		return;
	}
	cell.play(this.curPlayer);

	// Check for a winner
	if (this.isWon(cell)) {
		board.winner = this.curPlayer;
	}

	// Switch players
	this.curPlayer ^= 1;
};

// Hack to make this file work in angular or CommonJS
if ('object' === typeof angular) {
	angular.module('services.board', []).factory("Board", function () {
		return Board;
	});
} else {
	module.exports = Board;
}