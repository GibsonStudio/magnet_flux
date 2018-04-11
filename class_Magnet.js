

function Magnet (args) {

  var args = args || {};
  this.x = args.x || 100;
  this.y = args.y || 100;
  this.size = args.size || 10;
  this.color = args.color || colors[Math.floor(Math.random() * colors.length)];
  this.strength = args.strength || 1000;

  this.active = false;


  this.update = function () {
    this.x = mouse.x;
    this.y = mouse.y;
  }


  this.strengthUp = function () {
    this.strength += 100;
    if (this.strength > 10000) { this.strength = 10000; }
    fluxCanvas.clear();
    drawFlux();
    drawMagnets();
  }



  this.strengthDown = function () {
    this.strength -= 100;
    if (this.strength < 0) { this.strength = 0; }
    fluxCanvas.clear();
    drawFlux();
    drawMagnets();
  }



}
