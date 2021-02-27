class Minion {
    constructor(theGame, x, y) {
        Object.assign(this, {theGame, x, y });
        this.camera = this.theGame.theSM; //theSM is the game's camera.
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");
        this.thePlayer = this.theGame.theSM.thePlayer;

        this.myAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myLeftAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myRightAnimator = new Animator(this.spritesheet, 2, 4, 16, 16, 4, 0.1, 4, false, true);
        this.myBattleAnimator = new Animator(this.spritesheet, 62, 5, 16, 16, 4, 0.05, 4, false, true);
        this.myDeadAnimator = new Animator(this.spritesheet, 162, 7, 16, 16, 1, 0.1, 4, false, true);

        this.scale = 2;
        this.myDirection = 0; // 0 = left, 1 = right
        this.state = 1;
        this.priority = 0;

        this.baseWidth = 16;
        this.baseHeight = 16;
        this.radius = 20;
        this.center = {
          x: this.x + this.baseWidth*this.scale/2,
          y: this.y + this.baseHeight*this.scale/2
        }
        this.visualRadius = 200;
        this.isSelected = false;

        this.healthbar = new HealthBar(this.theGame, this);

        this.path = [{ x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) }];

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
        this.elapsedTime += this.theGame.clockTick;

        this.center = {
          x: this.x + this.baseWidth*this.scale/2,
          y: this.y + this.baseHeight*this.scale/2
        }
        this.isSelected = (this.thePlayer.selected == this);

        var dist = distance(this, this.target);
        if (!this.target && this.targetID >= this.path.length - 1 || this.target && this.target.health < 0) {
            this.targetID = 0;
            this.path = [{ x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) }];
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
        for (var i = 0; i < this.theGame.entities.length; i++) {
            var ent = this.theGame.entities[i];
            if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave
              || ent instanceof Rock || ent instanceof Bush) && canSee(this, ent) && ent.health > 0) {
                this.target = ent;
                combat = true;
            }
            if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave) && collide(this, ent)) {
                if (this.state == 0) {
                    this.state = 1;
                    this.elapsedTime = 0;
                } else if (this.elapsedTime > 0.8) {
                    var damage = (this.attack + randomInt(this.attack)) - ent.defense;
                    ent.health -= damage;
                    this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, damage, "Red"));
                    this.elapsedTime = 0;
                }
            } else if ((ent instanceof Rock || ent instanceof Bush) && collide(this, ent) && ent.health > 0) {
                if (this.state == 0) {
                    this.state = 1;
                    this.elapsedTime = 0;
                } else if (this.elapsedTime > 0.8) {
                    if(ent instanceof Rock) {
                      var gather = 3 + randomInt(3);
                      ent.health -= gather;
                      this.thePlayer.myRock += gather;
                    } else if (ent instanceof Bush) {
                      var gather = 3 + randomInt(3);
                      ent.health -= gather;
                      this.thePlayer.myFood += gather;
                    }
                    this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, gather, "Yellow"));
                    this.elapsedTime = 0;
                }
            }

        }

        // If it never detected an enemy, make sure it is back to walking.
        if (!combat || !this.target) {
            this.state = 0;
        }

        dist = distance(this, this.target);
        this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
          y: (this.target.y - this.y) / dist * this.maxSpeed};
        this.x += this.velocity.x * this.theGame.clockTick;
        this.y += this.velocity.y * this.theGame.clockTick;
        this.facing = getFacing(this.velocity);
    };

    drawMinimap(ctx, mmX, mmY) {
        //ctx.fillStyle = "Orange";
        //ctx.fillRect(mmX + this.myTile.myX / params.TILE_W_H, mmY + this.myTile.myY / params.TILE_W_H,
          //params.TILE_W_H / 8, params.TILE_W_H / 8);
    };

    drawMe(ctx) {
        if (this.state == 0) {
            this.myAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
        } else if (this.state == 1) {
            this.myBattleAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
        } else {
            this.myDeadAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
            die();
        }

        if(params.DEBUG || this.isSelected) {
          ctx.strokeStyle = "red";
          ctx.beginPath();
          ctx.arc(this.center.x - this.camera.x, this.center.y - this.camera.y, this.radius, 0, 2*Math.PI);
          ctx.stroke();
        }

        this.healthbar.drawMe(ctx);
    };
};
