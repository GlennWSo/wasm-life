import { memory} from "wasm-life/wasm_life_bg";
import { World, Cell} from "wasm-life";

const width = 256;
const height = 128;

const world = World.new(width, height);

const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";

const canvas = document.getElementById("world-canvas")
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

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

const drawCells = () => {
  const cellsPtr = world.cells(); 
  const size = width * height;
  const cells = new Uint8Array(memory.buffer, cellsPtr, size);

  ctx.beginPath();

  for (let idx= 0; idx < size; idx++) {
    let [row, col] = getRowCol(idx);
    ctx.fillStyle = cells[idx] === Cell.Dead
      ? DEAD_COLOR
      : ALIVE_COLOR;

    let pxrow = row * (CELL_SIZE + 1) + 1; // pixel row
    let pxcol = col * (CELL_SIZE + 1) + 1; // pixel column

    ctx.fillRect(pxcol, pxrow, CELL_SIZE, CELL_SIZE)
  }
  ctx.stroke();
}

const renderLoop = () => {
  world.tick();
  drawGrid();
  drawCells();
  requestAnimationFrame(renderLoop);
}


requestAnimationFrame(renderLoop);