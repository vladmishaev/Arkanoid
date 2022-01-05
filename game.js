const GAME = {
    ctx: null,
    blocksCoor: [],
    level1: {
        rows: 6,
        cols: 12
    },
    sprites: {
        background: {
            src: 'background.png',
            x: 0,
            y: 0,
            img: null
        },
        ball: {
            src: 'ball.png',
            x: 450,
            y: 571,
            img: null

        },
        platform: {
            src: 'platform.png',
            x: 400,
            y: 600,
            img: null

        },
        block: {
            src: 'block.png',
            x: 0,
            y: 0,
            img: null
        },

    },

    init() {
        this.ctx = document.querySelector('#canvasGame').getContext('2d');
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

    run() {
        window.requestAnimationFrame(() => {
            this.render();
        })
    },

    render() {
        for (const Key in this.sprites) {
            const {img, x, y} = this.sprites[Key];
            if (Key === 'block') {
                for (const coordinates of this.blocksCoor) {
                    this.ctx.drawImage(img, coordinates.x, coordinates.y);
                }
            } else {
                this.ctx.drawImage(img, x, y);
            }

        }
    },

    createBlocksCoor(level) {
        for (let row = 0; row < level.rows; row++) {
            for (let col = 0; col < level.cols; col++) {
                this.blocksCoor.push({
                    x: 84 * col,
                    y: 29 * row + 50,
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

window.addEventListener('load', () => {
    GAME.startGame();
});



