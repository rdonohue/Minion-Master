class HomeBase {
    constructor(game, x, y) {
        Object.assign(this, {game, x, y });

        this.game.homebase = this;
        this.myName = "HomeBase";

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle.png");

        this.state = 0;  // 0 = idle, 1 = destroyed

        //Stats
        this.health = 200;
        this.defense = 0.0;
        this.attack = 0;
        this.agility = 0;
        this.intelligence = 0;
        this.removeFromWorld = false;

        this.animations = [];
        this.loadAnimations();
    };

    loadAnimations() {
         // idle animation for state = 0
         this.animations[0] = new Animator(this.spritesheet, 0, 0, 430, 461, 1, 1, 0, false, true);
         // this.animations[1] = some other sprite that represents a destroyed home base (wreckage)
    }

    updateMe() {

        // add more code here later about speed and physics
    }

    die() {
        this.state = 1;
        this.removeFromWorld = true;
    };

    drawMe(ctx) {
        this.animations[0].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, 0.5);
    };

}
