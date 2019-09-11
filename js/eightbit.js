const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const w = 10;

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

  // push top, left, width and height into starsRendered, to add an onclickListener
  starsRendered.push([top, left, 5]);
}

function NightSky () {
  let colours = ["#1a1a27", "#191925", "#1a1a29", "#171723"];
  let row = window.innerWidth / w;
  let col = window.innerHeight / w;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      const randomColour = colours[Math.round(Math.random() * (colours.length - 1))];
      new Bit(i, j, 1, randomColour);
    }
  }

}


function init (friend_count) {
  // calculate number of stars.

  // star1
  const starOneCount = friend_count * 0.07;

  // star2
  const starTwoCount = friend_count * 0.07;

  // small star
  const smallStarCount = friend_count * 0.85;

  // med star
  const medStarCount = friend_count * 0.01;

  // create sky base.
  new NightSky();

  // calculate dimensions of canvas in 'bits'.
  const screenWidth =  window.innerWidth / w;
  const screenHeight =  window.innerHeight / w;

  for (let i = 0; i < starOneCount; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new Star(left, top, "#24e8f9", "#0499e1");
  }

  for (let i = 0; i < starTwoCount; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new Star(left, top, "#ffec68", "#ce7531");
  }

  let colours = ["#f6f64e", "#24e8f9", "#806fc8", "#5c76de"];
  for (let i = 0; i < smallStarCount; i++) {
    const top = Math.round((Math.random() * screenHeight));
    const left = Math.round((Math.random() * screenWidth));
    const randomColour = colours[Math.round(Math.random() * (colours.length - 1))];
    new Bit(left, top, 1, randomColour);
  }

  for (let i = 0; i < medStarCount; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new StarMedium(left, top, "#e1dfee", "#afabc3", "#48495f");
  }

}

init();

const starsRendered = [];

canvas.addEventListener("click", function () {
  let x = event.pageX;
  let y = event.pageY

  // check if click is in the location of a star

  starsRendered.forEach((star) => {
    // star = [top, left, width];
    const x1 = star[1] * w;
    const x2 = (star[1] + star[2]) * w;
    const y1 = star[0] * w;
    const y2 = (star[0] + star[2]) * w;
    
    if (y > y1 && y < y2 && x > x1 && x < x2) {
      console.log("star", x, y);
    }

  });
});
