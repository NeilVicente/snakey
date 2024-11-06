import "./style.css";

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
let counter = 0;
let gameLevel = 5;
let paused = false;

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
  length: number = 5;
  lastDirection: string = "ArrowRight";
  currentDirection: string = "ArrowRight";
  paths: [number, number][] = [[this.x, this.y]];

  draw() {
    let remainingBodyPart = this.length - 1;
    // draw the head
    ctx!.fillStyle = "blue";
    ctx!.fillRect(this.x, this.y, 10, 10);
    ctx!.strokeStyle = "black";
    ctx!.strokeRect(this.x, this.y, 10, 10);


    // draw body
    for (let i = 1; i <= this.length; i++) {
      
      let bodySegmentX: number = this.x;
      let bodySegmentY: number = this.y;
      
      switch (this.currentDirection) {
        case "ArrowDown":
          bodySegmentY = this.y - i * 10;
          break;
        case "ArrowUp":
          bodySegmentY = this.y + i * 10;
          break;
        case "ArrowLeft":
          bodySegmentX = this.x + i * 10;
          break;
        case "ArrowRight":
          bodySegmentX = this.x - i * 10;
          break;
      }

      this.paths.push([bodySegmentX, bodySegmentY]);

      ctx!.fillStyle = "gray";
      ctx!.fillRect(bodySegmentX, bodySegmentY, 10, 10);
      ctx!.strokeStyle = "black";
      ctx!.strokeRect(bodySegmentX, bodySegmentY, 10, 10);
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
    this.turns.push([this.x, this.y]);
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
    event.preventDefault();
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
