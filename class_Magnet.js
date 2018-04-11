

function Magnet (args) {

  var args = args || {};
  this.x = args.x || 100;
  this.y = args.y || 100;
  this.size = args.size || 10;
  this.color = args.color || '#005EB8';
  this.strength = args.strength || 1000;

  this.active = false;


  this.update = function () {
    this.x = mouse.x;
    this.y = mouse.y;
  }


}
