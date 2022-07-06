/*
@title: maze_game
@author: leo mcelroy
*/

setLegend(
  [ "player", bitmap`
................
................
................
................
.....000000.....
....00....00....
....0..0.0.0....
....00.....0....
.....0....0.....
.....000000.....
......0..00.....
.....00...0.....
.....0..........
................
................
................
 `],
  [ "red", bitmap`
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
3333333333333333
 `],
  [ "wall", bitmap`
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
0000000000000000
 `]
)

setSolids(["player", "red", "wall"])

let level = 0;

const levels = [
  map`
0..2....
...2....
..2222..
........
........
..2222..
..22....
..22....
`,
  map`
0....
.....
.....
.....
`
]


setMap(levels[level])
const player = getFirst("player");
addSprite(player.x - player.dx, player.y - player.dy, "red")

onInput("up", _ => {
  getFirst("player").y -= 1;
})

onInput("down", _ => {
  getFirst("player").y += 1;
})

onInput("left", _ => {
  getFirst("player").x -= 1;
})

onInput("right", _ => {
  getFirst("player").x += 1;
})

afterInput(_ => {
  const player = getFirst("player");
  if (player.dy !== 0 || player.dx !==0) {
    addSprite(player.x, player.y, "red")
  }

  if (getAll("red").length === width() * height() - getAll("wall").length) {
    level++;
    if (level in levels) setMap(levels[level])
    else console.log("you win")
    addSprite(getFirst("player").x, getFirst("player").y, "red")
  }
})