import './style.css'

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("Could not get canvas context");
}

class Snake {
    length: number = 1;
    x: number = 0;
    y: number = 0;
    length: number = 3;
    

    draw() {

        for (let i = 0; i < this.length; i++) {
            ctx!.fillStyle = "black";
            ctx!.fillRect(this.x + i * 10, this.y, 10, 10);
        }

        ctx!.fillStyle = "black";
        ctx!.fillRect(this.x, this.y, 10, 10);

    }

    turn(direction: string) {

    }

    update() {

    }

}

const snake = new Snake();

document.addEventListener("keydown", (event) => {
    const key = event.key;

    if ([ "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight" ].includes(key)) {
        return snake.turn(key);
    }

    event.preventDefault();
    
});


function gameLoop() {

    ctx!.clearRect(0, 0, canvas.width, canvas.height);

    snake.update();
    snake.draw();
}


gameLoop();