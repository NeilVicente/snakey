import "./style.css";

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
const score = document.getElementById("score") as HTMLDivElement;
const highScore = document.getElementById("highScore") as HTMLDivElement;
let counter = 0;
let gameLevel = 4;
let paused = false;
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


    if (!checkCollision([this.x, this.y])) {
      this.generate();
    }
  }
}

const checkCollision = (coordinates: number[]): boolean => {
    
  return !snake.paths.some((path) => {
    return path[0] == coordinates[0] && path[1] === coordinates[1];
  });
};

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
    ctx!.font = "20px Arial";
    ctx!.fillText(`Score:${this.score}`, 10, 20);
    paused = true;
  };

  displayScore = () => {
    score.innerText = `${this.score}`;
    highScore.innerText = `${this.highScore}`;
  }

  increaseScore = () => {
    this.score += 1;
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("highScore", this.highScore.toString());
    }
    this.displayScore();
  };
}

const game = new Game();

class Snake {
  x: number = Math.abs(Math.floor(Math.random() * 40)) * blockSize;
  y: number = Math.abs(Math.floor(Math.random() * 40)) * blockSize;
  length: number = blockSize;
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
    const [headX, headY] = this.paths[0];

    if (this.currentDirection === "ArrowRight") {
      if (headX >= canvas.width) {
        headX = 0;
      } else if (headX < 0) {
        headX = canvas.width - blockSize;
      }
      headX += blockSize;
    } else if (this.currentDirection === "ArrowLeft") {
      if (headX < 0) {
        headX = canvas.width - blockSize;
      }
      headX -= blockSize;
    } else if (this.currentDirection === "ArrowUp") {
      if (headY < 0) {
        headY = canvas.height - blockSize;
      }
      headY -= blockSize;
    } else if (this.currentDirection === "ArrowDown") {
      if (headY > canvas.height) {
        headY = 0;
      }
      headY += blockSize;
    }

    if (headX === food.x && headY === food.y) {
      this.eat();
    } else {
      this.paths.pop();
    }

    this.paths.unshift([headX, headCoordinates[1]]);

    if (checkCollision(headCoordinates)) {
      console.log(headCoordinates);
      console.log(this.paths);

      game.end();
    }
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
    food.generate();
    game.increaseScore();
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

    // ctx.fillStyle = "black";
    // ctx.fillRect(399, 0, 10, 10);
    // return;

  if (counter < 300 / gameLevel) {
    counter += 10;
    return requestAnimationFrame(gameLoop);
  }

  ctx!.clearRect(0, 0, canvas.width, canvas.height);
  counter = 0;

  snake.update();
  snake.draw();
  game.displayScore();
  food.draw();

  if (paused) {
    return;
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
