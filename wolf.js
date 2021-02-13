class Wolf {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfsheet1.png");

        this.mySearchingAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myLeftAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myRightAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myNorthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.mySouthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myHuntingAnimator = new Animator(this.spritesheet, 320, 160, 64, 32, 4, 0.25, 0, false, true);
        this.myDeadAnimator = new Animator(this.spritesheet, 512, 202, 64, 32, 1, 0.1, 0, false, true);
        this.myScale = 1;
        this.myDirection = 0; // 0 = left, 1 = right, 2 = up, 3 = down

        this.path = [{ x: 500, y: 0 },
          { x: 500, y: 500 },
          { x: 0, y: 250 },
          { x: 700, y: 0 }];

        this.targetID = 0;
        if (this.path && this.path[0]) {
          this.target = this.path[this.targetID];
        }

        this.maxSpeed = 150;
        var dist = distance(this, this.target);
        this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
          y: (this.target.y - this.y) / dist * this.maxSpeed};

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

        this.timer = new Timer();
        this.timeSinceUpdate = 0;
    };

//the move-speed is still staggered a bit, that might be because of async
//with the draw-method being called...may need to make the minion handle its own draw-update.
    updateMe() {
        var dist = distance(this, this.target);
        if (dist < 5) {
            if (this.targetID < this.path.length - 1 && this.target === this.path[this.targetID]) {
                this.targetID++;
            }
            this.target = this.path[this.targetID];
            dist = distance(this, this.target);
        }
        this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
          y: (this.target.y - this.y) / dist * this.maxSpeed};
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

    };

    drawMe(ctx) {
        this.mySearchingAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale);
    };
};
