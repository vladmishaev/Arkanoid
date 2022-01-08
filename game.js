const KEYS = {
    LEFT: 37,
    RIGHT: 39
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
        this.ctx = document.querySelector('#canvasGame').getContext('2d');
        this.setEvents();
    },
    setEvents() {
        window.addEventListener('keydown', event => {
            if (event.keyCode === KEYS.LEFT || event.keyCode === KEYS.RIGHT) {
                this.platform.start(event.keyCode);
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
        this.platform.move();
    },

    run() {
        window.requestAnimationFrame(() => {
            this.update();
            this.render();
            this.run();
        })
    },

    render() {
        this.ctx.drawImage(this.sprites.background.img, 0, 0);
        this.ctx.drawImage(this.sprites.ball.img, this.ball.x, this.ball.y);
        this.ctx.drawImage(this.sprites.platform.img, this.platform.x, this.platform.y);
        this.renderBlocks();
    },

    renderBlocks() {
        const img = this.sprites.block.img;
        for (const coordinates of this.blocksCoor) {
            this.ctx.drawImage(img, coordinates.x, coordinates.y);
        }
    },

    createBlocksCoor(level) {
        for (let row = 0; row < level.rows; row++) {
            for (let col = 0; col < level.cols; col++) {
                this.blocksCoor.push({
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

    }
}

GAME.ball = {
    x: 450,
    y: 571,
    single: true

};

GAME.platform = {
    x: 400,
    y: 600,
    velocity: 6,
    dx: 0,
    move() {
        if (this.dx) {
            this.x += this.dx;
            GAME.ball.x += this.dx;
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
    }

};

GAME.block = {
    x: 0,
    y: 50,
};


window.addEventListener('load', () => {
    GAME.startGame();
});



