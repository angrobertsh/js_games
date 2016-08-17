const HanoiView = require('./hanoi-view');
const HanoiGame = require('./game');

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
