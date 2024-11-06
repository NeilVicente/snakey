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

    // event.preventDefault();
    
});