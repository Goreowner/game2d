let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let nextBtn = document.getElementById("nextLevelBtn");

let levels, cutscenes;
let currentLevel = 0;
let player, goal, gridSize;

async function loadData() {
  levels = await fetch("levels.json").then(r => r.json());
  cutscenes = await fetch("cutscenes.json").then(r => r.json());
  startLevel(0);
}

function startLevel(n) {
  currentLevel = n;
  let lvl = levels[n];

  gridSize = lvl.gridSize;
  player = {x: lvl.start[0], y: lvl.start[1]};
  goal = {x: lvl.goal[0], y: lvl.goal[1]};

  draw();
  nextBtn.style.display = "none";

  // cutscene trigger
  if (cutscenes[(n+1).toString()]) {
    showCutscene(cutscenes[(n+1).toString()]);
  }
}

function draw() {
  ctx.clearRect(0,0,400,400);

  let tile = 400 / gridSize;

  ctx.fillStyle = "gray";
  for (let i=0;i<gridSize;i++){
    for (let j=0;j<gridSize;j++){
      ctx.strokeRect(i*tile, j*tile, tile, tile);
    }
  }

  ctx.fillStyle = "yellow";
  ctx.fillRect(goal.x*tile, goal.y*tile, tile, tile);

  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x*tile, player.y*tile, tile, tile);
}

canvas.addEventListener("click", e => {
  let rect = canvas.getBoundingClientRect();
  let x = Math.floor((e.clientX - rect.left) / (400/gridSize));
  let y = Math.floor((e.clientY - rect.top) / (400/gridSize));

  player.x = x;
  player.y = y;

  draw();

  if (player.x === goal.x && player.y === goal.y) {
    nextBtn.style.display = "block";
  }
});

nextBtn.onclick = () => {
  if (currentLevel + 1 < levels.length)
    startLevel(currentLevel + 1);
  else
    alert("All levels complete!");
};

// CUTSCENES
let cutsceneDiv = document.getElementById("cutscene");
let cutsceneText = document.getElementById("cutscene-text");
let cutsceneNext = document.getElementById("cutscene-next");
let cutsceneLines = [];
let cutIndex = 0;

function showCutscene(lines) {
  cutsceneLines = lines;
  cutIndex = 0;
  cutsceneDiv.classList.remove("hidden");
  cutsceneText.innerText = cutsceneLines[0];
}

cutsceneNext.onclick = () => {
  cutIndex++;
  if (cutIndex >= cutsceneLines.length)
    cutsceneDiv.classList.add("hidden");
  else
    cutsceneText.innerText = cutsceneLines[cutIndex];
};

loadData();
