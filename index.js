'use strict';

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
let points = 0;
let draggedDrawing;
let goatType;

function start () {
  drawSquaresInGame ();
  createRectangle ();

  let game = document.getElementById('application');
  game.ondrop = dropDrawing;

  game.ondragover= function (event) {
    event.preventDefault();
  }

  let eventContainer = document.getElementById('side-bar');
  eventContainer.ondrop= function (event) {
    event.stopPropagation();
  }
}

function drawSquaresInGame () {

  for (let i=0; i<gameSquaresCount; i++) {
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
  height = Math.floor (Math.random () * 3) + 1;
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
  for (let i=0; i<multiplication; i++) {
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
  let dims = findCornerDimensions ();
  if (dims.smallestX + dims.bigSquareSide - 1 > 10 || dims.smallestY + dims.bigSquareSide - 1 > 10) {
    return;
  }
  for (let x = dims.smallestX; x <= dims.smallestX + dims.bigSquareSide - 1; x++) {
    for (let y = dims.smallestY; y <= dims.smallestY + dims.bigSquareSide - 1; y++) {
      // console.log ('x ' + x);
      // console.log ('y ' + y);
      console.log(x, y, findSquare ('game', x, y).isOccupied);
      if (findSquare ('game', x, y).isOccupied !== true) {
        // console.log ('square empty' + findSquare ('game', x, y).id);
        return
      }
    }
  }
  console.log ('dims.bigSquareSide ' + dims.bigSquareSide);
  points = points + dims.bigSquareSide * dims.bigSquareSide;
  document.getElementById('points-container').innerText = points;

  newRound ();
}

function newRound () {
  console.log('NEW ROUND');
  for (let x = 1; x < n + 1; x++) {
    for (let y = 1; y < n + 1; y++) {
      if (findSquare ('game', x, y).isOccupied == true) {
        setTimeout (function () {removeLettuce (x, y)}, 500);        
      }
    }
  }
}

function removeLettuce (x, y) {
  findSquare ('game', x, y).removeChild(findSquare ('game', x, y).childNodes[0]);
  findSquare ('game', x, y).isOccupied = false;
  // console.log (findSquare ('game', x, y).id);
  // console.log (findSquare ('game', x, y).isOccupied);
}

function findCornerDimensions () {
  let bigSquareSide = 1;
  let smallestX = n;
  let smallestY = n;
  let highestX = 1;
  let highestY = 1;
  let saladCount = 0;
  for (let x = 1; x < n + 1; x++) {
    for (let y = 1; y < n + 1; y++) {
      let square = findSquare ('game', x, y);
      if (square.isOccupied == true) {
        saladCount = saladCount + 1
        if (square.x < smallestX) {
          smallestX = square.x;
        }
        if (square.y < smallestY) {
          smallestY = square.y;
        }
        if (square.x > highestX ) {
          highestX = findSquare ('game', x, y).x;
          console.log(square.id);
        }
        if (square.y > highestY) {
          highestY = square.y;
          console.log(square.id);
        } 
      }
    }
  }
  bigSquareSide = highestX - smallestX + 1
  if (bigSquareSide < highestY - smallestY + 1) {
    bigSquareSide = highestY - smallestY + 1
  }
  if (saladCount == 0) {
    bigSquareSide = 0;
    smallestX = 0;
    smallestY = 0;
    highestX = 0;
    highestY = 0;
  }
  let cornerDimensions = {
    bigSquareSide: bigSquareSide,
    smallestX: smallestX,
    smallestY: smallestY,
    highestX: highestX,
    highestY: highestY,
  }
  console.log ('cornerDimensions ', cornerDimensions);
  return cornerDimensions;
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
  const goat = addImage(parentId);
  if (goatType == 'goat-horizontal') {
    goat.src = 'goat-horizontal.png';
  }
  if (goatType == 'goat-vertical') {
    goat.src = 'goat-vertical.png';
  }
  goat.draggable = true;
  goat.id = 'goat';
  goat.ondragstart = function(event) {
    draggedDrawing = event.target;
    event.dataTransfer.setData("text/plain", event.target.id);
    console.log('ondragstart: ', event);
  }
  return goat;
}

function chooseGoat () {
  let number = Math.floor (Math.random () * 2);
  if (number == 0) {
    goatType = 'goat-horizontal';
  } else {
    goatType = 'goat-vertical';
  }
}

function createLettuce (parentId) {
  let lettuce = addImage (parentId);
  lettuce.className = 'lettuce';
  lettuce.src = 'lettuce.png';
}

function createEvent () {
  let number = Math.floor (Math.random () * 3);
  if (number == 0) {
      chooseGoat ();
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
  if (draggedDrawing.id == 'goat') {
    dropGoat (event);
  }
}

function dropGoat (event) {
  console.log('ondrop: ', event);
  let animationGoat = createGoat ('game');
  animationGoat.id = 'animationGoat';
  animateGoat (event);
  removeGoat ('event-container', 'goat');
  createEvent ();
}

function horizontalGoatEats (currentValue, perpendicularValue) {
  const y = perpendicularValue;

  for (let x = 1; x < n + 1; x++) {
    const square = findSquare ('game', x, y)

    if (currentValue >= square.offsetLeft 
      && currentValue < square.offsetLeft + 50
      && square.isOccupied == true
    ) {
        removeLettuce (x, y);
    }
  }
}
function verticalGoatEats (currentValue, perpendicularValue) {
  const x = perpendicularValue;

  for (let y = 1; y < n + 1; y++) {
    const square = findSquare ('game', x, y)

    if (currentValue >= square.offsetTop 
      && currentValue < square.offsetTop + 50
      && square.isOccupied == true
    ) {
        removeLettuce (x, y);
    }
  }
}


function animateGoat (event) {
  const animationGoat = document.getElementById('animationGoat');
  
  if (goatType == 'goat-horizontal') {
    let finalValueHorizontalGoat = document.getElementById('game').offsetLeft - 60;
    const y = event.target.y;
    animationGoat.style.top = event.target.offsetTop + 'px';

    animate (
      'animationGoat', 
      'left', 
      event.target.offsetLeft, 
      finalValueHorizontalGoat, 
      1000, 
      function (currentValue) {
        horizontalGoatEats (currentValue, y);
        if (currentValue < finalValueHorizontalGoat) {
          removeGoat ('game', 'animationGoat');
          isSquareDone ();
        }
      }
    );
  }

  if (goatType == 'goat-vertical') {
    let finalValueVerticalGoat = document.getElementById('game').offsetTop + n*50;
    const x = event.target.x;
    animationGoat.style.left = event.target.offsetLeft + 'px';

    animate (
      'animationGoat', 
      'top', 
      event.target.offsetTop, 
      finalValueVerticalGoat, 
      1000, 
      function (currentValue) {
        verticalGoatEats (currentValue, x);
        if (currentValue > finalValueVerticalGoat) {
          removeGoat ('game', 'animationGoat');
          isSquareDone ();
        }
      }
    );
  }

  console.log('all lettuce removed');
}



function animate (animationObjectId, animationAtributes, initialValue, finalValue, animationTime, onStep) {

  let currentValue = initialValue;
  let valueChange = (finalValue - initialValue) * 20 / animationTime
  // console.log ('valueChange ' + valueChange);
  let animationObject = document.getElementById(animationObjectId)
  animationStep ();
  function animationStep () {;
    currentValue = currentValue + valueChange;
    animationObject.style[animationAtributes] = currentValue + 'px';

    if (initialValue < finalValue) {
      if (currentValue < finalValue) {
        setTimeout (animationStep, 20);
      } else {
        animationObject.style[animationAtributes] = finalValue;
      }
    } else {
      if (currentValue > finalValue) {
        setTimeout (animationStep, 20);
      } else {
        animationObject.style[animationAtributes] = finalValue;
      }
    }

    if (onStep) {
      onStep(currentValue);
    }
  }
}

function removeGoat (parentId, goatId) {
  let parent = document.getElementById(parentId)
  parent.removeChild(document.getElementById(goatId));
}