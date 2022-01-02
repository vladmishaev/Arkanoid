const GAME = {
    ctx: null,
    sprites: {
        background: {
            src: 'background.png',
        },
        ball: {
            src: 'ball.png',
        },
        platform: {
            src: 'platform.png',

        }
    },

    init() {
        this.ctx = document.querySelector('#canvasGame').getContext('2d');
    },
    preload() {
        for (const Key in this.sprites) {
            let {src} = this.sprites[Key];
            const img = new Image();
            img.src = `img/${src}`;
            img.addEventListener('load', () => {
                this.renderCanvas(img, 0, 0)
            })


        }
    },
    renderCanvas(element, y, x) {
        window.requestAnimationFrame(() => {
            this.ctx.drawImage(element, y, x);
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
