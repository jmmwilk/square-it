let height;
let width;
let multiplication;
let count = 0;
let n = 10;
let x = 1;
let y = 1;
let dragStartX;
let dragStartY;

function start () {
  drawSquaresInGame ();
  drawRectangle ();

  let game = document.getElementById('application');
  game.ondrop = dropRectangle;

  game.ondragover= function (event) {
    event.preventDefault();
  }
}

function drawSquaresInGame () {

  for (i=0; i<100; i++) {
    let game = document.getElementById('game');
//    square.style.left = 100 + 'px';

    x = count % n + 1;
    y = Math.floor (count / n) + 1;
    count = count + 1;
    drawSquare (game, 'white', x, y);
  }
}

function drawSquare (parent, color, x, y) {
  let square = document.createElement("div");
  square.className = 'square';
  parent.appendChild(square);
  square.style.backgroundColor = color;
  square.x = x;
  square.y = y;
  square.id = x + 'square' + y



  square.onmousedown = function(event) {
    dragStartX = event.target.x;
    dragStartY = event.target.y;
    console.log ('dragStartX' + dragStartX);
    console.log ('dragStartY' + dragStartY)
  }
}


function drawRectangle () {
  const oldRectangle = document.getElementById('rectangle');
  if (oldRectangle) {
    document.getElementById('side-bar').removeChild(oldRectangle);
  } 
  height = Math.floor (Math.random () * 4) + 1;
  width = Math.floor (Math.random () * 4) + 1;
  multiplication = height * width;
  let rectangle = document.createElement("div");
  rectangle.id = 'rectangle';
  rectangle.className = 'rectangle';
  rectangle.style.height = (height * 50 + 2) + 'px';
  rectangle.style.width = (width * 50 + 2) + 'px';
  rectangle.draggable = true;
  rectangle.ondragstart = function(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log('ondragstart: ', event);
  }
  document.getElementById('side-bar').appendChild(rectangle);
  drawSquaresInRectangle(rectangle);
}

function drawSquaresInRectangle (rectangle) {
  console.log ('width' + width);
  console.log ('height' + height);
  count = 0;
  for (i=0; i<multiplication; i++) {
    x = count % width + 1;
    y = Math.floor (count / width) + 1;

    count = count + 1
    drawSquare(rectangle, 'green', x, y);
  }
}

function paintSquare (event) {
  let chosenSquare = event.target;
  chosenSquare.style.backgroundColor = 'green';
}

function dropRectangle (event) {
    console.log('ondrop: ', event);
    paintCornerSquare (event);

  }
function findCornerSquare (event) {
  let dropX = event.target.x;
  let dropY = event.target.y;
  let cornerCoordinates = {
    cornerX: dropX - (dragStartX - 1),
    cornerY: dropY - (dragStartY - 1)
  }
  return cornerCoordinates
}

function paintCornerSquare (event) {
  let cornerCoordinates = findCornerSquare (event);
  
  const startX = cornerCoordinates.cornerX
  const endX = startX + width;
  const startY = cornerCoordinates.cornerY;
  const endY = startY + height;

  if (isEmtpyArea(startX, endX, startY, endY) == false) {
    return;
  }

  for (let x = startX;  x < endX;  x++) {
    for (let y = startY;  y < endY; y++) {
      findSquare (x, y).style.backgroundColor = 'green';
    }
  }

  drawRectangle ();

}

function findSquare (x, y) {
  return document.getElementById(x + 'square' + y);
}

function isEmtpyArea (startX, endX, startY, endY) {

  for (let x = startX;  x < endX;  x++) {
    for (let y = startY;  y < endY; y++) {
      if (findSquare (x, y).style.backgroundColor == 'green') {
        return false;
      }
    }
  }

  return true;
}