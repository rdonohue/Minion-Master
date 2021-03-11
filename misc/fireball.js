class Fireball {
    constructor(theGame, x, y, target, attackMod, scale) {
        Object.assign(this, { theGame, x, y, target, attackMod, scale});
        this.radius = 12;
        this.smooth = false;

        this.myType = "fire";

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/spicy.png");

        this.downFire = new Animator(this.spritesheet, 0, 0, 10, 27, 10, 0.25, 0, false, true);
        this.upFire = new Animator(this.spritesheet, 129, 0, 10, 27, 10, 0.25, 0, false, true);
        this.leftFire = new Animator(this.spritesheet, 0, 168, 27, 10, 10, 0.25, 0, false, true);
        this.rightFire = new Animator(this.spritesheet, 0, 278, 27, 10, 10, 0.25, 0, false, true);

        this.animations = [];
        this.loadAnimations();
        this.direction = 0;
        this.state = 1;

        var dist = distance(this, this.target);
        this.maxSpeed = 400; // pixels per second

        this.velocity = { x: (this.target.x - this.x) / dist * this.maxSpeed, y: (this.target.y - this.y) / dist * this.maxSpeed };

        this.cache = [];
        this.facing = 5;
        this.elapsedTime = 0;
        this.removeFromWorld = false;
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

    loadAnimations() {
        this.animations.push(this.leftFire);
        this.animations.push(this.rightFire);
        this.animations.push(this.upFire);
        this.animations.push(this.downFire);
    };

    updateMe() {
      this.x += this.velocity.x * this.theGame.clockTick;
      this.y += this.velocity.y * this.theGame.clockTick;

      for (var i = 0; i < this.theGame.entities.length; i++) {
          var ent = this.theGame.entities[i];
          if ((ent instanceof Minion || ent instanceof Wolf || ent instanceof Tower || ent instanceof HomeBase) && collide(this, ent)) {
              var damage = this.attackMod - ent.defense;
              this.state = 0;
              if (damage < 0) {
                  damage = 0;
              }
              ent.health -= damage;
              this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, damage, "#FF9900"));
              this.removeFromWorld = true;
          }
      }

      this.facing = getFacing(this.velocity);
    };

    drawMinimap(ctx, mmX, mmY, mmW, mmH) {

    };

    drawMe(ctx) {
        var xOffset = 16;
        var yOffset = 16;
        if (this.facing == 0) {
          this.direction = 2;
        } else if (this.facing < 4 && this.facing > 0) {
          this.direction = 1;
        } else if (this.facing == 4) {
          this.direction = 3
        } else if (this.facing > 4) {
          this.direction = 0;
        }

        if (this.smooth) {
            let angle = Math.atan2(this.velocity.y , this.velocity.x);
            if (angle < 0) angle += Math.PI * 2;
            let degrees = Math.floor(angle / Math.PI / 2 * 360);
            this.drawAngle(ctx, degrees);
        } else {
            this.animations[this.direction].drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theSM.x,
                                                      this.y - this.theGame.theSM.y, this.scale);
        }
    };
};
