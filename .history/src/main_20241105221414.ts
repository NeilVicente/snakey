import "./style.css";

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
let counter = 0;
let gameLevel = 5;
let paused = false;
let bodyPartCounter = 0;

if (!ctx) {
  throw new Error("Could not get canvas context");
}

class Food {
  x = Math.floor(Math.random() * 40) * 10;
  y = Math.floor(Math.random() * 40) * 10;

  draw() {
    ctx!.fillStyle = "red";
    ctx!.fillRect(this.x, this.y, 10, 10);
  }

  generate() {
    this.x = Math.floor(Math.random() * 40) * 10;
    this.y = Math.floor(Math.random() * 40) * 10;
  }

  update() {}
}

class Snake {
  x: number = 0;
  y: number = 40;
  length: number = 3;
  lastDirection: string = "ArrowUp";
  currentDirection: string = "ArrowUp";

  draw() {
    bodyPartCounter = 0;
    for (let i = 0; i < this.length; i++) {
      // add body
      ctx!.fillStyle = "gray";
      let bodySegmentX = this.x + i * 10;
      let bodySegmentY = this.y;

      if (["ArrowDown", "ArrowUp"].includes(this.currentDirection)) {
        bodySegmentX = this.x;
        bodySegmentY = this.y + i * 10;
      }

      if (["ArrowLeft", "ArrowRight"].includes(this.currentDirection)) {
        bodySegmentX = this.x;
        bodySegmentY = this.y + i * 10;
      }

      if (this.currentDirection !== this.lastDirection) {
        if (this.currentDirection === "ArrowDown") {
          bodySegmentY += 10;
          //   this.x -= 10;
        }
      }

      ctx!.fillRect(bodySegmentX, bodySegmentY, 10, 10);
      // add border
      ctx!.strokeStyle = "black";
      ctx!.strokeRect(bodySegmentX, bodySegmentY, 10, 10);
      bodyPartCounter++;
    }

    if (this.currentDirection === "ArrowRight") {
      if (this.x > canvas.width) {
        this.x = 0;
      }
      this.x += 10;
    } else if (this.currentDirection === "ArrowLeft") {
      if (this.x < 0) {
        this.x = canvas.width;
      }
      this.x -= 10;
    } else if (this.currentDirection === "ArrowUp") {
      if (this.y < 0) {
        this.y = canvas.height;
      }
      this.y -= 10;
    } else if (this.currentDirection === "ArrowDown") {
      if (this.y > canvas.height) {
        this.y = 0;
      }
      this.y += 10;
    }
  }

  turn(direction: string) {
    this.lastDirection = this.currentDirection;
    this.currentDirection = direction;
  }

  eat() {
    this.length++;
    food.generate();
  }

  update() {}
}

const food = new Food();
const snake = new Snake();

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    if (snake.currentDirection === "ArrowDown" && key === "ArrowUp") {
      return;
    }

    if (snake.currentDirection === "ArrowLeft" && key === "ArrowRight") {
      return;
    }

    if (snake.currentDirection === key) {
      return;
    }

    snake.turn(key);
  }

  if (key === " ") {
    paused = !paused;
    if (!paused) {
      gameLoop();
    }
  }

  // event.preventDefault();
});

function gameLoop() {
  // change speed depending on level

  if (counter < 400 / gameLevel) {
    counter += 10;
    return requestAnimationFrame(gameLoop);
  }

  ctx!.clearRect(0, 0, canvas.width, canvas.height);
  counter = 0;

  snake.update();
  snake.draw();

  food.update();
  food.draw();

  if (paused) {
    return;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();