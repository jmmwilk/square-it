let height = Math.floor (Math.random () * 4) + 1;
let width = Math.floor (Math.random () * 4) + 1;
let multiplication = height * width;
let x = 1;
let y = 1;
let countY = 01
function start () {
  drawSquaresInGame ();
  drawRectangle ();

  let game = document.getElementById('application');
  game.ondrop = function (event) {
    console.log(event);
  }
  game.ondragover= function (event) {
    event.preventDefault();
  }
}

function drawSquaresInGame () {

  for (i=0; i<100; i++) {
    let game = document.getElementById('game');
//    square.style.left = 100 + 'px';
    drawSquare (game, 'white');
  }
  x = 1;
  y = 1;
}

function drawSquare (parent, color) {
  let square = document.createElement("div");
  square.className = 'square';
  square.style.backgroundColor = color
  let addsquare = parent.appendChild(square);
  square.x = x;
  square.y = y;
  if (x == 10) {
    x = 0;
  }
  if(countY == 10) {
    y = y + 1;
  }
  x= x +1;
  countY= countY + 1;
  console.log ('x' + square.x);
  console.log ('y' + square.y);
}


function drawRectangle () {
  console.log (height, width);
  let rectangle = document.createElement("div");
  rectangle.className = 'rectangle';
  rectangle.style.height = (height * 50 + 2) + 'px';
  rectangle.style.width = (width * 50 + 2) + 'px';
  rectangle.draggable = true;
  rectangle.ondragstart = function(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
  }
  document.getElementById('side-bar').appendChild(rectangle);
  drawSquaresInRectangle(rectangle);
}

function drawSquaresInRectangle (rectangle) {
  for (i=0; i<multiplication; i++) {
    drawSquare(rectangle, 'green');
  }
}

function () {
   for (i=0; i<100; i++) {
    if (document.getElementByClassName('square').x == 
   }
}

// function drawRectangle () {
//   let height = Math.floor (Math.random () * 4) + 1;
//   let width = Math.floor (Math.random () * 4) + 1;
//   console.log (height, width);
//   let rectangle = document.createElement("div");
//   let initialWidth = parseInt(square.style.width, 10);
//   console.log('initialWidth' + initialWidth);
//   rectangle.style.height = (height * initialWidth) + 'px';
//   rectangle.style.width = width * square.style.width;
//   console.log (rectangle.style.width);
//   console.log (square.style.width);
// }