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
  length: number = 3;
  lastDirection: string = "ArrowRight";
  currentDirection: string = "ArrowRight";
  turns: [number, number][] = [];

  draw() {
    let remainingBodyPart = this.length - 1;
    ctx!.fillRect(this.x, this.y, 10, 10);
      // add border
      ctx!.strokeStyle = "black";
      ctx!.strokeRect(this.x, this.y, 10, 10);
    for (let i = 1; i <= this.length; i++) {
      // add body
      ctx!.fillStyle = "gray"this.x
      let bodySegmentX: number = this.x;
      let bodySegmentY: number = this.y;

      // 0

      switch (this.currentDirection) {
        case "ArrowDown":
          bodySegmentY = this.y + i * 10;
          break;
        case "ArrowUp":
          bodySegmentY = this.y - i * 10;
          break;
        case "ArrowLeft":
          bodySegmentX = this.x - i * 10;
          break;
        case "ArrowRight":
          bodySegmentX = this.x + i * 10;
          break;
      }

      console.log("prior to turn", this.x, this.y);
      if (this.currentDirection !== this.lastDirection) {
        console.log("after the turn", this.x, this.y);
      }

      this.turns.forEach((turn) => {
        if (this.y === turn[1] || this.x === turn[0]) {
            if (remainingBodyPart > 1) {
                // make the rest of the body go through this corner
                bodySegmentX = turn[0];
                bodySegmentY = turn[1];
              }
        }
      });

      ctx!.fillRect(bodySegmentX, bodySegmentY, 10, 10);
      // add border
      ctx!.strokeStyle = "black";
      ctx!.strokeRect(bodySegmentX, bodySegmentY, 10, 10);
      if (remainingBodyPart > 0) {
        remainingBodyPart--;
      }
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
