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

const startBtn = document.getElementById("start");
startBtn.addEventListener("click", function () {
  if (startNode === undefined) {
    setStartNode(grid[20][20]);
  }
  if (endNode === undefined) {
    setEndNode(grid[30][30]);
  }
  animate = setInterval(search, 0.0001);
  // let animate = window.requestAnimationFrame(search);
});

const stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", function () {
  // window.cancelAnimationFrame(animate);
  clearInterval(animate);
});

const startSelectBtn = document.getElementById("startSelect");
startSelectBtn.addEventListener("click", function () {
  startSelect = true;
  endSelect = false;
});

const endSelectBtn = document.getElementById("endSelect");
endSelectBtn.addEventListener("click", function () {
  startSelect = false;
  endSelect = true;
});

// initialize grid
function gridSetup() {
  for (let j=0; j < rows; j++) {
    grid.push([]);
    for (let i=0; i < cols; i++) {
      const item = new Item();
      item.x = i;
      item.y = j;
      grid[j].push(item);
    }
  }
  canvas.width = cols * w;
  canvas.height = rows * w;

  new Bit (1, 1, 1, '#c0ff33');
  init(0);
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

// Item class
function Item () {
  this.x;
  this.y;
  this.previous = undefined;
  this.visited = false;
  this.openSetId = null;
  this.distance = Math.infinity;
  this.old_distance = Math.infinity;
  this.status = "none";

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
      col = "#ffffff";
    }
    else if (this.status === "open") {
      col= "#ffe166";
    }
    else if (this.status === "oldOpen") {
      col = "#6f2561";
    }
    else if (this.status === "oldClosed") {
      let colourArray = ["#482341", "#3e2039", "#282031", "#131019"]
      const percent = rows/100;
      if (this.old_distance < percent * 3) {
        col = colourArray[0];
      }
      else if ( this.old_distance < percent * 5) {
        col = colourArray[1];
      }
      else if ( this.old_distance < percent * 10) {
        col = colourArray[2];
      }
      else if ( this.old_distance < percent * 20) {
        col = colourArray[3];
      }
      else {
        col = "black";
      }
    }
    else if (this.status === "closed") {
      let colourArray = ["#582c50", "#4e2648", "#332841", "#231a2f"]
      const percent = rows/100;
      if (this.distance < percent * 3) {
        col = colourArray[0];
      }
      else if ( this.distance < percent * 5) {
        col = colourArray[1];
      }
      else if ( this.distance < percent * 10) {
        col = colourArray[2];
      }
      else if ( this.distance < percent * 20) {
        col = colourArray[3];
      }
      else {
        col = "black";
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
  // openSet.push(current);
  // current.openSetId = openSet.length - 1;
}


function findNeighbour(cur) {
  let diagonal = false;
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
      calculateNeighbour(neighbour_top_left, cur);
    }
    if (neighbour_top_right) {
      calculateNeighbour(neighbour_top_right, cur);
    }
    if (neighbour_bottom_left) {
      calculateNeighbour(neighbour_bottom_left, cur);
    }
    if (neighbour_bottom_right) {
      calculateNeighbour(neighbour_bottom_right, cur);
    }
  }

}

function calculateNeighbour(neighbour, cur) {
  if (neighbour.visited === true) {
    // already been visited. Skip.
    return;
  }
  // check if neighbours have been visited.
  neighbour.status = "open";
  neighbour.visited = true;

  if (neighbour.distance === undefined || neighbour.distance > cur.distance + 1) {
    neighbour.distance = cur.distance + 1;
    neighbour.previous = cur;
  }
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
