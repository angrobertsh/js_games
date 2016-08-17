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

	const HanoiView = __webpack_require__(1);
	const HanoiGame = __webpack_require__(2);

	$( () => {
	  const rootEl = $('.hanoi');
	  const game = new HanoiGame();
	  $("#reset-button").on("click", function() {
	    resetGame(game, rootEl);
	  });
	  new HanoiView(game, rootEl);
	});

	function resetGame(game, rootEl) {
	  $(".hanoi").html("");
	  new HanoiView(new HanoiGame(), rootEl);
	}


/***/ },
/* 1 */
/***/ function(module, exports) {

	class HanoiView{

	  constructor(game, $root){
	    this.game = game;
	    this.$root = $root;
	    this.startTower = null;
	    this.endTower = null;
	    this.setupTowers();
	    this.render();
	  }

	  setupTowers(){
	    let view = this;
	    this.$root.append('<ul class="towers"></ul>');
	    this.game.towers.forEach(function(tower, idx) {
	      $('.towers').append(`<li class="tower" id="${idx}"></li>`);
	      $(`#${idx}`).on('click', function() {
	        view.clickTower($(this));
	      });
	    });
	  }

	  render() {
	    this.game.towers.forEach(function(tower, idx) {
	      $(`#${idx}`).html("");
	      tower.forEach(function(disc) {
	        $(`#${idx}`).prepend(`<div class="disc ${discs[disc]}"></div>`);
	      });
	    });
	  }

	  clickTower(tower) {
	    if (this.game.isWon()) {
	      return;
	    }
	    let id = parseInt(tower.attr("id"));
	    if(this.startTower !== null){
	      this.endTower = id;
	      let validMove = this.game.move(this.startTower, this.endTower);
	      if (!validMove) {
	        alert("Invalid move!");
	      }
	      $(`#${this.startTower}`).removeClass("start-tower");
	      this.startTower = null;
	      this.endTower = null;
	    } else {
	      this.startTower = id;
	      tower.addClass("start-tower");
	    }
	    this.render();
	    if (this.game.isWon()) {
	      alert("You win!!!!!");
	      $('#reset-button').removeClass("hidden");
	    }
	  }

	}

	let discs = ["zero","one","two","three"];

	module.exports = HanoiView;


/***/ },
/* 2 */
/***/ function(module, exports) {

	class Game {
	  constructor() {
	    this.towers = [[3, 2, 1], [], []];
	  }

	  isValidMove(startTowerIdx, endTowerIdx) {
	      const startTower = this.towers[startTowerIdx];
	      const endTower = this.towers[endTowerIdx];

	      if (startTower.length === 0) {
	        return false;
	      } else if (endTower.length == 0) {
	        return true;
	      } else {
	        const topStartDisc = startTower[startTower.length - 1];
	        const topEndDisc = endTower[endTower.length - 1];
	        return topStartDisc < topEndDisc;
	      }
	  }

	  isWon() {
	      // move all the discs to the last or second tower
	      return (this.towers[2].length == 3) || (this.towers[1].length == 3);
	  }

	  move(startTowerIdx, endTowerIdx) {
	      if (this.isValidMove(startTowerIdx, endTowerIdx)) {
	        this.towers[endTowerIdx].push(this.towers[startTowerIdx].pop());
	        return true;
	      } else {
	        return false;
	      }
	  }

	  print() {
	      console.log(JSON.stringify(this.towers));
	  }

	  promptMove(reader, callback) {
	      this.print();
	      reader.question("Enter a starting tower: ", start => {
	        const startTowerIdx = parseInt(start);
	        reader.question("Enter an ending tower: ", end => {
	          const endTowerIdx = parseInt(end);
	          callback(startTowerIdx, endTowerIdx)
	        });
	      });
	  }

	  run(reader, gameCompletionCallback) {
	      this.promptMove(reader, (startTowerIdx, endTowerIdx) => {
	        if (!this.move(startTowerIdx, endTowerIdx)) {
	          console.log("Invalid move!");
	        }

	        if (!this.isWon()) {
	          // Continue to play!
	          this.run(reader, gameCompletionCallback);
	        } else {
	          this.print();
	          console.log("You win!");
	          gameCompletionCallback();
	        }
	      });
	  }
	}

	module.exports = Game;


/***/ }
/******/ ]);