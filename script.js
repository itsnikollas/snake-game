const board = document.getElementById("board");
const cells = [];

for (let i= 0; i < 20; i++) {
    for (let j = 0; j < 20; j++) {
        const cell = document.createElement("div");
        board.appendChild(cell);
        cells.push(cell);
    }
}

const snake = [
    { x: 10, y: 10 }
];

let direction = { x: 1, y: 0 };
const initialPosition = { x: 10, y: 10 };
const initialDirection = { x: 1, y: 0 };

let canChangeDirection = true;

function resetSnake() {
    snake.splice(0, snake.length);
    snake.push({ ...initialPosition });
    direction = { ...initialDirection };
}

const headIndex = snake[0].y * 20 + snake[0].x;
cells[headIndex].classList.add("snake");
snake[0].x += direction.x;

function drawSnake() {
    cells.forEach(cell => {
        cell.classList.remove("snake", "snake-head");
    });

    snake.forEach((segment, i) => {
        const index = segment.y * 20 + segment.x;

        if (cells[index]) {
            cells[index].classList.add("snake");

            if (i === 0) {
                cells[index].classList.add("snake-head");
            }
        }
    });
}

let gameOver = false;
let paused = false;
const gameMessage = document.getElementById("game-message");

function resetGameState() {
    gameOver = false;
    paused = false;
    canChangeDirection = true;
    gameMessage.textContent = "";
}

function restartGame() {
    cells.forEach(cell => {
        cell.style.backgroundColor = "";
    });

    resetSnake();
    resetScore();
    resetFood();
    resetGameState();
    drawSnake();
    drawFood();
}

function checkCollision() {
    for (let i = 1; i < snake.length; i++) {
        if (
            snake[0].x === snake[i].x &&
            snake[0].y === snake[i].y
        ) {
            gameOver = true;
            paused = false;
            gameMessage.textContent = "Fim de jogo!";
        }
    }
}

drawSnake();

setInterval(() => {
    if (gameOver) return;
    if (paused) return;

    const tail = { ...snake[snake.length - 1] };

    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }

    const nextX = snake[0].x + direction.x;
    const nextY = snake[0].y + direction.y;

    if (nextX < 0 || nextX >= 20 || nextY < 0 || nextY >= 20) {
        gameOver = true;
        paused = false;
        gameMessage.textContent = "Fim de jogo!";
        return;
    }

    snake[0].x = nextX;
    snake[0].y = nextY;

    canChangeDirection = true;

    drawSnake();
    checkCollision();
    checkFood(tail);
}, 200);

document.addEventListener("keydown", (event) => {
    if (gameOver) return;

    if (event.key.toLowerCase() === "p") {
        paused = !paused;
        gameMessage.textContent = paused ? "Jogo pausado" : "";
        return;
    }

    if (paused) return;
    if (!event.key.startsWith("Arrow")) return;
    event.preventDefault();
    if (!canChangeDirection) return;

    if (event.key === "ArrowUp" && direction.y !== 1) {
        direction = { x: 0, y: -1 };
        canChangeDirection = false;
    } else if (event.key === "ArrowDown" && direction.y !== -1) {
        direction = { x: 0, y: 1 };
        canChangeDirection = false;
    } else if (event.key === "ArrowLeft" && direction.x !== 1) {
        direction = { x: -1, y: 0 };
        canChangeDirection = false;
    } else if (event.key === "ArrowRight" && direction.x !== -1) {
        direction = { x: 1, y: 0 };
        canChangeDirection = false;
    }
});

function randomPosition() {
    return Math.floor(Math.random() * 20);
}

let score = 0;
const scoreDisplay = document.querySelector("p");

function resetScore() {
    score = 0;
    scoreDisplay.textContent = `Pontuação: ${score}`;
}

const food = {
    x: randomPosition(),
    y: randomPosition()
};

while (isSnakeAt(food.x, food.y)) {
    food.x = randomPosition();
    food.y = randomPosition();
}

function isSnakeAt (x, y) {
    return snake.some(segment =>
        segment.x === x && segment.y === y
    );
}

function drawFood() {
    const foodIndex = food.y * 20 + food.x;
    cells[foodIndex].style.backgroundColor = "red";
}

function resetFood() {
    if (snake.length >= 400) {
        return;
    }

    food.x = randomPosition();
    food.y = randomPosition();

    while (isSnakeAt(food.x, food.y)) {
        food.x = randomPosition();
        food.y = randomPosition();
    }
}

drawFood();

function checkFood(tail) {
    if (
        snake[0].x === food.x &&
        snake[0].y === food.y
    ) {
        const oldIndex = food.y * 20 + food.x;
        cells[oldIndex].style.backgroundColor = "";

        snake.push({ ...tail });

        score++;
        scoreDisplay.textContent = `Pontuação: ${score}`;

        if (snake.length >= 400) {
            gameOver = true;
            paused = false;
            gameMessage.textContent = `Você venceu! Pontuação: ${score}`;
            return;
        }

        do {
            food.x = randomPosition();
            food.y = randomPosition();
        } while (isSnakeAt(food.x, food.y));

        drawFood();
    }
}

const restartButton = document.getElementById("restart");

restartButton.addEventListener("click", () => {
    restartGame();
});
