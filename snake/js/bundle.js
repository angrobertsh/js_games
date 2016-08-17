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

	$( () => {
	  let view = new View($('.snake'));
	  $('.reset').on('click', function() {
	    view.quit();
	    $('.snake').html("");
	    view = new View($('.snake'));
	  });
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Board = __webpack_require__(2);
	const Snake = __webpack_require__(3).Snake;
	const phrases = [
	  "Eve, please cover thineself, there are snakes about.",
	  "I don't know what sin is!",
	  "My missing rib hurts.",
	  "This garden is too hot. Why can't we get some air conditioning?",
	  "EVE COME EAT THIS DELICIOUS APPLE.",
	  "I AM A NICE SNEK."
	];
	const audio = new Audio('js/eat.mp3');

	class View {

	  constructor ($el) {
	    this.$el = $el;
	    this.snake = new Snake();
	    this.board = new Board(this.snake);
	    this.updateTurn = false;
	    this.board.generateApple();
	    this.score = 0;
	    $('.score').html(this.score);
	    $(document).on('keypress', this.handleKeyEvent.bind(this));
	    this.interval = setInterval(this.step.bind(this), 100);
	  }

	  handleKeyEvent (event) {
	    if (this.updateTurn) {
	      return;
	    }
	    let code = event.keyCode;
	    switch (code) {
	      case 97:
	        this.snake.turn([0,-1]);
	        break;
	      case 119:
	        this.snake.turn([-1,0]);
	        break;
	      case 100:
	        this.snake.turn([0,1]);
	        break;
	      case 115:
	        this.snake.turn([1,0]);
	        break;
	      default:
	    }
	    this.updateTurn = true;
	  }

	  step() {
	    let apple = this.snake.move(this.board.apples);
	    if (apple) {
	      let index = this.board.apples.indexOf(apple);
	      let left = this.board.apples.slice(0,index);
	      let right = this.board.apples.slice(index + 1);
	      this.board.apples = [...left, ...right];
	      this.eatApple()
	    }
	    this.board.render();
	    this.updateTurn = false;
	  }

	  eatApple() {
	    audio.play();
	    this.board.generateApple();
	    this.score += 10;
	    $('.score').html(this.score);
	    $('.phrase').html(phrases[Math.floor(Math.random() * 6)])
	    .css({top: randomPercent(), left: randomPercent()});
	  }

	  quit() {
	    clearInterval(this.interval);
	  }

	}

	function randomPercent() {
	  let rand = Math.floor(Math.random() * 60)
	  return `${rand}%`
	}

	module.exports = View;

	// a = 97
	// w = 119
	// d = 100
	// s = 115


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Coord = __webpack_require__(3).Coord;

	class Board {

	  constructor(snake) {
	    this.snake = snake;
	    this.apples = [];
	    this.setup($('.snake'));
	    this.render();
	  }

	  setup($root) {
	    for (let i = 0; i < 20;i ++) {
	      for (let j = 0; j < 20; j ++) {
	        $root.append(`<div class="grid-item" id="row${i}col${j}"></div>`);
	      }
	    }
	  }

	  render($root) {
	    this.snake.segments.forEach((segment) => {
	      $(segment.getID()).addClass('segment');
	    });
	    this.apples.forEach((apple) => {
	      $(apple.getID()).addClass('apple');
	    });
	  }

	  generateApple() {
	    let coord = this.randomCoord();
	    let error = true;
	    let view = this;
	    while (error) {
	      error = false;
	      this.snake.segments.forEach(segment => {
	        if (segment.equals(coord)) {
	          error = true;
	          coord = view.randomCoord();
	        }
	      });
	    }
	    this.apples.push(coord);
	  }

	  randomCoord() {
	    let x = Math.floor(Math.random()*20);
	    let y = Math.floor(Math.random()*20);
	    let pos = [x,y];
	    return new Coord(pos);
	  }

	}

	module.exports = Board;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const wall = new Audio('js/wall.mp3');
	const ouch = new Audio('js/self.mp3');

	class Snake {
	  constructor() {
	    this.direction = [-1,0];
	    this.segments = [ new Coord([10,10]),new Coord([11,10]), new Coord([12,10]), new Coord([13,10]), new Coord([14,10]) ];
	  }

	  move(apples) {
	    if(this.segments.length === 0){
	      return;
	    }
	    let first = this.segments[0].clone();
	    first.plus(this.direction);

	    for(let i = 0; i < this.segments.length; i++)
	    {
	      if (this.segments[i].equals(first)) {
	        alert("You Lose!");
	        this.segments = [];
	        ouch.play();
	        return;
	      }
	    }

	    if(first.isOutOfBounds()){
	      alert("You Lose!");
	      this.segments = [];
	      wall.play();
	      return;
	    }

	    let eat = false;
	    apples.forEach( apple => {
	      if(first.equals(apple)){
	        $(apple.getID()).removeClass('apple');
	        eat = apple;
	      }
	    });

	    this.segments.unshift(first);
	    if(!eat)
	    {
	      let oldSegment = this.segments.pop();
	      $(oldSegment.getID()).removeClass('segment');
	    }
	    return eat;
	  }


	  turn(dir) {
	    if (this.direction[0] === (dir[0] * -1) || this.direction[1] === (dir[1] * -1)) {
	      return;
	    }
	    this.direction = dir;
	  }
	}

	class Coord {
	  constructor(pos) {
	    this.pos = pos;
	  }

	  plus(pos) {
	    this.pos[0] += pos[0];
	    this.pos[1] += pos[1];
	  }

	  equals(coord) {
	    let pos = coord.pos;
	    return (this.pos[0] === pos[0] && this.pos[1] === pos[1]);
	  }

	  isOutOfBounds() {
	    if(this.pos[0] < 0 || this.pos[0] >= 20 || this.pos[1] < 0 || this.pos[1] >= 20){
	      return true;
	    } else {
	      return false;
	    }
	  }

	  clone(){
	    return new Coord(Array.from(this.pos));
	  }

	  getID(){
	    return `#row${this.pos[0]}col${this.pos[1]}`;
	  }

	}

	module.exports = {Snake, Coord};


/***/ }
/******/ ]);