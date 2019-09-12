const cols = Math.floor(window.innerWidth / w);
const rows = Math.floor(window.innerHeight / w);

let grid = [];
let current = null;
let current_end = null;

let openSet = [];
let openSet_backward = [];
let closedSet = [];
let closedSet_backward = [];
let currentPaths_foreward = [];
let currentPaths_backward = [];
let startNode = undefined;
let endNode = undefined;
let startSelect = false;
let endSelect = false;

// set up animation so user can start and stop algorithm.
let animate;
let animating = false;
let diagonalWeight = 1.4;
let frameRate = 0.01;
let diagonal = true;

const startBtn = document.getElementById("start");
startBtn.addEventListener("click", function () {
  if (startNode === undefined) {
    setStartNode(grid[20][20]);
  }
  if (endNode === undefined) {
    setEndNode(grid[30][30]);
  }
  if (animating === false) {
    animate = setInterval(search, frameRate);
    animating = true;
  }
});

const stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", function () {
  if (animating === true) {
    clearInterval(animate);
    animating = false;
  }
});

const startSelectBtn = document.getElementById("startSelect");
startSelectBtn.addEventListener("click", function () {
  startSelect = true;
  endSelect = false;
  animating = false;
});

const endSelectBtn = document.getElementById("endSelect");
endSelectBtn.addEventListener("click", function () {
  startSelect = false;
  endSelect = true;
  animating = false;
});

const updateBtn = document.getElementById("update");
updateBtn.addEventListener("click", function () {
  // get all the input fields, and apply them to the variables
  diagonalWeightInput = document.getElementById("diagonalWeight").value;

  diagonalInput = document.getElementById("diagonalBool").value;

  frameRateInput = document.getElementById("frameRate").value;
  diagonalWeight = Number(diagonalWeightInput);
  frameRate = Number(frameRateInput);
  diagonal = diagonalInput === "true" ? true : false;
});

// initialize grid
function gridSetup(num=0) {
  grid = [];
  for (let j=0; j < rows; j++) {
    grid.push([]);
    for (let i=0; i < cols; i++) {
      const item = new Item();
      item.x = i;
      item.y = j;
      grid[j].push(item);
    }
  }
  canvas.width = cols * w - 200;
  canvas.height = rows * w;

  init(num);
  updateUI();
}

function setStartNode (node) {
  openSet.forEach((s) => {
    s.visited = false;
    s.distance = Math.infinity;
    s.previous = undefined;
    s.openSetId = null;
    s.status = "oldOpen"
    s.collision = undefined;
    s.show();
  });
  openSet = [];

  closedSet.forEach((closed) => {
    closed.visited = false;
    closed.old_distance = closed.distance;
    closed.distance = Math.infinity;
    closed.previous = undefined;
    closed.openSetId = null;
    closed.status = "oldClosed";
    closed.collision = undefined;
    closed.show();
  });
  closedSet = [];
  startNode = node;
  node.status = "start";
  node.distance = 0;
  setCurrent(node, "foreward");
}

function setEndNode (node) {
  openSet_backward.forEach((s) => {
    s.visited = false;
    s.distance = Math.infinity;
    s.previous = undefined;
    s.next = undefined;
    s.openSetId = null;
    s.status = "oldOpen"
    s.collision = undefined;
    s.show();
  });
  openSet_backward = [];

  closedSet_backward.forEach((closed) => {
    closed.visited = false;
    closed.old_distance = closed.distance;
    closed.distance = Math.infinity;
    closed.previous = undefined;
    closed.next = undefined;
    closed.openSetId = null;
    closed.status = "oldClosed";
    closed.collision = undefined;
    closed.show();
  });
  closedSet_backward = [];
  endNode = node;
  endNode.status = "end";
  endNode.distance = 0;
  setCurrent(endNode, "backward");
}

// Item class
function Item () {
  this.x;
  this.y;
  this.previous = undefined;
  this.next = undefined;
  this.visited = false;
  this.openSetId = null;
  this.distance = Math.infinity;
  this.old_distance = Math.infinity;
  this.status = "none";
  this.collision = undefined;
  this.star = false;

  this.show = function() {

    let col;
    if (this.status === "path") {
      col = "white";
    }
    else if (this.status === "end") {
      col = "red";
    }
    else if (this.status === "start") {
      col = "pink";
    }
    else if (this.status === "current") {
      col = palette.white;
    }
    else if (this.status === "open") {
      col= palette.blue_three;
    }
    else if (this.status === "oldOpen") {
      col = palette.blue_four;
    }
    else if (this.status === "oldClosed") {
      const percent = rows/100;
      if (this.old_distance < percent * 4) {
        col = palette.blue_five;
      }
      else if ( this.old_distance < percent * 8) {
        col = palette.blue_four;
      }
      else if ( this.old_distance < percent * 10) {
        col = palette.blue_three;
      }
      else if ( this.old_distance < percent * 12) {
        col = palette.blue_two;
      }
      else {
        col = palette.blue_one;
      }
    }
    else if (this.status === "closed") {
      const percent = rows/100;
      if (this.distance < percent * 4) {
        col = palette.blue_five;
      }
      else if ( this.distance < percent * 8) {
        col = palette.blue_four;
      }
      else if ( this.distance < percent * 10) {
        col = palette.blue_three;
      }
      else if ( this.distance < percent * 12) {
        col = palette.blue_two;
      }
      else {
        col = palette.blue_one;
      }
    }
    c.clearRect(this.x * w, this.y * w, w, w);
    Bit(this.x, this.y, 1, col);
  };

}

// initialize the current node- set the colour and parameters.
function setCurrent (bit, position="foreward") {
  if (position === "foreward") {
    current = bit;
    current.status = "current";
    current.visited = true;
    current.show();
  }
  else if (position === "backward") {
    current_end = bit;
    current_end.status = "current";
    current_end.visited = true;
    current_end.show();
  }
}


function findNeighbour(cur, position="foreward") {
  // starting from the cur square
  // find its neighbours
  let neighbour_top, neighbour_left, neighbour_bottom, neighbour_right, neighbour_top_left, neighbour_top_right, neighbour_bottom_left, neighbour_bottom_right;
  // check that the current square isnt against any edge.
  if (cur.y > 0) {
    neighbour_top = grid[cur.y - 1][cur.x];
  }
  if (cur.x > 0) {
    neighbour_left = grid[cur.y][cur.x - 1];
  }
  if (cur.y < rows - 1) {
    neighbour_bottom
     = grid[cur.y + 1][cur.x];
  }
  if (cur.x < cols - 1) {
    neighbour_right = grid[cur.y][cur.x + 1];
  }

  // diagonals
  if (diagonal) {
    if (cur.x > 0 && cur.y > 0) {
      neighbour_top_left = grid[cur.y - 1][cur.x - 1];
    }
    if (cur.x < cols - 1 && cur.y > 0) {
      neighbour_top_right = grid[cur.y - 1][cur.x + 1];
    }
    if (cur.x > 0 && cur.y < rows - 1) {
      neighbour_bottom_left = grid[cur.y + 1][cur.x - 1];
    }
    if (cur.x < cols - 1 && cur.y < rows - 1) {
      neighbour_bottom_right = grid[cur.y + 1][cur.x + 1];
    }
  }

  if (neighbour_top) {
    calculateNeighbour(neighbour_top, cur, 1, position);
  }
  if (neighbour_left) {
    calculateNeighbour(neighbour_left, cur, 1, position);
  }
  if (neighbour_bottom) {
    calculateNeighbour(neighbour_bottom, cur, 1, position);
  }
  if (neighbour_right) {
    calculateNeighbour(neighbour_right, cur, 1, position);
  }
  if (diagonal) {
    if (neighbour_top_left) {
      calculateNeighbour(neighbour_top_left, cur, diagonalWeight, position);
    }
    if (neighbour_top_right) {
      calculateNeighbour(neighbour_top_right, cur, diagonalWeight, position);
    }
    if (neighbour_bottom_left) {
      calculateNeighbour(neighbour_bottom_left, cur, diagonalWeight, position);
    }
    if (neighbour_bottom_right) {
      calculateNeighbour(neighbour_bottom_right, cur, diagonalWeight, position);
    }
  }

}

function calculateNeighbour(neighbour, cur, weight=1, position="foreward") {
  // you are scanning a neighbour,
  // check if it has been visited, and if it has then return as we dont want to add it again.
  // check if it is also the collision, as the other end (e.g. foreward) will be setting its bits to visited, so you need to check for both.
  if (neighbour.visited === true && neighbour.collision === position) {
    // already been visited. Skip.
    return;
  }
  if (neighbour.star) {
    return;
  }

  if (neighbour.status === "oldClosed") {
    weight = weight + 5;
  }

  // check the distance doesnt exist, or replace it if the current dist would be smaller
  console.log(neighbour.distance, neighbour.previous, neighbour.next);
  if (neighbour.distance === undefined || neighbour.distance > cur.distance + weight) {
    neighbour.distance = cur.distance + weight;
    console.log(position);
    if (position === "foreward") {
      neighbour.previous = cur;
    }
    if (position === "backward") {
      neighbour.next = cur;
    }
  }

  // check if neighbours have been visited.
  neighbour.status = "open";
  neighbour.visited = true;

  neighbour.show();
  if (position === "foreward") {
    // add every neighbour so it has a collision- not just the current ones
    neighbour.collision = "foreward";
    openSet.push(neighbour);
    neighbour.openSetId = openSet.length - 1;
  }
  else if (position === "backward") {
    neighbour.collision = "backward";
    openSet_backward.push(neighbour);
    neighbour.openSetId = openSet_backward.length - 1;
  }
}


function search () {
  searchForward();
  searchBackward();
}
// the search algorithm - called by the start and stop functions above
function searchForward () {
  current.status = "closed";
  closedSet.push(current);
  current.show();
  // find the neighbours of the current, and add them to open set with their distances updated.
  findNeighbour(current, "foreward");
  // set current color to visited

  // remove current from openset.
  openSet = openSet.filter(function(value){
    return value !== current;
  });

  // filter through openset, and find the smallest distance.
  let smallest = undefined;
  openSet.forEach((s) => {
    if (smallest === undefined || smallest.distance > s.distance) {
      smallest = s;
    }
  });

  // if the current item has a collision that has been set to backwards, then he is from the end node.
  // therefore we can calculate the path now.

  if (current.collision === "backward") {
    console.log(current);
    //showPath_backward(current);
    showPath(current);
    clearInterval(animate);
    return;
  }
  //current.collision = "foreward";
  setCurrent(smallest, "foreward");
}


function searchBackward () {
  current_end.status = "closed";
  closedSet_backward.push(current_end);
  current_end.show();
  // find the neighbours of the current, and add them to open set with their distances updated.
  findNeighbour(current_end, "backward");
  // set current color to visited

  // remove current from openset.
  openSet_backward = openSet_backward.filter(function(value){
    return value !== current_end;
  });

  // filter through openset, and find the smallest distance.
  let smallest = undefined;
  openSet_backward.forEach((s) => {
    if (smallest === undefined || smallest.distance > s.distance) {
      smallest = s;
    }
  });

  if (current_end.collision === "foreward") {
    console.log(current_end);
    showPath_backward(current_end);
    //showPath(current_end.previous);
    // showPath(current_end);
    clearInterval(animate);
    return;
  }
  // current_end.collision = "backward";
  setCurrent(smallest, "backward");
}

function showPath(bit) {
  while (bit.previous !== undefined) {
    bit.previous.status = "path";

    // remove current from openset.
    if (bit.collision === "backward") {
      currentPaths_backward.push(bit);
      closedSet_backward = closedSet_backward.filter(function(value){
        return value !== bit;
      });
    }
    else {
      currentPaths_foreward.push(bit);
      closedSet = closedSet.filter(function(value){
        return value !== bit;
      });
    }

    bit.previous.show();
    bit = bit.previous;
  }
}

function showPath_backward(bit) {
  while (bit.next !== undefined) {
    bit.next.status = "path";

    // remove current from openset.
    if (bit.collision === "backward") {
      currentPaths_backward.push(bit);
      closedSet_backward = closedSet_backward.filter(function(value){
        return value !== bit;
      });
    }
    else {
      currentPaths_foreward.push(bit);
      closedSet = closedSet.filter(function(value){
        return value !== bit;
      });
    }

    bit.next.show();
    bit = bit.next;
  }
}

function oppositeTo(position) {
  if (position === "foreward") {
    return "backward";
  }
  else if (position === "backward") {
    return "foreward";
  }
}


// initialize grid.
gridSetup();
