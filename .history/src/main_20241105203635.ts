import './style.css'

// main.ts
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

if (!ctx) {
    throw new Error("Could not get canvas context");
}

class Snake {
    length: number = 1;
    

    draw() {
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
    snake.update();
    snake.draw();
}


gameLoop();