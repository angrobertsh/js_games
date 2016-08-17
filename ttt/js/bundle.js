/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const View = __webpack_require__(1);
	const Game = __webpack_require__(2);

	let game = new Game();
	$( () => {
	  let view = new View(game, $('.ttt'));
	  view.setupBoard();
	  view.bindEvents();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	var View = function (game, $el) {
	  this.game = game;
	  this.$el = $el;
	};

	View.prototype.bindEvents = function () {
	  const $gridItems = $('.grid-item');
	  const view = this;
	  $gridItems.each( function() {
	    $(this).on("click", (event) => view.makeMove($(event.target)));
	  });
	};

	View.prototype.makeMove = function ($square) {
	  let coords = $square.data('coord').split(",").map(el => parseInt(el));
	  if(this.game.board.isEmptyPos(coords)) {
	    this.game.playMove(coords);
	    let winner=this.game.board.winner();
	    let loser = winner === "x" ? "o" : "x";
	    let mark = this.game.board.grid[coords[0]][coords[1]];
	    $square.addClass(mark).html(mark.toUpperCase());
	    if(winner) {
	      $('#grid').addClass('won');
	      $(`.${winner}`).each(function() {
	        $(this).addClass("winner");
	      })
	      $(`.${loser}`).each(function() {
	        $(this).addClass("loser");
	      })
	      $('.congrats').html(`${winner.toUpperCase()} wins!`);
	    }
	  } else {
	    alert("Invalid move!");
	  }
	};

	View.prototype.setupBoard = function () {
	  this.$el.append('<ul id="grid"></ul>');
	  let col = 0;
	  let row = -1;
	  for (let i = 0; i < 9; i++) {
	    col = i % 3;
	    if(i % 3 === 0) {
	      row += 1;
	    }
	    $('#grid').append(`<li class="grid-item" data-coord="${row},${col}"></li>`);
	  }
	};

	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(3);
	const MoveError = __webpack_require__(4);

	class Game {
	  constructor() {
	    this.board = new Board();
	    this.currentPlayer = Board.marks[0];
	  }

	  isOver() {
	    return this.board.isOver();
	  }

	  playMove(pos) {
	    this.board.placeMark(pos, this.currentPlayer);
	    this.swapTurn();
	  }

	  promptMove(reader, callback) {
	    const game = this;

	    this.board.print();
	    console.log(`Current Turn: ${this.currentPlayer}`)

	    reader.question('Enter rowIdx: ', rowIdxStr => {
	      const rowIdx = parseInt(rowIdxStr);
	      reader.question('Enter colIdx: ', colIdxStr => {
	        const colIdx = parseInt(colIdxStr);
	        callback([rowIdx, colIdx]);
	      });
	    });
	  }

	  run(reader, gameCompletionCallback) {
	    this.promptMove(reader, move => {
	      try {
	        this.playMove(move);
	      } catch (e) {
	        if (e instanceof MoveError) {
	          console.log(e.msg);
	        } else {
	          throw e;
	        }
	      }

	      if (this.isOver()) {
	        this.board.print();
	        if (this.winner()) {
	          console.log(`${this.winner()} has won!`);
	        } else {
	          console.log('NO ONE WINS!');
	        }
	        gameCompletionCallback();
	      } else {
	        // continue loop
	        this.run(reader, gameCompletionCallback);
	      }
	    });
	  }

	  swapTurn() {
	    if (this.currentPlayer === Board.marks[0]) {
	      this.currentPlayer = Board.marks[1];
	    } else {
	      this.currentPlayer = Board.marks[0];
	    }
	  }

	  winner() {
	    return this.board.winner();
	  }
	}

	module.exports = Game;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MoveError = __webpack_require__(4);

	class Board {
	  constructor() {
	    this.grid = Board.makeGrid();
	  }

	  isEmptyPos(pos) {
	    if (!Board.isValidPos(pos)) {
	      throw new MoveError('Is not valid position!');
	    }

	    return (this.grid[pos[0]][pos[1]] === null);
	  }

	  isOver() {
	    if (this.winner() != null) {
	      return true;
	    }

	    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
	      for (let colIdx = 0; colIdx < 3; colIdx++) {
	        if (this.isEmptyPos([rowIdx, colIdx])) {
	          return false;
	        }
	      }
	    }

	    return true;
	  }

	  placeMark(pos, mark) {
	    if (!this.isEmptyPos(pos)) {
	      throw new MoveError('Is not an empty position!');
	    }

	    this.grid[pos[0]][pos[1]] = mark;
	  }

	  print() {
	    const strs = [];
	    for (let rowIdx = 0; rowIdx < 3; rowIdx++) {
	      const marks = [];
	      for (let colIdx = 0; colIdx < 3; colIdx++) {
	        marks.push(
	          this.grid[rowIdx][colIdx] ? this.grid[rowIdx][colIdx] : " "
	        );
	      }
	      strs.push(`${marks.join('|')}\n`);
	    }

	    console.log(strs.join('-----\n'));
	  }

	  winner() {
	    const posSeqs = [
	      // horizontals
	      [[0, 0], [0, 1], [0, 2]],
	      [[1, 0], [1, 1], [1, 2]],
	      [[2, 0], [2, 1], [2, 2]],
	      // verticals
	      [[0, 0], [1, 0], [2, 0]],
	      [[0, 1], [1, 1], [2, 1]],
	      [[0, 2], [1, 2], [2, 2]],
	      // diagonals
	      [[0, 0], [1, 1], [2, 2]],
	      [[2, 0], [1, 1], [0, 2]]
	    ];

	    for (let i = 0; i < posSeqs.length; i++) {
	      const winner = this.winnerHelper(posSeqs[i]);
	      if (winner != null) {
	        return winner;
	      }
	    }

	    return null;
	  }

	  winnerHelper(posSeq) {
	    for (let markIdx = 0; markIdx < Board.marks.length; markIdx++) {
	      const targetMark = Board.marks[markIdx];
	      let winner = true;
	      for (let posIdx = 0; posIdx < 3; posIdx++) {
	        const pos = posSeq[posIdx];
	        const mark = this.grid[pos[0]][pos[1]];

	        if (mark != targetMark) {
	          winner = false;
	        }
	      }

	      if (winner) {
	        return targetMark;
	      }
	    }

	    return null;
	  }

	  static isValidPos(pos) {
	    return (0 <= pos[0]) &&
	    (pos[0] < 3) &&
	    (0 <= pos[1]) &&
	    (pos[1] < 3);
	  }

	  static makeGrid() {
	    const grid = [];

	    for (let i = 0; i < 3; i++) {
	      grid.push([]);
	      for (let j = 0; j < 3; j++) {
	        grid[i].push(null);
	      }
	    }

	    return grid;
	  }
	}

	Board.marks = ['x', 'o'];

	module.exports = Board;


/***/ },
/* 4 */
/***/ function(module, exports) {

	
	const MoveError = function (msg) { this.msg = msg; };

	// MoveError really should be a child class of the built in Error object provided
	// by Javascript, but since we haven't covered inheritance yet, we'll just
	// let it be a vanilla Object for now!

	module.exports = MoveError;


/***/ }
/******/ ]);