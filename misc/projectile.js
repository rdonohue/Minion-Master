class Projectile {
    constructor(theGame, x, y, target, attackMod, scale) {
        Object.assign(this, { theGame, x, y, target, attackMod, scale});
        this.radius = 12;
        this.smooth = false;
        this.myType = "arrow";
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/arrow.png");

        this.state = 1;

        var dist = distance(this, this.target);
        this.maxSpeed = 400; // pixels per second

        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };
        this.cache = [];

        this.animations = [];
        this.animations.push(new Animator(this.spritesheet, 0, 0, 32, 32, 1, 0.2, 0, false, true));
        this.animations.push(new Animator(this.spritesheet, 40, 0, 32, 32, 1, 0.2, 0, false, true));
        this.animations.push(new Animator(this.spritesheet, 80, 0, 32, 32, 1, 0.2, 0, false, true));
        this.animations.push(new Animator(this.spritesheet, 120, 0, 32, 32, 1, 0.2, 0, false, true));
        this.animations.push(new Animator(this.spritesheet, 160, 0, 32, 32, 1, 0.2, 0, false, true));

        this.facing = 5;

        //this.currentAnim = this.animations[this.facing];
        this.radius = 12;

        this.elapsedTime = 0;
    };

    drawMinimap(ctx, mmX, mmY, mmW, mmH) {
      //do nothing;
    }

    drawAngle(ctx, angle) {
        if (angle < 0 || angle > 359) return;


        if (!this.cache[angle]) {
           let radians = angle / 360 * 2 * Math.PI;
           let offscreenCanvas = document.createElement('canvas');

            offscreenCanvas.width = 32;
            offscreenCanvas.height = 32;

            let offscreenCtx = offscreenCanvas.getContext('2d');

            offscreenCtx.save();
            offscreenCtx.translate(16, 16);
            offscreenCtx.rotate(radians);
            offscreenCtx.translate(-16, -16);
            offscreenCtx.drawImage(this.spritesheet, 80, 0, 32, 32, 0, 0, 32, 32);
            offscreenCtx.restore();
            this.cache[angle] = offscreenCanvas;
        }
    };

    updateMe() {
        this.x += this.velocity.x * this.theGame.clockTick;
        this.y += this.velocity.y * this.theGame.clockTick;

        for (var i = 0; i < this.theGame.entities.length; i++) {
            var ent = this.theGame.entities[i];
            if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Dragon) && collide(this, ent)) {
                var damage = this.attackMod - ent.defense;
                ent.health -= damage;
                this.state = 0;

                this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, damage, "#FF9900"));
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

            //this.drawAngle(ctx, degrees);
        } else {
            if (this.facing < 5) {
                this.animations[this.facing].drawFrame(this.theGame.clockTick, ctx, (this.x - xOffset) - this.theGame.theCamera.x, (this.y - yOffset) - this.theGame.theCamera.y, this.scale);
            } else {
                ctx.save();
                ctx.scale(-1, 1);
                this.animations[8 - this.facing].drawFrame(this.theGame.clockTick, ctx, -(this.x) - 32 + xOffset + this.theGame.theCamera.x, (this.y - yOffset) - this.theGame.theCamera.y, this.scale);
                ctx.restore();
            }
        }
        //this.currentAnim = this.animations[this.facing];
        //this.radius = Math.floor(this.animations[this.facing].width / 2);
    };
};
