const GAME = {
    ctx: null,
    sprites: {
        background: {
            src: 'background.png',
            x: 0,
            y: 0,
        },
        ball: {
            src: 'ball.png',
            x: 320,
            y: 280,
            frame: 1
        },
        platform: {
            src: 'platform.png',
            x: 300,
            y: 300

        }
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
        this.preload();

    }
}

window.addEventListener('load', () => {
    GAME.startGame();
});


async function test() {
    const promiseT = new Promise((res, rej) => {
        setTimeout(() => res(2), 1000);
    });
    const answer = await promiseT;

    console.log(answer);


}
