export function sizeGameCanvas() {
  const container = document.querySelector(".game-canvas-container");
  const canvas = container.querySelector("canvas");
  if (!container || !canvas) return;

  // const ar = canvas.width/canvas.height;
  const { width, height } = container.getBoundingClientRect();
  // if (height*ar > width) {
  //   canvas.style["width"] = `${width}px`;
  //   canvas.style.removeProperty("height");
  // } else {
  //   canvas.style["height"] = `${height}px`;
  //   canvas.style.removeProperty("width");
  // }

  const idealWidth = canvas.width;
  const idealHeight = canvas.height;
  let scale = Math.min(width/idealWidth, height/idealHeight);
  // scale = nearestPowerOf2(scale);
  const w = idealWidth * scale;
  const h = idealHeight * scale;

  // console.log("scale", scale);

  canvas.style.width = `${w}px`;
  canvas.style.height = `${h}px`;
}

function nearestPowerOf2(n) {
  return 1 << 31 - Math.clz32(n);
}

