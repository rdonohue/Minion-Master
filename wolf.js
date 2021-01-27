class Wolf {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

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
         this.animations[0][0] = new Animator(this.spritesheet, 318.5, 63, 65, 33, 1, 1, 0, false, true);
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

    update() {

        // add more code here later about speed and physics
    }

    draw(ctx) {
        this.animations[0][0].drawFrame(this.game.clockTick, ctx, 535, 400, 2);
    }

}
