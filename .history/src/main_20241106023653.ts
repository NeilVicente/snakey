import "./style.css";

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
let counter = 0;
let gameLevel = 2;
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
  length: number = 10;
  lastDirection: string = "ArrowRight";
  currentDirection: string = "ArrowRight";
  paths: [number, number][] = [];

  constructor() {
    this.paths.push([this.x, this.y]);
    // get coordinates of body segments
    for (let i = 0; i < this.length; i++) {
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

    if (this.currentDirection === "ArrowRight") {
      if (headCoordinates[0] > canvas.width) {
        headCoordinates[0] = 0;
      } else if (headCoordinates[0] < 0) {
        headCoordinates[0] = canvas.width;
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

    this.paths.pop();
    this.paths.unshift([headCoordinates[0], headCoordinates[1]]);

    this.checkCollision(headCoordinates);

  }
    checkCollision() {
        
    }

  draw() {
    console.log("redrawing");
    this.paths.forEach((path) => {
      console.log(path);

      ctx!.fillStyle = "gray";
      ctx!.fillRect(path[0], path[1], 10, 10);
      ctx!.strokeStyle = "black";
      ctx!.strokeRect(path[0], path[1], 10, 10);
    });
  }

  turn(direction: string) {
    this.lastDirection = this.currentDirection;
    this.currentDirection = direction;
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
    const verticalDirection = ['ArrowUp', 'ArrowDown'];
    const horizontalDirection = ['ArrowLeft', 'ArrowRight'];

    if (verticalDirection.includes(snake.currentDirection) && verticalDirection.includes(key)) {
        return;
    }

    if (horizontalDirection.includes(snake.currentDirection) && horizontalDirection.includes(key)) {
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
  //   snake.update();
  //   snake.draw();
  //   return false;

  if (counter < 300 / gameLevel) {
    counter += 10;
    return requestAnimationFrame(gameLoop);
  }

  ctx!.clearRect(0, 0, canvas.width, canvas.height);
  counter = 0;

  snake.update();
  snake.draw();

  food.draw();

  if (paused) {
    return;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
