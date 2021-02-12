class Minion {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");

        //this.game.minion = this;

        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myBattleAnimator = new Animator(this.spritesheet, 62, 5, 16, 16, 4, 0.1, 4, false, true);
        this.myDeadAnimator = new Animator(this.spritesheet, 162, 7, 16, 16, 1, 0.1, 4, false, true);
        this.myScale = 2;

        this.path = [{ x: 100, y: 100 },
          { x: 200, y: 200 },
          { x: 300, y: 300 },
          { x: 0, y: 0 }];

        this.targetID = 0;
        if (this.path && this.path[0]) {
          this.target = this.path[this.targetID];
        }

        this.maxSpeed = 100;
        var dist = distance(this, this.target);
        this.velocity = { x: (this.target.x - this.x)/dist, y: (this.target.y - this.y) / dist * this.maxSpeed};

        //Stats
        this.health = minionStats.HEALTH;
        this.defense = minionStats.DEFENSE;
        this.attack = minionStats.ATTACK;
        this.agility = minionStats.AGILITY;
        this.intelligence = minionStats.INTELLIGENCE;

        this.dead = false;
        this.removeFromWorld = false;
        //this.facing = 0;

        //i,j for cell, x,y for continuous position.
        this.myType = "minion";

        // Object.assign(this, this.name);
        this.timeBetweenUpdates = 1/this.agility;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.n = "n";
        this.e = "e";
        this.w = "w";
        this.s = "s";
        // (n, e, s, w) --> (up, right, down, left, diagonals don't exist)
        this.timer = new Timer();
        this.timeSinceUpdate = 0;
    };

//the move-speed is still staggered a bit, that might be because of async
//with the draw-method being called...may need to make the minion handle its own draw-update.
    updateMe() {
        this.x += this.velocity.x * this.game.clockTick;
        this.y += this.velocity.y * this.game.clockTick;
        this.facing = getFacing(this.velocity);
    };

    //this function determines what this entity "sees"

    //this function determines what this entity does based on what it sees.
    //currently just gets a random Tilefrom the 9 tiles around it including its own.
    //and picks that as its move.


    // Engaging in combat with enemy.
    fight(enemy) {
        if (enemy.health > 0 && this.health > 0) {
          //don't check that its not equal, check that its greater then 0.
            enemy.health -= Math.floor(this.attack - (enemy.defense * this.attack));
            this.health -= Math.floor(enemy.attack - (this.defense * enemy.attack));
            if (enemy.health <= 0) {
                enemy.die();
            }
            if (this.health <= 0) {
                die();
            }
        }
    };

    damage(projectile) {
      // this.health -= Math.floor(projectile.attack - (this.defense * projectile.attack));
      // if (this.health <= 0) {
      //    die();
      // }
    };

    die() {
        this.dead = true;
        this.removeFromWorld = true;
    };

    drawMinimap(ctx, mmX, mmY) {
        //ctx.fillStyle = "Orange";
        //ctx.fillRect(mmX + this.myTile.myX / params.TILE_W_H, mmY + this.myTile.myY / params.TILE_W_H,
          //params.TILE_W_H / 8, params.TILE_W_H / 8);
    };

    drawMe(ctx) {
        this.myAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale);
    };
};
