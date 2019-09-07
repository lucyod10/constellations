const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const w = 13;

let mouse = {
  x: undefined,
  y: undefined
};
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  init();
});


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

function Star (left, top, colour1, colour2) {
  // create a star.
  new Bit(1 + left, 1 + top, 1, colour1);
  new Bit(2 + left, 1 + top, 1, colour2);
  new Bit(0 + left, 1 + top, 1, colour2);
  new Bit(1 + left, 0 + top, 1, colour2);
  new Bit(1 + left, 2 + top, 1, colour2);
}

function StarMedium (left, top, colour1, colour2, colour3) {
  // create a star.
  //center
  new Bit(2 + left, 2 + top, 1, colour1);
  // top left bottom right
  new Bit(2 + left, 1 + top, 1, colour2);
  new Bit(2 + left, 3 + top, 1, colour2);
  new Bit(1 + left, 2 + top, 1, colour2);
  new Bit(3 + left, 2 + top, 1, colour2);

  // diagonals
  new Bit(1 + left, 1 + top, 1, colour3);
  new Bit(3 + left, 1 + top, 1, colour3);
  new Bit(1 + left, 3 + top, 1, colour3);
  new Bit(3 + left, 3 + top, 1, colour3);

  // extension
  new Bit(2 + left, 0 + top, 1, colour3);
  new Bit(0 + left, 2 + top, 1, colour3);
  new Bit(4 + left, 2 + top, 1, colour3);
  new Bit(2 + left, 4 + top, 1, colour3);
}

function NightSky () {
  let colours = ["#1a1a27", "#191925", "#1a1a29", "#171723"];
  let row = window.innerWidth / w;
  let col = window.innerHeight / w;
  console.log(w);
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const randomColour = colours[Math.round(Math.random() * (colours.length - 1))];
      new Bit(i, j, 1, randomColour);
    }
  }

}


function init () {
  new NightSky();
  const screenWidth =  window.innerWidth / w;
  const screenHeight =  window.innerHeight / w;

  for (let i = 0; i < 5; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new Star(left, top, "#24e8f9", "#0499e1");
  }

  for (let i = 0; i < 12; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new Star(left, top, "#ffec68", "#ce7531");
  }

  let colours = ["#f6f64e", "#24e8f9", "#806fc8", "#5c76de"];
  for (let i = 0; i < 40; i++) {
    const top = Math.round((Math.random() * screenHeight));
    const left = Math.round((Math.random() * screenWidth));
    const randomColour = colours[Math.round(Math.random() * (colours.length - 1))];
    console.log(randomColour);
    new Bit(left, top, 1, randomColour);
  }

  for (let i = 0; i < 5; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new StarMedium(left, top, "#e1dfee", "#afabc3", "#48495f");
  }



}

init();
