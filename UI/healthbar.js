class HealthBar {
    constructor(game, entity) {
        Object.assign(this, { game, entity });
    };

    updateMe() {

    };

    drawMe(ctx) {
        if (this.entity.health < this.entity.maxHealth) {
            var ratio = this.entity.health / this.entity.maxHealth;
            ctx.strokeStyle = "black";
            ctx.fillstyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
            ctx.fillRect(this.entity.x - this.entity.radius - this.game.camera.x, this.entity.y + this.entity.radius + 5 - this.game.camera.y,
              this.entity.radius  * 2 * ratio, 4);
            ctx.strokeRect(this.entity.x - this.entity.radius - this.game.camera.x, this.entity.y + this.entity.radius + 5 - this.game.camera.y,
              this.entity.radius  * 2, 4)
        }
    };
};

class Score {
    constructor(game, x, y, score, color) {
        Object.assign(this, { game, x, y, score });

        this.velocity = -32;
        this.elapsed = 0;
    }

    updateMe() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed > 1) {
            this.state = 0;
        }

        this.y += this.game.clockTick * this.velocity;
    };

    drawMe(ctx) {
        ctx.font = '12px "Press Start 2P"';
        ctx.fillStyle = this.color;
        ctx.fillText(this.score, this.x - this.game.camera.x, this.y - this.game.camera.y);
    };
}
