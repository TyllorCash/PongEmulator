const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const paddleWidth = 10;
const paddleHeight = 80;

const player = {
  x: 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 6,
  score: 0
};

const computer = {
  x: canvas.width - paddleWidth - 10,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 4,
  score: 0
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 7,
  speed: 5,
  velocityX: 5,
  velocityY: 5
};

// Controls
const keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Draw functions
function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawText(text, x, y, color) {
  ctx.fillStyle = color;
  ctx.font = "32px monospace";
  ctx.fillText(text, x, y);
}

// Reset ball after score
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.velocityY = (Math.random() > 0.5 ? 1 : -1) * 4;
}

// Collision detection
function collision(b, p) {
  return (
    b.x - b.radius < p.x + p.width &&
    b.x + b.radius > p.x &&
    b.y - b.radius < p.y + p.height &&
    b.y + b.radius > p.y
  );
}

// Update game state
function update() {
  // Player movement
  if (keys["w"] && player.y > 0) {
    player.y -= player.speed;
  }
  if (keys["s"] && player.y < canvas.height - player.height) {
    player.y += player.speed;
  }

  // Computer AI
  const target = ball.y - (computer.height / 2);
  computer.y += (target - computer.y) * 0.092;

  // Ball movement
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Wall collision
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  // Paddle collision
  let currentPaddle = ball.x < canvas.width / 2 ? player : computer;

  if (collision(ball, currentPaddle)) {
    let collidePoint = ball.y - (currentPaddle.y + currentPaddle.height / 2);
    collidePoint /= currentPaddle.height / 2;

    const angleRad = collidePoint * Math.PI / 4;
    const direction = ball.x < canvas.width / 2 ? 1 : -1;

    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);
  }

  // Scoring
  if (ball.x - ball.radius < 0) {
    computer.score++;
    resetBall();
  }

  if (ball.x + ball.radius > canvas.width) {
    player.score++;
    resetBall();
  }
}

// Render game
function render() {
  drawRect(0, 0, canvas.width, canvas.height, "black");

  drawText(player.score, canvas.width / 4, 40, "#00ff00");
  drawText(computer.score, (canvas.width * 3) / 4, 40, "#00ff00");

  drawRect(player.x, player.y, player.width, player.height, "#00ff00");
  drawRect(computer.x, computer.y, computer.width, computer.height, "#00ff00");

  drawCircle(ball.x, ball.y, ball.radius, "#00ff00");
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

gameLoop();
