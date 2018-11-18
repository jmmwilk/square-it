let height = Math.floor (Math.random () * 4) + 1;
let width = Math.floor (Math.random () * 4) + 1;
let multiplication = height * width;

function start () {
  drawSquaresInGame ();
  drawRectangle ();
}

function drawSquaresInGame () {

  for (i=0; i<100; i++) {
    let game = document.getElementById('game');
//    square.style.left = 100 + 'px';
    drawSquares (game, 'white');
  }
}

function drawSquares (parent, color) {
  let square = document.createElement("div");
  square.className = 'square';
  square.style.backgroundColor = color
  let addsquare = parent.appendChild(square);
}


function drawRectangle () {
  console.log (height, width);
  let rectangle = document.createElement("div");
  rectangle.className = 'rectangle';
  rectangle.style.height = (height * 50 + 2) + 'px';
  rectangle.style.width = (width * 50 + 2) + 'px';
  console.log(rectangle.style.height);
  document.getElementById('side-bar').appendChild(rectangle);
  drawSquaresInRectangle(rectangle);
}

function drawSquaresInRectangle (rectangle) {
  for (i=0; i<multiplication; i++) {
    drawSquares(rectangle, 'green');
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