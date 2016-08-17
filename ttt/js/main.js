const View = require('./ttt-view');
const Game = require('./game');

let game = new Game();
$( () => {
  let view = new View(game, $('.ttt'));
  view.setupBoard();
  view.bindEvents();
});
