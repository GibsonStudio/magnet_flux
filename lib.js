
var mouse = {};
mouse.x = 0;
mouse.y = 0;

var colors = ['#F9423A','#00C389','#005EB8','#E89CAE','#A30B12','#78BE20','#307C28','#5D6439','#9BCBEB','#003270','#F0B323','#FF5C39','#772583'];

var fluxCanvas;
var WIDTH = 600;
var HEIGHT = 600;

var magnets = [];
magnets.push(new Magnet({ x:100, y:100, strength:1000 }));
magnets.push(new Magnet({ x:500, y:500, strength:1000 }));
magnets.push(new Magnet({ x:400, y:50, strength:1000 }));




function init ()
{

  fluxCanvas = new Canvas({ id:'flux-canvas', width:WIDTH, height:HEIGHT, autoDrawCanvas:false });

  document.addEventListener('mousemove', function (e) { move(e); });
  document.addEventListener('mousedown', function (e) { down(e); });
  document.addEventListener('mouseup', function (e) { up(e); });
  document.addEventListener('keydown', function (e) { keyDown(e); });
  move({ pageX:0, pageY:0 });

  drawFlux();
  drawMagnets();

}


function keyDown (e)
{

  var activeMagnetIndex = getActiveMagnetIndex();
  if (activeMagnetIndex !== false) {

    if (e.code == 'KeyA') {
      magnets[activeMagnetIndex].strengthUp();
    }

    if (e.code == 'KeyZ') {
      magnets[activeMagnetIndex].strengthDown();
    }

  }

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



function getActiveMagnetIndex ()
{

  for (var i = 0; i < magnets.length; i++) {
    if (magnets[i].active) {
      return i;
    }
  }

  return false;

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
    fluxCanvas.text(m.x, m.y - 20, m.strength, { fillStyle:m.color, fontSize:12 });
  }
}




function drawFlux () {

  var inc = 2;

  for (var x = 0; x <= WIDTH; x += inc) {

    for (var y = 0; y <= HEIGHT; y += inc) {

      var flux = getFluxAtPoint(x, y);

      if (flux % 100 >= 99 || flux % 100 <= 1) {
        fluxCanvas.pixel(x,y, {fillStyle:'#f9423a' });
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


/*

function getFluxAtPoint (x,y)
{
  var points = [];
     for (var i = 0; i < magnets.length; i++) {
       var p = magnets[i];
       var v = p.strength; // value at point
       var dx = x - p.x;
       var dy = y - p.y;
       var d = Math.sqrt( (dx * dx) + (dy * dy) );// distance to point
       points.push([v,d]);
     }
     return calcPressure(points);
}


function calcPressure (points)
{

  // check for any zero distance
  for (var i = 0; i < points.length; i++) {
    if (points[i][1] == 0) {
      return points[i][0];
    }
  }

  var d = [];
  for (var i = 0; i < points.length; i++) {
    d.push(points[i][1]);
  }
  var dMax = Math.max(...d);

  var divideBy = 0;
  var number = 0;

  for (var i = 0; i < points.length; i++) {
    var d = dMax / points[i][1];
    divideBy += d;
    number += d * points[i][0];
  }

  return number / divideBy;

}



function getColor (pressure)
{

  var pMin = 550;
  var pMax = 1550;
  pressure = Math.max(Math.min(pressure, pMax), pMin);

  if ((pressure % 100) < 0.14) {
    return 'rgb(0,0,0)';
  }

  return false;

  var ratio = (pressure - pMin) / (pMax - pMin);

  return getRGB(ratio);

}



function getRGB (ratio)
{

  var cC = [0,0,200]; // cold color
  var hC = [200,0,0]; // hot color
  var r = Math.floor(cC[0] + ((hC[0] - cC[0]) * ratio));
  var g = Math.floor(cC[1] + ((hC[1] - cC[1]) * ratio));
  var b = Math.floor(cC[2] + ((hC[2] - cC[2]) * ratio));

  return 'rgba(' + r + ',' + g + ',' + b + ',' + 0.8 + ')';

}


*/

//
