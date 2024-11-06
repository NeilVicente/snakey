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

}

class Snake {
  x: number = 0;
  y: number = 40;
  length: number = 5;
  lastDirection: string = "ArrowRight";
  currentDirection: string = "ArrowRight";
  paths: [number, number][] = [];

  constructor() {
    this.paths.push([this.x, this.y]);
    // draw the body
    for (let i = 1; i < this.length; i++) {
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
    }
    console.log(this.paths);
    
  }

  update() {
    const headCoordinates = this.paths[0];
    for (let i = 1; i < this.length; i++) {
      let bodySegmentX: number = headCoordinates[0];
      let bodySegmentY: number = headCoordinates[1];

      switch (this.currentDirection) {
        case "ArrowDown":
          bodySegmentY = headCoordinates[1] - i * 10;
          break;
        case "ArrowUp":
          bodySegmentY = headCoordinates[1] + i * 10;
          break;
        case "ArrowLeft":
          bodySegmentX = headCoordinates[0] + i * 10;
          break;
        case "ArrowRight":
          bodySegmentX = headCoordinates[0] - i * 10;
          break;
      }

      if (this.paths.length < this.length) {
        this.paths.push([bodySegmentX, bodySegmentY]);
      } else {
        this.paths.pop();
      }
    }


    if (this.currentDirection === "ArrowRight") {
        if (headCoordinates[0] > canvas.width) {
          headCoordinates[0] = 0;
        }
        headCoordinates[0] += 10;
      } else if (this.currentDirection === "ArrowLeft") {
        if (headCoordinates[0] < 0) {
          headCoordinates[0] = canvas.width;
        }
        headCoordinates[0] -= 10;
      } else if (this.currentDirection === "ArrowUp") {
        if (headCoordinates[1] < 0) {
          headCoordinates[1] = canvas.height;
        }
        headCoordinates[1] -= 10;
      } else if (this.currentDirection === "ArrowDown") {
        if (headCoordinates[1] > canvas.height) {
          headCoordinates[1] = 0;
        }
        headCoordinates[1] += 10;
      }

      this.paths.push([headCoordinates[0], headCoordinates[1]]);
      this.paths.pop();
  }

  draw() {
    
    this.paths.forEach((path) => {
        console.log(path[0], path[1]);
        
      ctx!.fillStyle = "gray";
      ctx!.fillRect(path[0], path[1], 10, 10);
      ctx!.strokeStyle = "black";
      ctx!.strokeRect(path[0], path[1], 10, 10);
    });
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

// gameLoop();
