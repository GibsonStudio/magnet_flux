
var mouse = {};
mouse.x = 0;
mouse.y = 0;


var fluxCanvas;
var WIDTH = 600;
var HEIGHT = 600;

var magnets = [];
magnets.push(new Magnet({ x:100, y:100, strength:1000 }));
magnets.push(new Magnet({ x:500, y:500, strength:1000 }));
magnets.push(new Magnet({ x:400, y:50, strength:1000 }));



var t = new Date();
var startTime = t.getTime();
var frameCount = 0;
var maxFrames = 100;


function init ()
{

  fluxCanvas = new Canvas({ id:'flux-canvas', width:WIDTH, height:HEIGHT, autoDrawCanvas:false });

  document.addEventListener('mousemove', function (e) { move(e); });
  document.addEventListener('mousedown', function (e) { down(e); });
  document.addEventListener('mouseup', function (e) { up(e); });
  move({ pageX:0, pageY:0 });

  drawFlux();
  drawMagnets();

}


function move (e)
{

  mouse.x = e.pageX - $('#magnet-container').offset().left;
  mouse.y = e.pageY - $('#magnet-container').offset().top;

  for (var i = 0; i < magnets.length; i++) {

    if (magnets[i].active) {

      magnets[i].update();

      fluxCanvas.clear();

      drawFlux();
      drawMagnets();

      break;

    }

  }




}




function down (e)
{

  var magnetClicked = false;

  for (var i = 0; i < magnets.length; i++) {

    var d = Math.sqrt( Math.pow( (mouse.x - magnets[i].x), 2) + Math.pow( (mouse.y - magnets[i].y), 2) );

    if (d <= magnets[i].size) {

      magnetClicked = true;

      if (e.shiftKey) {

        deleteMagnet(i);

      } else {

        magnets[i].active = true;
        break;

      }

    }

  }

  if (!magnetClicked && canvasClicked()) {
    addMagnet({ x:mouse.x, y:mouse.y, strength:1000 });
  }

}




function up (e)
{
  for (var i = 0; i < magnets.length; i++) {
    magnets[i].active = false;
  }
}



function addMagnet (args)
{
  var args = args || {};
  var x = args.x || 0;
  var y = args.y || 0;
  var strength = args.strength || 1000;
  var m = new Magnet({ x:x, y:y, strength:strength });
  magnets.push(m);
  fluxCanvas.clear();
  drawFlux();
  drawMagnets();
}


function deleteMagnet (magnetIndex)
{

  magnets.splice(magnetIndex, 1);
  fluxCanvas.clear();
  drawFlux();
  drawMagnets();

}






function canvasClicked ()
{

  if (mouse.x >= 0 && mouse.x <= WIDTH && mouse.y >= 0 && mouse.y <= HEIGHT) {
    return true;
  }

  return false;

}





function drawMagnets ()
{
  for (var i = 0; i < magnets.length; i++) {
    var m = magnets[i];
    fluxCanvas.circle(m.x, m.y, m.size, { fillStyle:m.color, lineWidth:0 } );
  }
}




function drawFlux () {

  var inc = 2;

  for (var x = 0; x <= WIDTH; x += inc) {

    for (var y = 0; y <= HEIGHT; y += inc) {

      var flux = getFluxAtPoint(x, y);

      if (flux % 100 >= 99 || flux % 100 <= 1) {
        fluxCanvas.pixel(x,y, {fillStyle:'#333333' });
      }

    } // y loop

  } // x loop

}



function getFluxAtPoint (x, y)
{

  var flux = 0;

  for (var i = 0; i < magnets.length; i++) {

    var m = magnets[i];
    var thisX = x - m.x;
    var thisY = y - m.y;
    var thisDistance = Math.sqrt((thisX * thisX) + (thisY * thisY)) / 200;
    var thisFlux = m.strength / (1 + (thisDistance * thisDistance));
    flux += thisFlux;

  }

  return flux;

}









//
