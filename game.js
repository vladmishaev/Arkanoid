const GAME = {
    startGame() {
        this.ctx = document.querySelector('#canvasGame').getContext('2d');
        const background = new Image();
        background.src = 'img/background.png';
        window.requestAnimationFrame(() => {
            this.ctx.drawImage(background, 0, 0);

        });

    }
}

window.addEventListener('load', () => {
    GAME.startGame();
});
