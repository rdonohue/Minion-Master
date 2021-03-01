class Fireball {
    constructor(game, x, y, target, attackMod, scale) {
        Object.assign(this, { game, x, y, target, attackMod, scale});
        this.radius = 12;
        this.smooth = false;

        this.myType = "fire";

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/Fires/Small_Fireball_10x26.png");
        this.fireAnim = new Animator(this.spritesheet, 0, 0, 10, 27, 10, 0.25, 0, false, true);

        var dist = distance(this, this.target);
        this.maxSpeed = 400; // pixels per second

        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };

        this.cache = [];
        this.facing = 5;
        this.elapsedTime = 0;
    };

    drawAngle(ctx, angle) {
        if (angle < 0 || angle > 359) return;

        if (!this.cache[angle]) {
           let radians = angle / 360 * 2 * Math.PI;
           let offscreenCanvas = document.createElement('canvas');
           var maxer = Math.max(this.fireAnim.width, this.fireAnim.height);

            offscreenCanvas.width = 27;
            offscreenCanvas.height = 27;

            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(Math.floor(maxer / 2), Math.floor(maxer / 2));
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-Math.floor(maxer / 2), -Math.floor(maxer / 2));
            offscreenCtx.drawImage(this.spritesheet, 0, 0, 10, 27, 5, 0, 10, 27);
            offscreenCtx.restore();
            this.cache[angle] = offscreenCanvas;
        }
    };

    updateMe() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;

        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if ((ent instanceof Minion || ent instanceof Tower || ent instanceof HomeBase) && collide(this, ent)) {
                var damage = this.attackMod;
                ent.health -= damage;
                this.removeFromWorld = true;
            }
        }

        this.facing = getFacing(this.velocity);
    };

    drawMe(ctx) {
        var xOffset = 16;
        var yOffset = 16;
        if (this.smooth) {
            let angle = Math.atan2(this.velocity.y , this.velocity.x);
            if (angle < 0) angle += Math.PI * 2;
            let degrees = Math.floor(angle / Math.PI / 2 * 360);
            this.drawAngle(ctx, degrees);
        } else {
            if (this.facing < 5) {
                this.fireAnim.drawFrame(this.game.clockTick, ctx, (this.x - xOffset) - this.game.camera.x, (this.y - yOffset) - this.game.camera.y, this.scale);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                this.fireAnim.drawFrame(this.game.clockTick, ctx, -(this.x) - 32 + xOffset + this.game.camera.x, (this.y - yOffset) - this.game.camera.y, this.scale);
                ctx.restore();
            }
        }
    };
};
