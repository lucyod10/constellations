const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const w = 10;
const cols = Math.floor(window.innerWidth / w);
const rows = Math.floor(window.innerHeight / w);
let grid = [];
let current = null;

let openSet = [];
const closedSet = [];
let startNode;
let endNode;

// set up animation so user can start and stop algorithm.
let animate;

const startBtn = document.getElementById("start");
startBtn.addEventListener("click", function () {
  let animate = window.requestAnimationFrame(search);
});

const stopBtn = document.getElementById("stop");
stopBtn.addEventListener("click", function () {
  window.cancelAnimationFrame(animate);
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
  startNode = grid[20][20];
  startNode.distance = 0;
  endNode = grid[28][35];
  endNode.show("red");
  setCurrent(startNode);
}

// Item class
function Item () {
  this.x;
  this.y;
  this.previous = undefined;
  this.visited = false;
  this.openSetId = null;
  this.distance = Math.infinity;

  this.show = function(col) {
    Bit(this.x, this.y, 1, col);
  };

}

// function to create a square on the page.
function Bit (top, left, width, col) {
  // to keep the bits from overlapping- calculate top and left in terms of units (w)
  top = top * w;
  left = left * w;
  width = width * w;
  // draw the square
  c.beginPath();
  c.fillStyle = col;
  c.fillRect(top, left, width, width);
}

// initialize the current node- set the colour and parameters.
function setCurrent (bit) {
  current = bit;
  bit.show("purple");

  openSet.push(bit);
  bit.openSetId = openSet.length - 1;
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

  // // diagonals
  // if (cur.x > 0 && cur.y > 0) {
  //   neighbour_top_left = grid[cur.y - 1][cur.x - 1];
  // }
  // if (cur.x < cols - 1 && cur.y > 0) {
  //   neighbour_top_right = grid[cur.y - 1][cur.x + 1];
  // }
  // if (cur.x > 0 && cur.y < rows - 1) {
  //   neighbour_bottom_left = grid[cur.y + 1][cur.x - 1];
  // }
  // if (cur.x < cols - 1 && cur.y < rows - 1) {
  //   neighbour_bottom_right = grid[cur.y + 1][cur.x + 1];
  // }

  const showColour = "coral";
  if (neighbour_top) {
    calculateNeighbour(neighbour_top, cur, showColour);
  }
  if (neighbour_left) {
    calculateNeighbour(neighbour_left, cur, showColour);
  }
  if (neighbour_bottom) {
    calculateNeighbour(neighbour_bottom, cur, showColour);
  }
  if (neighbour_right) {
    calculateNeighbour(neighbour_right, cur, showColour);
  }
  //
  // if (neighbour_top_left) {
  //   calculateNeighbour(neighbour_top_left, cur, showColour);
  // }
  // if (neighbour_top_right) {
  //   calculateNeighbour(neighbour_top_right, cur, showColour);
  // }
  // if (neighbour_bottom_left) {
  //   calculateNeighbour(neighbour_bottom_left, cur, showColour);
  // }
  // if (neighbour_bottom_right) {
  //   calculateNeighbour(neighbour_bottom_right, cur, showColour);
  // }
}

function calculateNeighbour(bit, cur, showColour) {
  if (bit.visited === true) {
    // already been visited. Skip.
    return;
  }
  // check if neighbours have been visited.
  bit.show(showColour);
  bit.visited = true;

  if (bit.distance === undefined || bit.distance > cur.distance + 1) {
    bit.distance = cur.distance + 1;
    bit.previous = cur;
  }
  console.log(bit.distance);
  openSet.push(bit);
}


// the search algorithm - called by the start and stop functions above
function search () {
    // if current === end then we have finished.
    if (current === endNode) {
      // show path.
      showPath(current);
      return;
    }

    // find the neighbours of the current, and add them to open set with their distances updated.
    findNeighbour(current);
    // set current color to visited
    current.show("black");
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
    console.log(smallest);

    setCurrent(smallest);
    animate = window.requestAnimationFrame(search);
}

function showPath(bit) {
  console.log(bit);
  while (bit.previous !== undefined) {
    bit.previous.show("white");
    bit = bit.previous;
  }
}


// initialize grid.
gridSetup();


// debugging - set up mock stars
setBlockers(29, 39);
setBlockers(28, 39);
setBlockers(27, 38);
setBlockers(26, 38);
setBlockers(25, 37);
setBlockers(24, 37);
setBlockers(23, 36);
setBlockers(22, 36);
setBlockers(21, 35);

setBlockers(29, 40);
setBlockers(30, 40);
setBlockers(31, 40);
setBlockers(32, 40);
setBlockers(33, 40);
setBlockers(34, 40);
setBlockers(35, 40);
setBlockers(36, 40);
setBlockers(37, 40);
setBlockers(38, 40);
setBlockers(39, 40);
setBlockers(40, 40);
setBlockers(41, 40);
setBlockers(42, 40);
setBlockers(43, 40);
setBlockers(44, 40);
setBlockers(45, 40);
setBlockers(46, 40);

setBlockers(47, 40);
setBlockers(48, 40);
setBlockers(49, 41);
setBlockers(50, 42);
setBlockers(50, 43);
setBlockers(50, 44);

function setBlockers(a, b) {
  let one = grid[a][b];
  one.visited = true;
  one.show("limegreen");
}

(function initStars () {
  let colours = ["#f6f64e", "#24e8f9", "#806fc8", "#5c76de"];
  for (let i = 0; i < 900; i++) {
    const top = Math.floor((Math.random() * rows));
    const left = Math.floor((Math.random() * cols));
    console.log(top, left, rows, cols);
    const randomColour = colours[Math.round(Math.random() * (colours.length - 1))];
    let one = grid[top][left];
    one.visited = true;
    one.show(randomColour);
  }
})();
