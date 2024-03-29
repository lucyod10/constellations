const cols = Math.floor(window.innerWidth / w);
const rows = Math.floor(window.innerHeight / w);

let grid = [];
let current = null;

let openSet = [];
let closedSet = [];
let currentPaths = [];
let startNode = undefined;
let endNode = undefined;
let startSelect = false;
let endSelect = false;

// set up animation so user can start and stop algorithm.
let animate;
let animating = false;
let diagonalWeight = 1.4;
let frameRate = 0.1;
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
    closed.show();
  });
  closedSet = [];
  startNode = node;
  node.status = "start";
  node.distance = 0;
  setCurrent(node);
}

function setEndNode (node) {
  endNode = node;
  endNode.status = "end";
}

// An item is what the grid is made up of. The settings in here handle how the algorithm works
function Item () {
  this.x;
  this.y;
  this.previous = undefined;
  this.visited = false;
  this.openSetId = null;
  this.distance = Math.infinity;
  this.old_distance = Math.infinity;
  this.status = "none";
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
      col= palette.blue_five;
    }
    else if (this.status === "oldOpen") {
      col = palette.blue_four;
    }
    else if (this.status === "oldClosed") {
      const percent = rows/100;
      if (this.old_distance < percent * 3) {
        col = palette.blue_one;
      }
      else if ( this.old_distance < percent * 5) {
        col = palette.blue_two;
      }
      else if ( this.old_distance < percent * 10) {
        col = palette.blue_three;
      }
      else if ( this.old_distance < percent * 20) {
        col = palette.blue_four;
      }
      else {
        col = palette.blue_five;
      }
    }
    else if (this.status === "closed") {
      const percent = rows/100;
      if (this.distance < percent * 3) {
        col = palette.blue_one;
      }
      else if ( this.distance < percent * 5) {
        col = palette.blue_two;
      }
      else if ( this.distance < percent * 10) {
        col = palette.blue_three;
      }
      else if ( this.distance < percent * 20) {
        col = palette.blue_four;
      }
      else {
        col = palette.blue_five;
      }
    }
    c.clearRect(this.x * w, this.y * w, w, w);
    Bit(this.x, this.y, 1, col);
  };

}

// initialize the current node- set the colour and parameters.
function setCurrent (bit) {
  current = bit;
  current.status = "current";
  current.visited = true;
  current.show();
}


function findNeighbour(cur) {
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
    calculateNeighbour(neighbour_top, cur);
  }
  if (neighbour_left) {
    calculateNeighbour(neighbour_left, cur);
  }
  if (neighbour_bottom) {
    calculateNeighbour(neighbour_bottom, cur);
  }
  if (neighbour_right) {
    calculateNeighbour(neighbour_right, cur);
  }
  if (diagonal) {
    if (neighbour_top_left) {
      calculateNeighbour(neighbour_top_left, cur, diagonalWeight);
    }
    if (neighbour_top_right) {
      calculateNeighbour(neighbour_top_right, cur, diagonalWeight);
    }
    if (neighbour_bottom_left) {
      calculateNeighbour(neighbour_bottom_left, cur, diagonalWeight);
    }
    if (neighbour_bottom_right) {
      calculateNeighbour(neighbour_bottom_right, cur, diagonalWeight);
    }
  }

}

function calculateNeighbour(neighbour, cur, weight=1) {
  if (neighbour.visited === true) {
    // already been visited. Skip.
    return;
  }
  if (neighbour.star) {
    return;
  }

  if (neighbour.status === "oldClosed") {
    weight = weight + 5;
  }

  if (neighbour.distance === undefined || neighbour.distance > cur.distance + weight) {
    neighbour.distance = cur.distance + weight;
    neighbour.previous = cur;
  }

  // check if neighbours have been visited.
  neighbour.status = "open";
  neighbour.visited = true;

  neighbour.show();
  openSet.push(neighbour);
  neighbour.openSetId = openSet.length - 1;
}


// the search algorithm - called by the start and stop functions above
function search () {
  // if current === end then we have finished.
  if (current === endNode) {
    // show path.
    endNode.previous = current.previous;
    showPath(current);
    return;
  }
  current.status = "closed";
  closedSet.push(current);
  current.show();
  // find the neighbours of the current, and add them to open set with their distances updated.
  findNeighbour(current);
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
  setCurrent(smallest);
}

function showPath(bit) {
  while (bit.previous !== undefined) {
    bit.previous.status = "path";
    currentPaths.push(bit);
    // remove current from openset.
    closedSet = closedSet.filter(function(value){
      return value !== bit;
    });
    bit.previous.show();
    bit = bit.previous;
  }
}

// initialize grid.
gridSetup();
