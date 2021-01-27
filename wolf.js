class Wolf {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.game.wolf = this;
        this.x = x;
        this.y = y;

        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfsheet1.png");

        this.facing = 0;  // 0 = right, 1 = left, 2 = up, 3 = down
        this.state = 0;   // 0 = running, 1 = attacking
        this.tile = NULL;
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

        // running animation for state = 0
        this.animations[0][0] = new Animator(this.spritesheet, 318.5, 63, 65, 33, 1, 1, 0, false, true);
        this.animations[0][1] = new Animator(this.spritesheet, 318.5, 63, 65, 33, 1, 1, 0, false, true);
        this.animations[0][2] = new Animator(this.spritesheet, 318.5, 63, 65, 33, 1, 1, 0, false, true);
        this.animations[0][3] = new Animator(this.spritesheet, 318.5, 63, 65, 33, 1, 1, 0, false, true);

        // attack animation for state = 1
        // this.animations[1][0] = new Animator(this.spritesheet);
        // this.animations[1][1] = new Animator(this.spritesheet);
        // this.animations[1][2] = new Animator(this.spritesheet);
        // this.animations[1][3] = new Animator(this.spritesheet);

        // this.deadAnim = new Animator(this.spritesheet, false, true);
    };

    update() {
        if (this.state == 0) {
            var minX = this.tile.x - 1;
            var maxX = this.tile.x + 1;
            var minY = this.tile.y - 1;
            var maxY = this.tile.y + 1;
            var newX = Math.floor(Math.random() * (maxX - minX - 1)) + minX;
            var newY = Math.floor(Math.random() * (maxY - minY - 1)) + minY;

            // Check if the x coordinate exceeds grid indexing. If so, its x coordinate
            // will remain.
            if (newX == GRID_WIDTH) {
                newX = GRID_WIDTH;
            } else if (newX < 0) {
                newX = 0;
            }

            // Check if the y coordinate exceeds grid indexing. If so, its y coordinate
            // wil remain.
            if (newY == GRID_HEIGHT) {
                newY = GRID_HEIGHT;
            } else if (newY < 0) {
                newY = 0;
            }

            //Update current tile references.
            move(this.tile, newX, newY);
        }
    };

    move(oldTile, x, y) {
        var newTile = this.game.map.getTile(x, y);
        oldTile.updateRef(this.wolf, false);
        newTile.updateRef(this.wolf, true);
        this.tile == newTile;
    };

    draw(ctx) {
        this.animations[this.state][this.facing].drawFrame(this.game.clockTick, ctx, 1, 1, 1);
    };

}
