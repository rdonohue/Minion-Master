class Minion {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");

        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myLeftAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myRightAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myBattleAnimator = new Animator(this.spritesheet, 62, 5, 16, 16, 4, 0.05, 4, false, true);
        this.myDeadAnimator = new Animator(this.spritesheet, 162, 7, 16, 16, 1, 0.1, 4, false, true);

        this.myScale = 2;
        this.myDirection = 0; // 0 = left, 1 = right
        this.state = 0;

        this.radius = 20;
        this.visualRadius = 200;

        this.path = [{ x: 100, y: 0 },
          { x: 300, y: 500 },
          { x: 0, y: 50 },
          { x: 0, y: 0 }];

        this.targetID = 0;
        if (this.path && this.path[0]) {
          this.target = this.path[this.targetID];
        }

        this.maxSpeed = 100;
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
        }

        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent instanceof Wolf && canSee(this, ent)) {
                this.target = ent;
            }
            if (ent instanceof Wolf && collide(this, ent)) {
                this.state = 1;
            }
        }

        dist = distance(this, this.target);
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
        if (this.state == 0) {
            this.myAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale);
        } else if (this.state == 1) {
            this.myBattleAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale);
        } else {
            this.myDeadAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale);
            die();
        }
    };
};
