import { World } from "wasm-life";

const pre = document.getElementById("world-canvas")

const world = World.new();


const renderLoop = () => {
  pre.textContent = world.render();
  world.tick();
  requestAnimationFrame(renderLoop);
}


requestAnimationFrame(renderLoop);