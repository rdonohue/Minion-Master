class HomeBase {
    constructor(game) {
        Object.assign(this, { game });

        this.game.homebase = this;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

        this.state = 0;   // 0 = idle, 1 = running, 2 = attacking
        this.dead = false;

        this.animations = [];
        this.loadAnimations();

    };

    loadAnimations() {

         // idle animation for state = 0
         this.animations[0] = new Animator(this.spritesheet, 0, 0, 430, 461, 1, 1, 0, false, true);
         // this.animations[1] = some other sprite that represents a destroyed home base (wreckage)


    }

    update() {

        // add more code here later about speed and physics
    }

    draw(ctx) {
        this.animations[0].drawFrame(this.game.clockTick, ctx, 500, 300, 0.5);
    }

}
