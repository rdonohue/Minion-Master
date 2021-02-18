class HealthBar {
    constructor(entity) {
        Object.assign(this, { entity });
    };

    updateMe() {

    };

    drawMe(ctx) {
        if (this.entity.health < this.entity.maxHealth) {
            var ratio = this.entity.health / this.entity.maxHealth;
            ctx.strokeStyle = "black";
            ctx.fillstyle = ratio < 0.2 ? "Red" : ratio < 0.5 ? "Yellow" : "Green";
            ctx.fillRect(this.entity.x - this.entity.radius, this.entity.y + this.entity.radius + 5,
              this.entity.radius  * 2 * ratio, 4);
            ctx.strokeRect(this.entity.x - this.entity.radius, this.entity.y + this.entity.radius + 5,
              this.entity.radius  * 2, 4)
        }
    };

};

class Score {
    constructor(game, x, y, score) {
        Object.assign(this, { game, x, y, score });

        this.velocity = -32;
        this.elapsed = 0;
    }

    updateMe() {
        this.elapsed += this.game.clockTick;
        if (this.elapsed > 1) {
            this.removeFromWorld = true;
        }

        this.y += this.game.clockTick * this.velocity;
    };

    drawMe(ctx) {
        ctx.font = '12px "Press Start 2P"';
        ctx.fillStyle = "Red";
        ctx.fillText(this.score, this.x, this.y);
    };
}
