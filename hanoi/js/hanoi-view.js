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
