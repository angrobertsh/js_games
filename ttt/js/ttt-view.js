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
