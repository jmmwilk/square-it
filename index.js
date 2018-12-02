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
let draggedDrawing;

function start () {
  drawSquaresInGame ();
  createRectangle ();

  let game = document.getElementById('application');
  game.ondrop = dropDrawing;

  game.ondragover= function (event) {
    event.preventDefault();
  }
}

function drawSquaresInGame () {

  for (i=0; i<gameSquaresCount; i++) {
    let game = document.getElementById('game');

    x = count % n + 1;
    y = Math.floor (count / n) + 1;
    count = count + 1;
    drawSquare (game, x, y);
  }
}

function drawSquare (parent, x, y) {
  let square = document.createElement("div");
  square.className = 'square';
  parent.appendChild(square);
  square.x = x;
  square.y = y;
  square.id = parent.id + x + 'square' + y;
  square.isOccupied = false;

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
  let rectangle = document.createElement("div");
  rectangle.onclick = turnRectangle
  rectangle.id = 'rectangle';
  rectangle.className = 'rectangle';
  rectangle.style.height = (height * 50 + 2) + 'px';
  rectangle.style.width = (width * 50 + 2) + 'px';
  rectangle.draggable = true;
  rectangle.ondragstart = function(event) {
    draggedDrawing = event.target;
    event.dataTransfer.setData("text/plain", event.target.parentNode.id);
    console.log('ondragstart: ', event);
  }
  document.getElementById('event-container').appendChild(rectangle);
  drawSquaresInRectangle(rectangle);
}


function turnRectangle () {
  removeOldRectangle ();
  let oldHeight = height;
  let oldWidth = width;
  height = oldWidth;
  width = oldHeight;
  drawRectangle ()
}

function drawSquaresInRectangle (rectangle) {
  // console.log ('width' + width);
  // console.log ('height' + height);
  count = 0;
  for (i=0; i<multiplication; i++) {
    x = count % width + 1;
    y = Math.floor (count / width) + 1;

    count = count + 1
    drawSquare(rectangle, x, y);
    createLettuce ('rectangle' + x + 'square' + y);
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
  // console.log ('cornerCoordinates.cornerX ' + cornerCoordinates.cornerX)

  if (isEmptyArea(startX, endX, startY, endY) == false) {
    return;
  }

  for (let x = startX;  x < endX;  x++) {
    for (let y = startY;  y < endY; y++) {
      createLettuce ('game' + x + 'square' + y);
      findSquare ('game', x, y).isOccupied = true;
      removeOldRectangle ();
    }
  }
  isSquareDone ();
  createEvent ();
}

function isSquareDone () {
  findCornerDimensions ();
  // console.log ('bigSquareSide ' + bigSquareSide);
  // console.log ('smallestX ' + smallestX);
  // console.log ('smallestY ' + smallestY);
  for (let x = smallestX; x <= smallestX + bigSquareSide - 1; x++) {
    for (let y = smallestY; y <= smallestY + bigSquareSide - 1; y++) {
      // console.log ('x ' + x);
      // console.log ('y ' + y);
      console.log(findSquare ('game', x, y).isOccupied);
      if (findSquare ('game', x, y).isOccupied !== true) {
        return
      }
    }
  }
  points = points + bigSquareSide * bigSquareSide;
  document.getElementById('points-container').innerText = points;
  newRound ();
}

function newRound () {
  bigSquareSide = 1;
  smallestX = n;
  smallestY = n;
  highestX = 1;
  highestY = 1;
  for (let x = 1; x < n + 1; x++) {
    for (let y = 1; y < n + 1; y++) {
      if (findSquare ('game', x, y).isOccupied == true) {
        setTimeout (function () {removeLettuce (x, y)}, 1000);
        findSquare ('game', x, y).isOccupied = false;        
      }
    }
  }
}

function removeLettuce (x, y) {
  findSquare ('game', x, y).removeChild(findSquare ('game', x, y).childNodes[0])
}

function findCornerDimensions () {

  for (let x = 1; x < n + 1; x++) {
    for (let y = 1; y < n + 1; y++) {
      let square = findSquare ('game', x, y);
      if (square.isOccupied == true) {
        if (square.x < smallestX) {
          smallestX = square.x;
        }
        if (square.y < smallestY) {
          smallestY = square.y;
        }
        if (square.x > highestX ) {
          highestX = findSquare ('game', x, y).x;
          // console.log('square x'  + findSquare ('game', x, y).x);
        }
        if (square.y > highestY) {
          highestY = square.y;
        } 
      }
    }
  }
  bigSquareSide = highestX - smallestX + 1
  if (bigSquareSide < highestY - smallestY + 1) {
    bigSquareSide = highestY - smallestY + 1
  }
  console.log ('bigSquareSide ' + bigSquareSide);
  console.log ('smallestX ' + smallestX);
  console.log ('smallestY ' + smallestY);
  console.log('highestX ' + highestX);
  console.log('highestY ' + highestY);
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

function findSquare (parentId, x, y) {
  return document.getElementById(parentId + x + 'square' + y);
}

function isEmptyArea (startX, endX, startY, endY) {
  // console.log ('startX ' + startX);
  // console.log ('startY ' + startY);
  // console.log ('endX ' + endX);
  // console.log ('endY ' + endY);

  for (let x = startX;  x < endX;  x++) {
    for (let y = startY;  y < endY; y++) {
      // console.log ('x' + x);
      // console.log ('y' + y);
      if (findSquare ('game', x, y).isOccupied == true) {
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

function createGoat (parentId) {
  let goat = addImage(parentId);
  goat.src = 'koza.png'
  goat.draggable = true;
  goat.className = 'goat';
  goat.ondragstart = function(event) {
    draggedDrawing = event.target;
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log('ondragstart: ', event);
  }
  return goat;
}

function createLettuce (parentId) {
  let lettuce = addImage (parentId);
  lettuce.className = 'lettuce';
  lettuce.src = 'lettuce.png';
}

function createEvent () {
  let number = Math.floor (Math.random () * 2);
  if (number == 0) {
    createGoat ('event-container');
  } else {
    createRectangle ();
  }
}
function removeOldRectangle () {
 const oldRectangle = document.getElementById('rectangle');
  if (oldRectangle) {
    document.getElementById('event-container').removeChild(oldRectangle);
  }  
}

function dropDrawing (event) {
  if (draggedDrawing.className == 'rectangle') {
    dropRectangle (event)
  }
  if (draggedDrawing.className == 'goat') {
    dropGoat (event);
  }
}

function dropGoat (event) {
  console.log('ondrop: ', event);
  let animationGoat = createGoat ('game');
  animationGoat.className = 'animationGoat';
  animationGoat.style.left = event.target.offsetLeft + 'px';
  animationGoat.style.top = event.target.offsetTop + 'px';
  for (i=0; i<10; i++) {
    setTimeout (function () {
      animationGoat.style.left = event.target.offsetLeft - i * 50 + 'px';
      console.log ('animationGoat.style.left ' + animationGoat.style.left);
      console.log (i);
    }, i*500)
  }
}

function runGoat () {
  animationGoat.style.left = event.target.offsetLeft - i * 50 + 'px';
}