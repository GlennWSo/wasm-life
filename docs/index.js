import init from "./pkg/wasm_life.js"
import { World} from "./pkg/wasm_life.js";
let wasm = await init();
let memory = wasm.memory;

const width = 32*2;
const height = 30;

let world = World.new(width, height);

const randBtn = document.getElementById("random");
randBtn.addEventListener("click", () => {
  world = World.new(width, height);
  drawGrid();
  drawCells();
})

const clearBtn = document.getElementById("clear");
clearBtn.addEventListener("click", () => {
  world.clear();
  drawGrid();
  drawCells();
})

const CELL_SIZE = 15; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#282828";
const ALIVE_COLOR = "#b8bb26";

const canvas = document.getElementById("world-canvas")
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const getClickRC = (event) => {
  const boundRect = canvas.getBoundingClientRect();
  const scaleX = canvas.width /boundRect.width;
  const scaleY = canvas.height /boundRect.height;
  const canvasLeft = (event.clientX - boundRect.left) * scaleX;
  const canvasTop = (event.clientY - boundRect.top) * scaleY;
  const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height);
  const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width);
  return [row, col];
}

const radio = document.getElementsByName("spawn_radio");
canvas.addEventListener("click", event => {
  const [row, col] = getClickRC(event);
  console.log("canvas cliced at:", row, col);
  if (radio[0].checked) {
    console.log("spaw ship");
    world.spawn_ship(row, col);
  } else if (radio[1].checked){
    console.log("spaw die hard");
    world.spawn_diehard1(row, col);
  } else {
    console.log("toggle cell");
    world.toggle_cell(row, col);
  }
  drawGrid();
  drawCells();
})

const ctx = canvas.getContext("2d");

const drawGrid = () => {
  ctx.beginPath();
  ctx.strokeStyle = GRID_COLOR;

  // Vertical lines.
  for (let i = 0; i <= width; i++) {
    ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
    ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
  }

  // Horizontal lines.
  for (let j = 0; j <= height; j++) {
    ctx.moveTo(0,                           j * (CELL_SIZE + 1) + 1);
    ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
  }

  ctx.stroke();
};

const getIndex = (row, column) => {
  return row * width + column;
};

const getRowCol = (idx) => {
  let row = Math.floor(idx/width);
  let col = idx % width;
  return [row, col];
}

const bitIsSet = (n, arr) => {
  const byte = Math.floor(n / 8);
  const mask = 1 << (n % 8);
  return (arr[byte] & mask) === mask;
};

const drawCells = () => {
  const cellsPtr = world.cells(); 
  const size = width * height;
  const cells = new Uint8Array(memory.buffer, cellsPtr, size/8);

  ctx.beginPath();

  for (let idx= 0; idx < size; idx++) {
    let [row, col] = getRowCol(idx);
    ctx.fillStyle = bitIsSet(idx, cells)
      ? ALIVE_COLOR
      : DEAD_COLOR;

    let pxrow = row * (CELL_SIZE + 1) + 1; // pixel row
    let pxcol = col * (CELL_SIZE + 1) + 1; // pixel column

    ctx.fillRect(pxcol, pxrow, CELL_SIZE, CELL_SIZE)
  }
  ctx.stroke();
}

let animationId = null;
const renderLoop = () => {
  world.tick();
  drawGrid();
  drawCells();
   animationId = requestAnimationFrame(renderLoop);
}
const isPaused = () => {
  return animationId === null;
}

const playButton = document.getElementById("play-pause");

const play = () => {
  playButton.textContent = "⏸"
  renderLoop();
};
const pause = () => {
  playButton.textContent = "▶"
  cancelAnimationFrame(animationId);
  animationId = null;
};

playButton.addEventListener("click", event => {
  if (isPaused()) {
    play();
  } else {
    pause();
  }
});

play();