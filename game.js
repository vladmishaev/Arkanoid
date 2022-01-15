const KEYS = {
    LEFT: 37,
    RIGHT: 39,
    SPACE: 32
}

const GAME = {
    ctx: null,
    blocksCoor: [],
    ball: null,
    platform: null,
    block: null,
    level1: {
        rows: 6,
        cols: 12
    },
    sprites: {
        background: {
            src: 'background.png',
            img: null,
        },
        ball: {
            src: 'ball.png',
            img: null,
        },
        platform: {
            src: 'platform.png',
            img: null,
        },
        block: {
            src: 'block.png',
            img: null,
        },

    },

    init() {
        this.canvas = document.querySelector('#canvasGame');
        this.ctx = this.canvas.getContext('2d');
        this.setEvents();
    },
    setEvents() {
        window.addEventListener('keydown', event => {
            if (event.keyCode === KEYS.LEFT || event.keyCode === KEYS.RIGHT) {
                this.platform.start(event.keyCode);
            } else if (event.keyCode === KEYS.SPACE) {
                this.platform.fire();
            }

        });
        window.addEventListener('keyup', event => {
            this.platform.stop();
        });
    },
    creatImg(src) {
        const img = new Image();
        img.src = `img/${src}`;
        return img;
    },

    preload(fun) {
        let loaded = 0;
        const required = Object.keys(this.sprites).length;
        const renderCanvas = () => {
            loaded++;
            if (loaded >= required) {
                fun();
            }
        };

        for (const Key in this.sprites) {
            const {src} = this.sprites[Key];
            const img = this.creatImg(src);
            this.sprites[Key]['img'] = img;

            img.addEventListener('load', renderCanvas);
        }
    },
    update() {
        this.collidePlatform();
        this.collideBlock();
        this.ball.collideWorldBounds();
        this.platform.move();
        this.ball.move();


    },
    collidePlatform() {
        if (this.ball.collide(this.platform)) {
            this.ball.bumpPlatform(this.platform);
        }
    },
    collideBlock() {
        for (const block of this.blocksCoor) {
            if (block.active && this.ball.collide(block)) {
                this.ball.bumpBlock(block);
            }
        }
    },

    run() {
        window.requestAnimationFrame(() => {
            this.update();
            this.render();
            this.run();
        })
    },

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.sprites.background.img, 0, 0);
        this.ctx.drawImage(this.sprites.ball.img, this.ball.x, this.ball.y);
        this.ctx.drawImage(this.sprites.platform.img, this.platform.x, this.platform.y);
        this.renderBlocks();
    },

    renderBlocks() {
        const img = this.sprites.block.img;
        for (const coordinates of this.blocksCoor) {
            if (coordinates.active) {
                this.ctx.drawImage(img, coordinates.x, coordinates.y);
            }
        }
    },

    createBlocksCoor(level) {
        for (let row = 0; row < level.rows; row++) {
            for (let col = 0; col < level.cols; col++) {
                this.blocksCoor.push({
                    width: 84,
                    height: 29,
                    active: true,
                    x: 84 * col,
                    y: 29 * row + this.block.y,
                });
            }
        }

    },

    startGame() {
        this.init();
        this.preload(() => {
            this.createBlocksCoor(this.level1);
            this.run();
        });

    },
    random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

GAME.ball = {
    velocity: 4,
    dy: 0,
    dx: 0,
    width: 33,
    height: 29,
    x: 450,
    y: 571,
    single: true,
    start() {
        this.dy = -this.velocity;
        // this.dx = GAME.random(-this.velocity, this.velocity);
    },
    bumpBlock(block) {
        this.dy *= -1;
        block.active = false;
    },
    move() {
        this.y += this.dy;
        this.x += this.dx;
    },
    collideWorldBounds() {
        const x = this.x + this.dx;
        const y = this.y + this.dy;

        const ballLeft = x;
        const ballRight = ballLeft + this.width;
        const ballTop = y;
        const ballBottom = ballTop + this.height;

        const gameWorldLeft = 0;
        const gameWorldRight = GAME.canvas.width;
        const gameWorldTop = 0;
        const gameWorldBottom = GAME.canvas.height;


        if (ballLeft < gameWorldLeft) {
            this.x = 0;
            this.dx = this.velocity;
        } else if (ballRight > gameWorldRight) {
            this.x = gameWorldRight - this.width;
            this.dx = -this.velocity;
        } else if (ballTop < gameWorldTop) {
            this.y = 0;
            this.dy = this.velocity;
        } else if (ballBottom > gameWorldBottom) {
            console.log('game over');
        }


    },
    collide(block) {
        const x = this.x + this.dx;
        const y = this.y + this.dy;
        if (x + this.width > block.x &&
            x < block.x + block.width &&
            y + this.height > block.y &&
            y < block.y + block.height) {
            return true;
        } else {
            return false;
        }

    },
    bumpPlatform(platform) {
        if (this.dy > 0) {
            this.dy = -this.velocity;
            const touchX = this.x + this.width / 2;
            this.dx = this.velocity * platform.getTouchOffset(touchX);
        }

    }

};

GAME.platform = {
    x: 400,
    y: 600,
    velocity: 6,
    width: 132,
    height: 20,
    ball: GAME.ball,
    dx: 0,
    fire() {
        if (this.ball !== null) {
            this.ball.start();
            this.ball = null;
        }

    },
    move() {
        if (this.dx) {
            this.x += this.dx;
            if (this.ball !== null) {
                this.ball.x += this.dx;
            }

        }
    },
    start(direction) {
        if (direction === KEYS.LEFT) {
            this.dx = -this.velocity;
        } else if (direction === KEYS.RIGHT) {
            this.dx = this.velocity;
        }
    },
    stop() {
        this.dx = 0;
    },
    getTouchOffset(x) {
        const diff = (this.x + this.width) - x;
        const offSet = this.width - diff;
        const result = 2 * offSet / this.width;
        return result - 1;
    },


};

GAME.block = {
    width: 84,
    height: 29,
    x: 0,
    y: 50,
};


window.addEventListener('load', () => {
    GAME.startGame();
});



