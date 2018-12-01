let height;
let width;
let multiplication;
let count = 0;
let n = 10;
let gameSquaresCount = n * n;
let x = 1;
let y = 1;
let dragStartX;
let dragStartY;
let smallestX = n;
let smallestY = n;
let highestX = 1;
let highestY = 1;
let bigSquareSide = 1;
let points = 0;

function start () {
  drawSquaresInGame ();
  createRectangle ();

  let game = document.getElementById('application');
  game.ondrop = dropRectangle;

  game.ondragover= function (event) {
    event.preventDefault();
  }

  createGoat ();
}

function drawSquaresInGame () {

  for (i=0; i<gameSquaresCount; i++) {
    let game = document.getElementById('game');

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
  }
}


function createRectangle () {
  height = Math.floor (Math.random () * 2) + 1;
  width = Math.floor (Math.random () * 2) + 1;
  multiplication = height * width;
  drawRectangle ()
}


function drawRectangle () {
  const oldRectangle = document.getElementById('rectangle');
  if (oldRectangle) {
    document.getElementById('rectangle-container').removeChild(oldRectangle);
  } 
  let rectangle = document.createElement("div");
  rectangle.onclick = turnRectangle
  rectangle.id = 'rectangle';
  rectangle.className = 'rectangle';
  rectangle.style.height = (height * 50 + 2) + 'px';
  rectangle.style.width = (width * 50 + 2) + 'px';
  rectangle.draggable = true;
  rectangle.ondragstart = function(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log('ondragstart: ', event);
  }
  document.getElementById('rectangle-container').appendChild(rectangle);
  drawSquaresInRectangle(rectangle);
}


function turnRectangle () {
  let oldHeight = height;
  let oldWidth = width;
  height = oldWidth;
  width = oldHeight;
  drawRectangle ()
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
    createLettuce (x + 'square' + y);
  }
}

function paintSquare (event) {
  let chosenSquare = event.target;
  chosenSquare.style.backgroundColor = 'green';
}

function dropRectangle (event) {
  console.log('ondrop: ', event);
  let cornerCoordinates = findCornerSquare (event);
  
  const startX = cornerCoordinates.cornerX
  const endX = startX + width;
  const startY = cornerCoordinates.cornerY;
  const endY = startY + height;

  if (isEmptyArea(startX, endX, startY, endY) == false) {
    return;
  }

  for (let x = startX;  x < endX;  x++) {
    for (let y = startY;  y < endY; y++) {
      findSquare (x, y).style.backgroundColor = 'green';
    }
  }

  createRectangle ();
  isSquareDone ();
}

function isSquareDone () {
  findCornerDimensions ();
  // console.log ('bigSquareSide ' + bigSquareSide);
  // console.log ('smallestX ' + smallestX);
  // console.log ('smallestY ' + smallestY);
  for (let x = smallestX; x <= smallestX + bigSquareSide - 1; x++) {
    for (let y = smallestY; y <= smallestY + bigSquareSide - 1; y++) {
      console.log ('x ' + x);
      console.log ('y ' + y);
      if (findSquare (x, y).style.backgroundColor == 'white') {
        return
      }
    }
  }
  for (let x = smallestX; x < smallestX + bigSquareSide - 1; x++) {
    for (let y = smallestY; y < smallestY + bigSquareSide - 1; y++) {
      findSquare (x, y).style.backgroundColor == 'green'
    }
  }
  points = points + bigSquareSide * bigSquareSide;
  document.getElementById('points-container').innerText = points;
  newRound ();
}

function newRound () {
  bigSquareSide = 1;
  smallestX = 1;
  smallestY = 1;
  highestX = 1;
  highestY = 1;
  for (let x = 1; x < n + 1; x++) {
    for (let y = 1; y < n + 1; y++) {
      findSquare (x, y).style.backgroundColor = 'white';
    }
  }
}

function findCornerDimensions () {

  for (let x = 1; x < n + 1; x++) {
    for (let y = 1; y < n + 1; y++) {
      if (findSquare (x, y).style.backgroundColor == 'green') {
        if (findSquare (x, y).x < smallestX) {
          smallestX = findSquare (x, y).x;
        }
        if (findSquare (x, y).y < smallestY) {
          smallestY = findSquare (x, y).y;
        }
        if (findSquare (x, y).x > highestX ) {
          highestX = findSquare (x, y).x;
          console.log('square x'  + findSquare (x, y).x);
        }
        if (findSquare (x, y).y > highestY) {
          highestY = findSquare (x, y).y;
        } 
      }
    }
  }
  bigSquareSide = highestX - smallestX + 1
  if (bigSquareSide < highestY - smallestY + 1) {
    bigSquareSide = highestY - smallestY + 1
  }
  // console.log ('bigSquareSide ' + bigSquareSide);
  // console.log ('smallestX ' + smallestX);
  // console.log ('smallestY ' + smallestY);
  // console.log('highestX ' + highestX);
  // console.log('highestY ' + highestY);
}

function findCornerSquare (event) {
  let dropX = event.target.x;
  let dropY = event.target.y;
  let cornerCoordinates = {
    cornerX: dropX - (dragStartX - 1),
    cornerY: dropY - (dragStartY - 1)
  }
  return cornerCoordinates;
}

function findSquare (x, y) {
  return document.getElementById(x + 'square' + y);
}

function isEmptyArea (startX, endX, startY, endY) {
  console.log ('startX ' + startX);
  console.log ('startY ' + startY);
  console.log ('endX ' + endX);
  console.log ('endY ' + endY);

  for (let x = startX;  x < endX;  x++) {
    for (let y = startY;  y < endY; y++) {
      if (findSquare (x, y).style.backgroundColor == 'green') {
        return false;
      }
    }
  }

  return true;
}

function addImage (parentId) {
    let image = document.createElement('img');
    document.getElementById(parentId).appendChild(image);
    return image
}

function createGoat () {
  let goat = addImage('event-container');
  goat.src = 'koza.png'
  goat.draggable = true;
  goat.ondragstart = function(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log('ondragstart: ', event);
  }
  document.getElementById('event-container').appendChild(goat);
}

function createLettuce (parentId) {
  let lettuce = addImage (parentId);
  lettuce.src = 'lettuce.png';
}