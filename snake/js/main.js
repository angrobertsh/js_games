const View = require('./snake-view');

$( () => {
  let view = new View($('.snake'));
  $('.reset').on('click', function() {
    view.quit();
    $('.snake').html("");
    view = new View($('.snake'));
  });
});
