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
        this.priority = 0;

        this.radius = 20;
        this.visualRadius = 200;

        this.path = [{ x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
          { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
          { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
          { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) }];

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
        this.maxHealth = minionStats.HEALTH;
        this.defense = minionStats.DEFENSE;
        this.attack = minionStats.ATTACK;
        this.agility = minionStats.AGILITY;
        this.intelligence = minionStats.INTELLIGENCE;
        this.combat = false;

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

        this.elapsedTime = 0;
    };

//the move-speed is still staggered a bit, that might be because of async
//with the draw-method being called...may need to make the minion handle its own draw-update.
    updateMe() {
        this.elapsedTime += this.game.clockTick;
        var dist = distance(this, this.target);
        if (this.targetID >= this.path.length - 1) {
            this.targetID = 0;
            this.path = [{ x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
              { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
              { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
              { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) }];
        }

        // If its health is 0, it is dead.
        if (this.health <= 0) {
            this.state = 2;
            this.dead = true;
            this.removeFromWorld = true;
        }

        if (dist < 5) {
            if (this.targetID < this.path.length - 1 && this.target === this.path[this.targetID]) {
                this.targetID++;
            }
            this.target = this.path[this.targetID];
        }

        var combat = false;
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave) && canSee(this, ent)) {
                this.target = ent;
                combat = true;
            }
            if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave) && collide(this, ent)) {
                if (this.state === 0) {
                    this.state = 1;
                    this.elapsedTime = 0;
                } else if (this.elapsedTime > 0.8) {
                    ent.health -= (this.attack - ent.defense);
                    this.elapsedTime = 0;
                }
            }

        }

        // If it never detected an enemy, make sure it is back to walking.
        if (!combat) {
            this.state = 0;
        }

        if (this.state !== 1) {
          dist = distance(this, this.target);
          this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
            y: (this.target.y - this.y) / dist * this.maxSpeed};
          this.x += this.velocity.x * this.game.clockTick;
          this.y += this.velocity.y * this.game.clockTick;
          this.facing = getFacing(this.velocity);
        }

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
        }
    };
};
