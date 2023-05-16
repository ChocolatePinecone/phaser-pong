import Phaser from 'phaser'

// Resolution setting for the game
const resolution = {
    width: 1024,
    height: 800
};

// Configuration for phaser
const config = {
    type: Phaser.AUTO,
    width: resolution.width,
    height:  resolution.height,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade'
    },
};

// Game constants
const paddleDistFromSides = 100;
const paddleSpeed = 400;
const scoreMarginFromCenter = 20;

// Game variables
let paddles, player1Paddle, player2Paddle;
let upButton, downButton, wButton, sButton;
let ball;
let scoreTextLeft, scoreTextRight;
let scoreLeft = 0, scoreRight = 0;


// Initialize the game with the defined configuration
const game = new Phaser.Game(config);

// Load all necessary resources before game starts
function preload () {
    this.load.image('dotted-line', 'assets/dotted-line.png');
    this.load.image('paddle', 'assets/paddle.png');
    this.load.image('ball', 'assets/ball.png');

    upButton = this.input.keyboard.addKey('UP');
    downButton = this.input.keyboard.addKey('DOWN');
    wButton = this.input.keyboard.addKey('W');
    sButton = this.input.keyboard.addKey('S');

}

// Create game objects at start of game
function create () {
    this.add.image(resolution.width * 0.5, resolution.height * 0.5, 'dotted-line');

    paddles = this.physics.add.group();
    player1Paddle = paddles.create(paddleDistFromSides, resolution.height * 0.5, 'paddle');
    player2Paddle = paddles.create(resolution.width - paddleDistFromSides, resolution.height * 0.5, 'paddle');
    player1Paddle.setCollideWorldBounds(true);
    player2Paddle.setCollideWorldBounds(true);
    player1Paddle.body.immovable = true;
    player2Paddle.body.immovable = true;

    ball = this.physics.add.sprite(resolution.width * 0.5, resolution.height * 0.5, 'ball');
    ball.setCollideWorldBounds(true);
    ball.setBounce(1, 1);
    ball.body.onWorldBounds = true;
    ball.body.world.on('worldbounds', ballWallCollision);
    this.physics.add.collider(ball, paddles, ballPaddleCollision);

    launchBall();

    scoreTextLeft = this.add.text(
        resolution.width * 0.5 - scoreMarginFromCenter,
        resolution.height * 0.5,
        "0",
        { font: "65px Arial", fill: "#878787" });
    scoreTextLeft.setOrigin(1, 0.5);
    scoreTextRight = this.add.text(
        resolution.width * 0.5 + scoreMarginFromCenter,
        resolution.height * 0.5,
        "0",
        { font: "65px Arial", fill: "#878787" });
    scoreTextRight.setOrigin(0, 0.5);

}

// Game logic while running the game
function update () {
    updatePlayerControls();
}

function updatePlayerControls () {
    // Player 1 controls
    if (wButton.isDown)
    {
        // Player 1 going up
        player1Paddle.setVelocityY(-paddleSpeed);
    }
    else if (sButton.isDown) {
        // Player 1 going down
        player1Paddle.setVelocityY(paddleSpeed);
    }
    else {
        // Player 1 stopping
        player1Paddle.setVelocityY(0);
    }

    // Player 2 controls
    if (upButton.isDown)
    {
        // Player 2 going up
        player2Paddle.setVelocityY(-paddleSpeed);
    }
    else if (downButton.isDown) {
        // Player 2 going down
        player2Paddle.setVelocityY(paddleSpeed);
    }
    else {
        // Player 2 stopping
        player2Paddle.setVelocityY(0);
    }
}

function launchBall () {
    let randomVelocity = {x:0, y:0};
    randomVelocity = Phaser.Math.RandomXY(randomVelocity, 200);
    randomVelocity.x = (randomVelocity.x < 0) ? -200 : 200;

    ball.setVelocity(randomVelocity.x, randomVelocity.y);
}

function resetBall () {
    ball.setPosition(resolution.width * 0.5, resolution.height * 0.5);

    launchBall();
}

function ballWallCollision (ball, up, down, left, right) {
    if(left || right) {
        if(left) {
            scoreRight += 1;
            scoreTextRight.setText(scoreRight);
        }
        else {
            scoreLeft += 1;
            scoreTextLeft.setText(scoreLeft);
        }
        resetBall();
    }
}

function ballPaddleCollision (ballRef, paddleRef) {
    let yDiff = ballRef.y - paddleRef.y;

    ballRef.body.velocity.y += yDiff * 5;
}
