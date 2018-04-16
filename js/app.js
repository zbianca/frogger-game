// Function to restrain a number (nr) to a range
function limit(min, max, nr) {
    const nr2 = Math.max(min, nr);
    return Math.min(nr2, max);
}

// Returns a random number between min (included) and max (excluded)
function randomBetween(min, max) {
    return Math.floor(min + Math.random() * (max - min));
}

class Entity {
    constructor(x, y, speed, sprite) {
        // Set initial location
        this.x = x;
        this.y = y;
        //Set speed
        this.speed = speed;
        this.sprite = sprite;
    }

    // Draw the entities on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Enemies our player must avoid
class Enemy extends Entity {
    constructor(x, y, speed, player) {
        super(x, y, speed, 'images/enemy-bug.png');
        this.player = player;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // Multiply any movement by the dt parameter
        // to ensure the game runs at the same speed for
        // all computers.
        this.x += this.speed * dt;
        this.checkCollisions();
    }

    checkCollisions() {
        let sameRow = false;
        let sameCol = false;
        //[62, 146, 228] // Enemy lanes, axis y
        //[60, 140, 220] // Player lanes, axis y
        if ((this.y === 62 && this.player.y === 60) || (this.y === 146 && this.player.y === 140) || (this.y === 228 && this.player.y === 220)) {
            sameRow = true;
        }
        //[0, 101, 202, 303, 404] // Player current x values in each tile
        // Add 75 pixels margin to each side // Enemy width
        if (this.player.x + 75 > this.x && this.player.x - 75 < this.x) {
            sameCol = true;
        }
        if (sameRow === true && sameCol === true) {
            player.die();
        }
    }

}

class Player extends Entity {
    constructor(x, y, speedX, speedY) {
        super(x, y, speedX, 'images/char-cat-girl.png');
        // Player has one velocity for each direction
        // because the tiles are rectangular.
        this.speedX = speedX;
        this.speedY = speedY;
        this.moveX = 0; // Multiplier to indicate direction of horizontal movements
        this.moveY = 0; // Multiplier to indicate direction of horizontal movements
        this.beginX = x; // Save initial coordinates for resetting
        this.beginY = y;
        // this.lives = 3; TODO: Life counter
        this.gameOver = false;
    }

    // Update the player's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {

        // Stop update while resetting game
        if (this.gameOver) {
            return;
        }

        // Multiply any movement by the dt parameter
        // to ensure the game runs at the same speed for
        // all computers.
        dt = dt || 1;
        if (this.moveX !== 0) {
            this.x += this.speedX * dt * this.moveX;
            this.x = limit(0, 404, this.x); // Restrain movement within canvas
        }
        if (this.moveY !== 0) {
            this.y += this.speedY * dt * this.moveY;
            this.y = limit(-20, 380, this.y); // Restrain movement within canvas
        }
        this.moveX = 0;
        this.moveY = 0;

        if (this.y === -20) { // Position y when reaching the water
            this.gameOver = true;
            // Timeout allows player to see their last movement
            window.setTimeout(this.victory.bind(this), 300);
        }
    }

    // Save direction of movement into a multiplier
    handleInput(dir) {
        switch (dir) {
            case 'left':
                this.moveX = -1;
                break;
            case 'up':
                this.moveY = -1;
                break;
            case 'right':
                this.moveX = 1;
                break;
            case 'down':
                this.moveY = 1;
                break;
        }
    }

    die() {
        this.x = this.beginX;
        this.y = this.beginY;
        // TODO: implement life counter
        // if (this.lives > 1) {
        //     this.lives -= 1;
        // } else {
        window.alert('Try again!');
        // }
    }

    victory() {
        window.alert('You win!');
        this.x = this.beginX;
        this.y = this.beginY;
        this.gameOver = false;
    }

}

// Place all enemy objects in an array called allEnemies
const allEnemies = [];
const player = new Player(202, 380, 101, 80);

// Instantiate random new enemies every 3 seconds
setInterval(function createEnemies() {
    const enemyYs = [62, 146, 228]; // Enemy lanes
    const randomY = enemyYs[randomBetween(0, 3)];
    const randomSpeed = randomBetween(50, 65);
    const enemy = new Enemy(-80, randomY, randomSpeed, player);
    allEnemies.push(enemy);
}, 3000);

// This listens for key presses and sends the keys
// to Player.handleInput() method.
document.addEventListener('keyup', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});