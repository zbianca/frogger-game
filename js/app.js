class Entity {
    constructor(x, y, speed, sprite) {
        // Set initial location
        this.x = x;
        this.y = y;
        //Set speed
        this.speed = speed;
        this.sprite = sprite;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Enemies our player must avoid
class Enemy extends Entity {
    constructor(x, y, speed) {
        super(x, y, speed, 'images/enemy-bug.png');
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += this.speed * dt;
    }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends Entity  {
    constructor(x, y, speedX, speedY) {
        super(x, y, speedX, 'images/char-cat-girl.png');
        this.speedX = speedX;
        this.speedY = speedY;
        this.moveX = 0;
        this.moveY = 0;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        dt = dt || 1;
        if (this.moveX !== 0) {
            this.x += this.speedX * dt * this.moveX;
            this.x = Player.limit(0, 404, this.x);
        }
        if (this.moveY !== 0) {
            this.y += this.speedY * dt * this.moveY;
            this.y = Player.limit(-20, 380, this.y);
        }
        this.moveX = 0;
        this.moveY = 0;
    }

    static limit(min, max, nr) {
        let nr2 = Math.max(min, nr);
        return Math.min(nr2, max);
    }

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
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const allEnemies = [];
const player = new Player(202, 380, 101, 80);


const enemy = new Enemy(0, 62, 50);
const enemy1 = new Enemy(0, 146, 80);
const enemy2 = new Enemy(0, 228, 30);
// lane1 = 62;
// lane2 = 146;
// lane3 = 228;
allEnemies.push(enemy);
allEnemies.push(enemy1);
allEnemies.push(enemy2);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', e => {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);

});