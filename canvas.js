// Get canvas element and set its dimensions
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let canvasWidth, canvasHeight;
let userPlayers = [];
let computerPlayers = [];
var sharedMsg = document.getElementById("sharedMsg");

// Set canvas dimensions and update on window resize
function setCanvasDimensions() {
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight - 70;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
}
setCanvasDimensions();
window.addEventListener("resize", setCanvasDimensions);

// Get input elements
let rocks = document.getElementById("rocks");
let papers = document.getElementById("papers");
let scissors = document.getElementById("scissors");
let submitBtn = document.getElementById("submitPlayers");

// Get span elements for displaying range values
let rocksValueSpan = document.getElementById("rocksValue");
let papersValueSpan = document.getElementById("papersValue");
let scissorsValueSpan = document.getElementById("scissorsValue");

// Function to update range value display
function updateRangeDisplay(input, span) {
  span.textContent = input.value;
}

// Event listeners for input elements
function addInputListeners() {
  rocks.addEventListener("input", () =>
    updateRangeDisplay(rocks, rocksValueSpan)
  );
  papers.addEventListener("input", () =>
    updateRangeDisplay(papers, papersValueSpan)
  );
  scissors.addEventListener("input", () =>
    updateRangeDisplay(scissors, scissorsValueSpan)
  );
}
addInputListeners();

// Player object constructor
class Player {
  constructor(side, type, id, x, y) {
    this.side = side;
    this.type = type;
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = 60;
    this.velocity = {
      x: Math.random() * 2 - 1,
      y: Math.random() * 2 - 1,
    };
    this.label = side + id;
    this.targetCell = null;
    this.angle = Math.random() * Math.PI * 2;
  }

  draw() {
    ctx.fillText(this.label, this.x, this.y - 30);
    ctx.fillText(
      this.type === "rock" ? "🗿" : this.type === "paper" ? "🗞️" : "✂️",
      this.x,
      this.y
    );
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.x <= 0 || this.x >= canvasWidth) {
      this.velocity.x *= -1;
    }
    if (this.y <= 30 || this.y >= canvasHeight) {
      this.velocity.y *= -1;
    }
  }

  checkCollision(player) {
    if (this.side !== player.side) {
      let dx = this.x - player.x;
      let dy = this.y - player.y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      return distance < this.size / 2 + player.size / 2;
    }
    return false;
  }
}

// Define a map to store player positions
let playerPositions = new Map();

// Function to remove collided players
function removeCollidedPlayers() {
  for (let i = 0; i < userPlayers.length; i++) {
    for (let j = 0; j < computerPlayers.length; j++) {
      if (userPlayers[i].checkCollision(computerPlayers[j])) {
        let userType = userPlayers[i].type;
        let computerType = computerPlayers[j].type;
        if (
          (userType === "rock" && computerType === "scissors") ||
          (userType === "paper" && computerType === "rock") ||
          (userType === "scissors" && computerType === "paper")
        ) {
          computerPlayers.splice(j, 1);
          updateScoreboard("C");
        } else if (
          (computerType === "rock" && userType === "scissors") ||
          (computerType === "paper" && userType === "rock") ||
          (computerType === "scissors" && userType === "paper")
        ) {
          userPlayers.splice(i, 1);
          updateScoreboard("U");
        }
        break;
      }
    }
  }
}

// Function to draw middle divider line
function drawMiddleDivider() {
  let middleX = canvasWidth / 2;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(middleX, 0);
  ctx.lineTo(middleX, canvasHeight);
  ctx.stroke();
}

// Function to create initial player objects for each side , U for user and C for computer , with the given counts of each shape type
function createInitialPlayers(counts, side) {
  let players = [];
  let id = 1;
  for (let type in counts) {
    for (let i = 0; i < counts[type]; i++) {
      let x =
        Math.random() * (canvasWidth / 2) +
        (side === "U" ? 0 : canvasWidth / 2);
      let y = Math.random() * (canvasHeight - 30) + 30;
      let player = new Player(side, type, id, x, Math.random() * canvasHeight);
      players.push(player);
      playerPositions.set(side + id, { x: player.x, y: player.y });
      id++;
    }
  }
  return players;
}

// Scoreboard variables
let userCount = 0;
let computerCount = 0;

// Function to draw scoreboard
function drawScoreboard() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.textAlign = "center";
  ctx.fillText("User: " + userCount, canvasWidth / 4, 20);
  ctx.fillText("Computer: " + computerCount, (canvasWidth / 4) * 3, 20);
}

// Function to update scoreboard
function updateScoreboard(side) {
  if (side === "U") {
    userCount = userPlayers.length;
  } else if (side === "C") {
    computerCount = computerPlayers.length;
  }
}

// Event listener for submit button
submitBtn.addEventListener("click", handleSubmit);

function handleSubmit() {
  if (submitBtn.innerHTML === "Submit") {
    let userCounts = {
      rock: parseInt(rocks.value),
      paper: parseInt(papers.value),
      scissors: parseInt(scissors.value),
    };

    startGame();

    userPlayers = createInitialPlayers(userCounts, "U");
    let computerCounts = generateRandomCounts(userPlayers);
    computerPlayers = createInitialPlayers(computerCounts, "C");
    userCount = userPlayers.length;
    computerCount = computerPlayers.length;
   
    animate();

    submitBtn.innerHTML = "Restart";
  } else {
    location.reload();
  }
}

// Function to make grid
function drawGrid() {
  ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
  ctx.lineWidth = 1;
  ctx.font = "12px Arial";
  ctx.fillStyle = "black";

  const fixedCellCount = 16;
  const rowCount = Math.ceil(Math.sqrt(fixedCellCount));
  const columnCount = Math.ceil(fixedCellCount / rowCount);
  const cellWidth = canvasWidth / columnCount;
  const cellHeight = canvasHeight / rowCount;
  const cellSize = Math.min(cellWidth, cellHeight) * 0.8;

  for (let x = 0; x <= canvasWidth; x += cellSize) {
    const columnNumber = Math.floor(x / cellSize) + 1;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
    ctx.fillText("C" + columnNumber, x + 50, 10);
  }

  for (let y = 0; y <= canvasHeight; y += cellSize) {
    const rowNumber = Math.floor(y / cellSize) + 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
    ctx.fillText("R" + rowNumber, 10, y + 50);
  }
}

// Function to generate random count for shapes
function generateRandomCounts(userPlayers) {
  let totalCount = userPlayers.length;
  let counts = { rock: 0, paper: 0, scissors: 0 };

  while (totalCount > 0) {
    let shape =
      Math.random() < 0.33
        ? "rock"
        : Math.random() < 0.5
        ? "paper"
        : "scissors";
    if (counts[shape] < 15) {
      counts[shape]++;
      totalCount--;
    }
  }

  return counts;
}

// Animation loop
let isGameStarted = false;

function startGame() {
  isGameStarted = true;
}

function animate() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  drawMiddleDivider();
  drawScoreboard();
  drawGrid();
  drawThickRedDots();

  if (!isCircling && userPlayers) {
    userPlayers.forEach((player) => {
      player.update();
      player.draw();
    });
  } else if (isCircling && userPlayers) {
    userPlayers.forEach((player) => {
      player.update();
      if (player.targetCell) {
        updatePlayerPositionForCircle(player, player.targetCell);
      }
      player.draw();
    });
  }

  if (computerPlayers) {
    computerPlayers.forEach((player) => {
      player.update();
      player.draw();
    });
  }

  if (isGameStarted) {
    gameOver();
  }

  removeCollidedPlayers();
  requestAnimationFrame(animate);
}

// map to store cell center points
let cellCenterPoints = new Map();

// Function to calculate grid cells, their center points, and draw red dots
function calculateGridCells() {
  const rowCount = 5;
  const columnCount = 10;

  // Calculate cell size based on canvas dimensions and number of rows/columns
  const cellWidth = canvasWidth / columnCount;
  const cellHeight = canvasHeight / rowCount;
  const cellSize = Math.min(cellWidth, cellHeight);

  // Clear any previous entries in the cellCenterPoints map
  cellCenterPoints.clear();

  for (let row = 1; row <= rowCount; row++) {
    for (let col = 1; col <= columnCount; col++) {
      const centerX = (col - 0.5) * cellSize;
      const centerY = (row - 0.5) * cellSize;
      const cellId = "R" + row + "C" + col;

      // Check if a cell with the same ID already exists
      if (!cellCenterPoints.has(cellId)) {
        // If not, add the cell center point to the map
        cellCenterPoints.set(cellId, {
          x: centerX,
          y: centerY,
          size: cellSize,
        });
      } else {
        // If a cell with the same ID already exists, slightly adjust the position of the label
        const adjustedCenterX = centerX + cellSize / 4;
        const adjustedCenterY = centerY + cellSize / 4;
        cellCenterPoints.set(cellId, {
          x: adjustedCenterX,
          y: adjustedCenterY,
          size: cellSize,
        });
      }
    }
  }
}

calculateGridCells();

// Function to draw thick red dots on cell center points
function drawThickRedDots() {
  const dotRadius = 2;
  const dotThickness = 1;

  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";
  ctx.lineWidth = dotThickness;

  for (const [cellId, { x, y, size }] of cellCenterPoints) {
    ctx.beginPath();
    ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // lable position for each cell
    ctx.font = "12px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText(cellId, x, y + size / 4); // Position label at the top of the cell
  }
}

// Function to update player position for circling motion within the cell
function updatePlayerPositionForCircle(player, centerPoint) {
  const circleRadius = 50;
  const angularSpeed = 0.03;

  player.x = centerPoint.x + circleRadius * Math.cos(player.angle);
  player.y = centerPoint.y + circleRadius * Math.sin(player.angle);
  player.angle += angularSpeed;
}

let isCircling = false;

function movePlayerToCenterPoint(playerName, cellId) {
  //check if user entered both player name and cell id  else display error message to enter both values
  if (!playerName || !cellId) {
    console.log("Please enter both player name and cell ID");
    sharedMsg.innerText = "Please enter both player name and cell ID";
    return;
  }
  playerName = playerName.toUpperCase();
  cellId = cellId.toUpperCase();

  if (!playerPositions.has(playerName)) {
    console.log("Invalid player name");
    sharedMsg.innerText = "Invalid player name";
    return;
  }

  if (!cellCenterPoints.has(cellId)) {
    console.log("Invalid cell ID");
    sharedMsg.innerText = "Invalid cell ID";
    return;
  }

  const centerPoint = cellCenterPoints.get(cellId);
  const player = userPlayers.find((player) => player.label === playerName);

  if (player && centerPoint) {
    const deltaX = centerPoint.x - player.x;
    const deltaY = centerPoint.y - player.y;
    const targetAngle = Math.atan2(deltaY, deltaX);
    const initialAngle = player.angle;
    const angularDistance = targetAngle - initialAngle;
    const duration = 4000;
    const startTime = performance.now();

    function animateRotation(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentAngle = initialAngle + angularDistance * progress;

      updatePlayerPositionForCircle(player, centerPoint);
      if (progress < 1) {
        requestAnimationFrame(animateRotation);
      } else {
        player.angle = targetAngle;
      }
    }

    requestAnimationFrame(animateRotation);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("messageLogged", function (event) {
    let [playerName, cellId] = event.detail.message.split(", ");
    setTimeout(() => {
      movePlayerToCenterPoint(playerName, cellId);
    }, 0);
  });
});

// Function to check if all players across both user and computer have the same type
function areAllPlayersOfSameType(userPlayers, computerPlayers) {
  const userTypes = new Set(userPlayers.map((player) => player.type));
  const computerTypes = new Set(computerPlayers.map((player) => player.type));

  // If there's more than one type in either set, return false
  if (userTypes.size !== 1 || computerTypes.size !== 1) return false;
  // Checking if both sets contain the same type
  const userType = userPlayers[0].type;
  const computerType = computerPlayers[0].type;
  return userType === computerType;
}

// Function to handle game over
function gameOver() {
  const bothUserAndComputerHavePlayers =
    userPlayers.length > 0 && computerPlayers.length > 0;
  const allSameType = areAllPlayersOfSameType(userPlayers, computerPlayers);

  if (bothUserAndComputerHavePlayers) {
    if (allSameType) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      if (userPlayers.length > computerPlayers.length) {
        ctx.fillText(`player wins!`, canvasWidth / 2, canvasHeight / 2);
      } else if (userPlayers.length < computerPlayers.length) {
        ctx.fillText(`Computer wins!`, canvasWidth / 2, canvasHeight / 2);
      } else {
        ctx.fillText(` It's a draw!`, canvasWidth / 2, canvasHeight / 2);
      }
      submitBtn.innerHTML = "Restart";
      cancelAnimationFrame(animationFrame);
      return;
    }
  } else {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.font = "30px Arial";
    ctx.textAlign = "center";

    if (allSameType) {
      const winner =
        userPlayers.length > computerPlayers.length ? "User" : "Computer";
      ctx.fillText(`${winner} wins!`, canvasWidth / 2, canvasHeight / 2);
    } else {
      const winner = userPlayers.length === 0 ? "Computer" : "User";
      ctx.fillText(`${winner} wins!`, canvasWidth / 2, canvasHeight / 2);
    }

    submitBtn.innerHTML = "Restart";
    // Stop the animation
    cancelAnimationFrame(animationFrame);
  }
}

animate();