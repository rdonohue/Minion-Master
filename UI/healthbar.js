class HealthBar {
    constructor(entity) { //can add 2ed parameter for when we implement stamina/energy/etc.
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
    constructor(game, x, y, score) { //4th parameter for type when we want damage, regen, collection etc.
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
        ctx.fillStyle = "Red";
        ctx.fillText(this.score, this.x, this.y);
    };
}
