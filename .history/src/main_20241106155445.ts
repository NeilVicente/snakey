import "./style.css";

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const score = document.getElementById("score") as HTMLDivElement;
const highScore = document.getElementById("highScore") as HTMLDivElement;
let counter = 0;
let gameLevel = 4;
let paused = false;
let gameOver = false;
let blockSize = 10;

if (!ctx) {
  throw new Error("Could not get canvas context");
}

const generateRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * max);
};

class Food {
  x: number = Math.floor(Math.random() * 40) * blockSize;
  y: number = Math.floor(Math.random() * 40) * blockSize;

  draw() {
    ctx!.fillStyle = "red";
    ctx!.fillRect(this.x, this.y, blockSize, blockSize);
  }

  generate() {
    this.x = Math.abs(Math.floor(Math.random() * 40)) * blockSize;
    this.y = Math.abs(Math.floor(Math.random() * 40)) * blockSize;

    if (game.checkCollision([this.x, this.y])) {
      this.generate();
    }
  }
}

class Game {
  score: number = 0;
  width: number = canvas.width;
  height: number = canvas.height;
  highScore: number = 0;

  constructor() {
    if (localStorage.getItem("highScore")) {
      this.highScore = Number(localStorage.getItem("highScore"));
    }
  }

  end = () => {
    ctx!.fillStyle = "black";
    const overlayWidth = 300;
    const overlayHeight = 250;
    ctx!.strokeRect(
      (canvas.width - overlayWidth) / 2,
      (canvas.height - overlayHeight) / 2,
      overlayWidth,
      overlayHeight
    );

    ctx!.fillStyle = "wheat";

    ctx!.fillRect(
      (canvas.width - overlayWidth) / 2,
      (canvas.height - overlayHeight) / 2,
      overlayWidth,
      overlayHeight
    );

    ctx!.fillStyle = "black";
    ctx!.font = "30px Arial";
    ctx!.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2 - 50);

    ctx!.fillStyle = "black";
    ctx!.fillRect(canvas.width / 2 - 50, canvas.height / 2, 100, 50);
    ctx!.fillStyle = "wheat";
    ctx!.fillText("Play Again", canvas.width / 2 - 60, canvas.height / 2 + 30);


    gameOver = true;
  };

  displayScore = () => {
    score.innerText = `${this.score}`;
    highScore.innerText = `${this.highScore}`;
  };

  increaseScore = () => {
    this.score += 1;

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore.toString());
    }
    this.displayScore();
  };

  checkCollision = (coordinates: number[], paths?: number[][]): boolean => {
    const pathsToCheck = paths || snake.paths;
    return pathsToCheck.some((path) => {
      return path[0] == coordinates[0] && path[1] === coordinates[1];
    });
  };
}

const game = new Game();

class Snake {
  x: number = Math.abs(Math.floor(Math.random() * 40)) * blockSize;
  y: number = Math.abs(Math.floor(Math.random() * 40)) * blockSize;
  length: number = 20;
  lastDirection: string = "ArrowRight";
  currentDirection: string = "ArrowRight";
  paths: [number, number][] = [];

  constructor() {
    // get coordinates of snake head
    this.paths.push([this.x, this.y]);
    // get coordinates of all body segments
    for (let i = 0; i < this.length; i++) {
      let coordinateX: number = this.x;
      let coordinateY: number = this.y;
      switch (this.currentDirection) {
        case "ArrowDown":
          coordinateY = this.y - i * blockSize;
          break;
        case "ArrowUp":
          coordinateY = this.y + i * blockSize;
          break;
        case "ArrowLeft":
          coordinateX = this.x + i * blockSize;
          break;
        case "ArrowRight":
          coordinateX = this.x - i * blockSize;
          break;
      }
      this.paths.push([coordinateX, coordinateY]);
    }
  }

  update() {
    let [headX, headY] = this.paths[0];

    switch (this.currentDirection) {
      case "ArrowRight":
        headX = headX >= canvas.width ? 0 : headX + blockSize;
        break;
      case "ArrowLeft":
        headX = headX < 0 ? canvas.width - blockSize : headX - blockSize;
        break;
      case "ArrowUp":
        headY = headY < 0 ? canvas.height - blockSize : headY - blockSize;
        break;
      case "ArrowDown":
        headY = headY >= canvas.height ? 0 : headY + blockSize;
        break;
      default:
        break;
    }

    const bodyCoordinates = this.paths.slice(0, this.length);

    if (game.checkCollision([headX, headY], bodyCoordinates)) {
      game.end();
      return false;
    }

    if (headX === food.x && headY === food.y) {
      this.eat();
    } else {
      this.paths.pop();
    }

    this.paths.unshift([headX, headY]);

    return true;
  }

  draw() {
    this.paths.forEach((path) => {
      ctx!.fillStyle = "gray";
      ctx!.fillRect(path[0], path[1], blockSize, blockSize);
      ctx!.strokeStyle = "black";
      ctx!.strokeRect(path[0], path[1], blockSize, blockSize);
    });
  }

  turn(direction: string) {
    this.lastDirection = this.currentDirection;
    this.currentDirection = direction;
  }

  eat() {
    this.length += 1;
    game.increaseScore();
    food.generate();
  }
}

const food = new Food();
const snake = new Snake();

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    const verticalDirection = ["ArrowUp", "ArrowDown"];
    const horizontalDirection = ["ArrowLeft", "ArrowRight"];

    if (
      verticalDirection.includes(snake.currentDirection) &&
      verticalDirection.includes(key)
    ) {
      return;
    }

    if (
      horizontalDirection.includes(snake.currentDirection) &&
      horizontalDirection.includes(key)
    ) {
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
  if (gameOver) {
    return;
  }

  if (counter < 300 / gameLevel) {
    counter += 10;
    return requestAnimationFrame(gameLoop);
  }

  if (snake.update()) {
    ctx!.clearRect(0, 0, canvas.width, canvas.height);
    counter = 0;
    snake.draw();
    game.displayScore();
    food.draw();
  }

  if (paused) {
    return;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
