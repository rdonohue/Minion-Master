class Wolf {
    constructor(game, x, y, spritesheet) {
        Object.assign(this, { game, x, y, spritesheet });

        this.game.wolf = this;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfsheet1.png");

        this.facing = 0;  // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = 0;   // 0 = idle, 1 = running, 2 = attacking
        this.dead = false;

        this.animations = [];
        this.loadAnimations();

    };

    loadAnimations() {
        for (var i = 0; i < 3; i++) {  // three states
              this.animations.push([]);
              for (var j = 0; j < 4; j++) {  // four directions
                  this.animations[i].push([]);
              }
         }

         // idle animation for state = 0
         // this.animations[0][0] = new Animator(this.spritesheet);
         // this.animations[0][1] = new Animator(this.spritesheet);
         // this.animations[0][2] = new Animator(this.spritesheet);
         // this.animations[0][3] = new Animator(this.spritesheet);

         // running animation for state = 1
         // this.animations[1][0] = new Animator(this.spritesheet);
         // this.animations[1][1] = new Animator(this.spritesheet);
         // this.animations[1][2] = new Animator(this.spritesheet);
         // this.animations[1][3] = new Animator(this.spritesheet);

         // attacking animation for state = 2
         // this.animations[2][0] = new Animator(this.spritesheet);
         // this.animations[2][1] = new Animator(this.spritesheet);
         // this.animations[2][2] = new Animator(this.spritesheet);
         // this.animations[2][3] = new Animator(this.spritesheet);

         // this.deadAnim = new Animator(this.spritesheet, false, true);
    }

    updateBB() {
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH,
          PARAMS.BLOCKWIDTH);
    }

    die() {
        this.dead = true;
    }

    update() {
        const TICK = this.game.clockTick;
        const SPEED = 4.4;

        // add more code here later about speed and physics
    }

    drawMinimap(ctx, mmY, mmX) {
        ctx.fillStyle = "Red";
        ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH,
          PARAMS.SCALE, PARAMS.SCALE * Math.min(this.size + 1, 2));
    };

    draw(ctx) {
        if (this.dead) {
            this.deadAnim.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x,
              this.y, PARAMS.SCALE);
        } else {
            this.animations[this.state][this.size][this.facing].drawFrame(this.game.clockTick,
              ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
        }
        if (PARAMS.DEBUG) {
            ctx.strokeStyle = 'Red';
            ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
    }

}
