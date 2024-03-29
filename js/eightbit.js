const palette = {
  white: "white",

  blue_one: '#1a1a27',
  blue_two: '#1e1e2d',
  blue_three: '#1e1e2d',
  blue_four: '#212131',
  blue_five: '#232335',

  starOne_yellow: '#ffec68',
  starOne_orange: '#ce7531',
  starOne_aqua: "#24e8f9",
  starOne_blue: "#0499e1",

  sky_one: "#1a1a27",
  sky_two: "#191925",
  sky_three: "#1a1a29",
  sky_four: "#171723",

  bit_yellow: "#f6f64e",
  bit_aqua: "#24e8f9",
  bit_lavender: "#806fc8",
  bit_purple: "#5c76de",

  star_med_pale: "#e1dfee",
  star_med_med: "#afabc3",
  star_med_dark: "#48495f",
}

const palette_1 = {
  white: "white",

  blue_one: '#2c2c41',
  blue_two: '#2c2c41',
  blue_three: '#373754',
  blue_four: '#3f3f60',
  blue_five: '#434369',

  starOne_yellow: '#ffec68',
  starOne_orange: '#ce7531',
  starOne_aqua: "#24e8f9",
  starOne_blue: "#0499e1",

  sky_one: "#30305f",
  sky_two: "#2a2a56",
  sky_three: "#25254d",
  sky_four: "#272755",

  bit_yellow: "#f6f64e",
  bit_aqua: "#24e8f9",
  bit_lavender: "#806fc8",
  bit_purple: "#5c76de",

  star_med_pale: "#e1dfee",
  star_med_med: "#afabc3",
  star_med_dark: "#48495f",
}


const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

const w = 3;

let mouse = {
  x: undefined,
  y: undefined
};
window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// TODO make resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth - 200;
  canvas.height = window.innerHeight - 200;
  init();
});

function Bit (top, left, width, col, visited=false) {
  if (grid !== undefined && visited === true) {
    if (grid.length > left && grid[0].length > top) {
      grid[left][top].star = true;
    }
  }
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
  new Bit(1 + left, 1 + top, 1, colour1, true);
  new Bit(2 + left, 1 + top, 1, colour2, true);
  new Bit(0 + left, 1 + top, 1, colour2, true);
  new Bit(1 + left, 0 + top, 1, colour2, true);
  new Bit(1 + left, 2 + top, 1, colour2, true);
}

function StarMedium (left, top, colour1, colour2, colour3) {
  // create a star.
  //center
  new Bit(2 + left, 2 + top, 1, colour1, true);
  // top left bottom right
  new Bit(2 + left, 1 + top, 1, colour2, true);
  new Bit(2 + left, 3 + top, 1, colour2, true);
  new Bit(1 + left, 2 + top, 1, colour2, true);
  new Bit(3 + left, 2 + top, 1, colour2, true);

  // diagonals
  new Bit(1 + left, 1 + top, 1, colour3, true);
  new Bit(3 + left, 1 + top, 1, colour3, true);
  new Bit(1 + left, 3 + top, 1, colour3, true);
  new Bit(3 + left, 3 + top, 1, colour3, true);

  // extension
  new Bit(2 + left, 0 + top, 1, colour3, true);
  new Bit(0 + left, 2 + top, 1, colour3, true);
  new Bit(4 + left, 2 + top, 1, colour3, true);
  new Bit(2 + left, 4 + top, 1, colour3, true);

  // push top, left, width and height into starsRendered, to add an onclickListener
  starsRendered.push([top, left, 5]);
}

function NightSky () {
  let colours = [palette.sky_one, palette.sky_two, palette.sky_three, palette.sky_four];
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
  //const starOneCount = 0;

  // star2
  const starTwoCount = friend_count * 0.07;
  //const starTwoCount = 0;

  // small star
  const smallStarCount = friend_count * 0.75;
  //const smallStarCount =  0;

  // med star
  const medStarCount = friend_count * 0.11;

  // create sky base.
  new NightSky();

  // calculate dimensions of canvas in 'bits'.
  const screenWidth =  window.innerWidth / w;
  const screenHeight =  window.innerHeight / w;

  for (let i = 0; i < starOneCount; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new Star(left, top, palette.starOne_aqua, palette.starOne_blue);
  }

  for (let i = 0; i < starTwoCount; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new Star(left, top, palette.starOne_yellow, palette.starOne_orange);
  }

  let colours = [palette.bit_yellow, palette.bit_aqua, palette.bit_lavender, palette.bit_purple];
  for (let i = 0; i < smallStarCount; i++) {
    const top = Math.round((Math.random() * screenHeight));
    const left = Math.round((Math.random() * screenWidth));
    const randomColour = colours[Math.round(Math.random() * (colours.length - 1))];
    new Bit(left, top, 1, randomColour, true);
  }

  for (let i = 0; i < medStarCount; i++) {
    const top = Math.round(Math.random() * screenHeight);
    const left = Math.round(Math.random() * screenWidth);
    let star = new StarMedium(left, top, palette.star_med_pale, palette.star_med_med, palette.star_med_dark);
  }

  starClickEvent();
}

const starsRendered = [];

function starClickEvent () {
  canvas.addEventListener("click", function () {
    let x = event.pageX;
    let y = event.pageY;

    // check if click is in the location of a star
    starsRendered.forEach((star) => {
      // star = [top, left, width];
      const x1 = star[1] * w;
      const x2 = (star[1] + star[2]) * w;
      const y1 = star[0] * w;
      const y2 = (star[0] + star[2]) * w;

      if (y > y1 && y < y2 && x > x1 && x < x2) {
        console.log("star", x, y);
        if (startSelect === true) {
          clearInterval(animate);
          setStartNode(grid[star[0]][star[1]]);
        }
        if (endSelect === true) {
          clearInterval(animate);
          setEndNode(grid[star[0]][star[1]]);
        }
        startSelect = false;
        endSelect = false;
      }
    });
  });
}
