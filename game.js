const GAME = {
    ctx: null,
    block: {
        src: 'block.png',
        x: 0,
        y: 0
    },
    blocksCoor: [],
    level1: {
        rows: 4,
        cols: 8
    },
    sprites: {
        background: {
            src: 'background.png',
            x: 0,
            y: 0,
        },
        ball: {
            src: 'ball.png',
            x: 450,
            y: 571,
            frame: 1
        },
        platform: {
            src: 'platform.png',
            x: 400,
            y: 600

        },

    },

    init() {
        this.ctx = document.querySelector('#canvasGame').getContext('2d');
    },


    async preload() {
        for (const Key in this.sprites) {
            const {src, x, y} = this.sprites[Key];
            const img = this.creatImg(src);

            const promiseImg = new Promise((resolve) => {
                img.addEventListener('load', () => {
                    this.renderCanvas(img, x, y);
                    resolve();
                });
            });

            await promiseImg;
        }
    },

    createBlocksCoor(level) {
        for (let row = 0; row < level.rows; row++) {
            for (let col = 0; col < level.cols; col++) {
                this.blocksCoor.push({
                    x: 84 * col,
                    y: 29 * row
                });
            }
        }

    },

    renderBlock(level) {
        this.createBlocksCoor(level);
        const RenderFun = () => {
            for (const coordinates of this.blocksCoor) {
                this.renderCanvas(img, coordinates.x, coordinates.y);
            }
        };

        const {src, x, y} = this.block;
        const img = this.creatImg(src);
        img.addEventListener('load', RenderFun);


    },

    runLevel(level) {
        this.preload();
        this.renderBlock(level);

    },

    creatImg(src) {
        const img = new Image();
        img.src = `img/${src}`;
        return img;
    },


    renderCanvas(element, x, y) {
        window.requestAnimationFrame(() => {
            this.ctx.drawImage(element, x, y);

        });

    },

    startGame() {
        this.init();
        this.runLevel(this.level1);

    }
}

window.addEventListener('load', () => {
    GAME.startGame();
});



