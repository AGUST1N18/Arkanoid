const body = document.querySelector('body');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const $sprite = document.querySelector('#sprite');
const $brick = document.querySelector('#brick');

canvas.width = 400;
canvas.height = 400;

const BRICK_STATUS = {
    ACTIVE: 1,
    DESTROYED: 0
};
const canvasStart = 100
const ballSize = 10;
const paddleHeight = 15;
const paddleWidth = 75;
const paddleY = canvas.height - paddleHeight - 5;
const paddleSpeed = 8;

const brickWidth = 32;
const brickHeight = 16;
const brickCountRows = 6;
const brickCountCols = 10;
const brickPadding = 0;
const brickOffsetTop = canvasStart + 40;
const brickOffsetLeft = (canvas.width - (brickCountCols * (brickWidth + brickPadding))) / 2;

let gameOver = false;
let paused = false;

let ballX = canvas.width / 2;
let ballY = canvas.height - 40;
let dxBall = 3;
let dyBall = -3;

let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

const bricks = [];



function createBricks() {
    for (let c = 0; c < brickCountCols; c++) {
        bricks[c] = [];

        for (let r = 0; r < brickCountRows; r++) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            const color = Math.floor(Math.random() * 10);

            bricks[c][r] = {
                x: brickX,
                y: brickY,
                status: BRICK_STATUS.ACTIVE,
                color
            };
        }
    }
}

function resetGame() {
    gameOver = false;
    paused = false;
    ballX = canvas.width / 2;
    ballY = canvas.height - 40;
    dxBall = 3;
    dyBall = -3;

    paddleX = (canvas.width - paddleWidth) / 2;
    createBricks();
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBall() {
    ctx.drawImage($sprite, 50, 98, 5, 5, ballX + 6, ballY + 6, ballSize, ballSize);
    ctx.drawImage($sprite, 46, 94, 5, 5, ballX, ballY, ballSize, ballSize);
}

function drawPaddle() {
    ctx.drawImage($sprite, 29, 174, 52, 12, paddleX, paddleY, paddleWidth, paddleHeight);
}

function drawBricks() {
    for (let r = 0; r < brickCountRows; r++) {
        for (let c = 0; c < brickCountCols; c++) {
            const currentBrick = bricks[c][r];

            if (currentBrick.status === BRICK_STATUS.DESTROYED) {
                continue;
            }

            ctx.drawImage(
                $brick,
                currentBrick.color * 32,
                0,
                32,
                16,
                currentBrick.x,
                currentBrick.y,
                brickWidth,
                brickHeight
            );
        }
    }
}

function ballMovement() {
    if (ballX > canvas.width - ballSize || ballX < ballSize) {
        dxBall = -dxBall;
    }

    if (ballY <= canvasStart) {
        dyBall = -dyBall;
    }

    if (
        ballY + ballSize >= paddleY &&
        ballX + ballSize / 2 >= paddleX &&
        ballX + ballSize / 2 <= paddleX + paddleWidth
    ) {
        dyBall = -dyBall;
    }

    if (ballY + ballSize >= canvas.height - ballSize) {
        gameOver = true;
        drawGameOverMessage();
    }

    ballX += dxBall;
    ballY += dyBall;
}

function paddleMovement() {
    if (rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += paddleSpeed;
    }

    if (leftPressed && paddleX > 0) {
        paddleX -= paddleSpeed;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickCountCols; c++) {
        for (let r = 0; r < brickCountRows; r++) {
            const currentBrick = bricks[c][r];

            if (currentBrick.status !== BRICK_STATUS.ACTIVE) {
                continue;
            }
            const ballRight = ballX + ballSize;
            const ballBottom = ballY + ballSize;
            const brickRight = currentBrick.x + brickWidth;
            const brickBottom = currentBrick.y + brickHeight;

            const hitBrick =
                ballX < brickRight &&
                ballRight > currentBrick.x &&
                ballY < brickBottom &&
                ballBottom > currentBrick.y;

            if (!hitBrick) {
                continue;
            }

            const hitFromSide =
                ballRight - dxBall <= currentBrick.x ||
                ballX - dxBall >= brickRight;

            if (hitFromSide) {
                dxBall = -dxBall;
            } else {
                dyBall = -dyBall;
            } 

            currentBrick.status = BRICK_STATUS.DESTROYED;
            return;
        }
    }
}

function startGame() {
    resetGame();
    draw();
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function keyDownHandler(event) {
        if (event.key === 'Right' || event.key === 'ArrowRight') {
            rightPressed = true;
        } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
            leftPressed = true;
        }

        if (event.key === 'Escape' && !gameOver) {
            paused = !paused;

            if (!paused) {
                draw();
            }
        }

        if (event.key === 'Enter' && (gameOver || paused)) {
            startGame();
        }
    }

    function keyUpHandler(event) {
        if (event.key === 'Right' || event.key === 'ArrowRight') {
            rightPressed = false;
        } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
            leftPressed = false;
        }
    }
}

function drawPauseMessage() {
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#08f808';
    ctx.textAlign = 'center';
    
    ctx.fillText('Presiona Esc para continuar', canvas.width / 2, canvas.height / 2 + 150);
    ctx.fillText('Presiona Enter para reiniciar', canvas.width / 2, canvas.height / 2 + 170);
    ctx.drawImage($sprite, 325, 24, 132, 14, (canvas.width / 2) - 100, (canvas.height + canvasStart) / 2 + 30 , 200, 50);

}

function drawGameOverMessage() {
    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#08f808';
    ctx.textAlign = 'center';
    ctx.fillText('Presiona Enter para reiniciar', canvas.width / 2, canvas.height / 2 + 150);
    ctx.drawImage($sprite, 325, 2, 144, 18, (canvas.width / 2) - 100, (canvas.height + canvasStart) / 2 + 30 , 200, 50);
}

function drawHeader() {
    ctx.beginPath();
    ctx.rect(0, canvasStart, canvas.width, 5);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();


    ctx.drawImage($sprite, 4, 5, 214, 49, 50, 10, 300, 80);
}


function draw() {
    cleanCanvas();
    drawHeader();
    drawBall();
    drawPaddle();
    drawBricks();

    if (paused) {
        drawPauseMessage();
        return;
    }

    if (gameOver) {
        drawGameOverMessage();
        return;
    }

    collisionDetection();
    ballMovement();
    paddleMovement();

    window.requestAnimationFrame(draw);
}

resetGame();
draw();
initEvents();