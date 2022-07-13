import UPNG from "./png.js"
import * as gridEngine from "./engine/engine.js"
import { palette } from "./palette.js"

window.ImageData = class ImageData {
  constructor(a, b, c) { 
    if (a instanceof Uint8ClampedArray) {
      this.data = a;
      this.width = b;
      this.height = c;
    } else {
      this.width = a;
      this.height = b;
      this.data = new Uint8ClampedArray(a*b*4);
    }
  }
}

function blitSprite(screen, sprite, tx, ty) {
  const [_, { imageData: { data: bitmap } }] = sprite;
  for (let x = 0; x < 16; x++)
    for (let y = 0; y < 16; y++) {
      const sx = tx*16 + x;
      const sy = ty*16 + y;

      screen.data[(sy*screen.width + sx)*4 + 0] = bitmap[(y*16 + x)*4 + 0];
      screen.data[(sy*screen.width + sx)*4 + 1] = bitmap[(y*16 + x)*4 + 1];
      screen.data[(sy*screen.width + sx)*4 + 2] = bitmap[(y*16 + x)*4 + 2];
      screen.data[(sy*screen.width + sx)*4 + 3] = bitmap[(y*16 + x)*4 + 3];
    }
}

function drawTiles(state, api, screen, bitmaps) {
  const { dimensions, legend } = state;
  const { width, height, maxTileDim } = dimensions;

  const grid = api.getGrid();

  for (const cell of grid) {
    const zOrder = legend.map(x => x[0]);
    cell.sort((a, b) => zOrder.indexOf(a.type) - zOrder.indexOf(b.type));

    for (const { x, y, type } of cell) {
      blitSprite(screen, bitmaps.find(x => x[0] == type), x, y);
    }
  }
}

for await (const f of Deno.readDir('games')) {
  let src;
  try {
    src = await Deno.readTextFile('games/' + f.name);
  } catch(e) {
    console.log(`skipping ${f.name}: ${e}`);
    continue;
  }

  let screen, bitmaps;
  const setScreenSize = (w, h) => screen = new ImageData(w, h);
  const { api, state } = gridEngine.init({
    palette,
    setBitmaps: bm => bitmaps = bm,
    setScreenSize,
  });
  api.setScreenSize = setScreenSize;
  api.afterInput = () => {};
  api.onInput = () => {};

  try {
    new Function(...Object.keys(api), src)(...Object.values(api));

    if (!screen) throw new Error("never set screen size");
    if (!bitmaps) throw new Error("never set legend");
  } catch(e) {
    console.error(`couldn't run ${f.name}: ${e}`);
    continue;
  }

  drawTiles(state, api, screen, bitmaps);

  (await Deno.create("games/img/" + f.name.split('.')[0] + '.png'))
     .write(UPNG.encode([screen.data.buffer], screen.width, screen.height, 0));

  console.log(`>>> imagified ${f.name}, probably successfully!`);
}
