class Minion {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        // Different sprites for directions and interactions
        this.downAttack = ASSET_MANAGER.getAsset("./sprites/minion/down_attack.png");
        this.downWalk = ASSET_MANAGER.getAsset("./sprites/minion/down_walk.png");
        this.pickUp = ASSET_MANAGER.getAsset("./sprites/minion/pick_up.png");
        this.sideAttack = ASSET_MANAGER.getAsset("./sprites/minion/side_attack.png");
        this.sideWalk = ASSET_MANAGER.getAsset("./sprites/minion/side_walk.png");
        this.upAttack = ASSET_MANAGER.getAsset("./sprites/minion/up_attack.png");
        this.upWalk = ASSET_MANAGER.getAsset("./sprites/minion/up_walk.png");

        // Down
        this.downWalkAnim = new Animator(this.downWalk, 22, 20, 20, 31, 4, 0.25, 44, false, true);
        this.downFinish = new Animator(this.downWalk, 22, 83, 20, 31, 2, 0.25, 44, false, true);
        this.downAttackAnim = new Animator(this.downAttack, 13, 20, 38, 41, 2, 0.25, 25, false, true);
        this.downFinishAttack = new Animator(this.downAttack, 13, 80, 38, 41, 1, 0.25, 0, false, true);

        // Left
        this.sideWalkAnim = new Animator(this.sideWalk, 22, 16, 20, 37, 4, 0.25, 44, false, true);
        this.sideFinish = new Animator(this.sideWalk, 22, 80, 20, 37, 2, 0.25, 44, false, true);
        this.sideAttackAnim = new Animator(this.sideAttack, 2, 14, 47, 37, 2, 0.25, 16, false, true);
        this.leftFinishAttack = new Animator(this.sideAttack, 2, 78, 47, 37, 1, 0.25, 0, false, true);

        // Right
        this.sideWalkAnim = new Animator(this.sideWalk, 22, 16, 20, 37, 4, 0.25, 44, false, true);
        this.sideFinish = new Animator(this.sideWalk, 22, 80, 20, 37, 2, 0.25, 44, false, true);
        this.sideAttackAnim = new Animator(this.sideAttack, 2, 14, 47, 37, 2, 0.25, 16, false, true);
        this.rightFinishAttack = new Animator(this.sideAttack, 2, 78, 47, 37, 1, 0.25, 0, false, true);

        // Up
        this.upWalkAnim = new Animator(this.upWalk, 22, 17, 20, 34, 4, 0.25, 44, false, true);
        this.upWalkAnim = new Animator(this.upWalk, 22, 81, 20, 34, 2, 0.25, 44, false, true);
        this.upAttackAnim = new Animator(this.upAttack, 13, 3, 38, 48, 2, 0.25, 26, false, true);
        this.upFinishAttack = new Animator(this.upAttack, 13, 70, 38, 48, 1, 0.25, 0, false, true);

        // Pick Up
        this.leftPick = new Animator(this.pickUp, 23, 20, 20, 31, 4, 0.25, 44, false, true);
        this.rightPick = new Animator(this.pickUp, 23, 20, 20, 31, 4, 0.25, 44, false, true);

        this.animations = [];
        this.loadAnimations();

        this.scale = 1;
        this.direction = 0; // 0 = left, 1 = right, 2 = up, 3 = down
        this.state = 0; // 0 = idle/walking, 1 = attacking
        this.priority = 0;

        this.radius = 20;
        this.visualRadius = 200;

        this.healthbar = new HealthBar(this.game, this);

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
            if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave
              || ent instanceof Rock || ent instanceof Bush) && canSee(this, ent) && ent.health > 0) {
                this.target = ent;
                combat = true;
            }
            if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave) && collide(this, ent)) {
                if (this.state === 0) {
                    this.state = 1;
                    this.elapsedTime = 0;
                } else if (this.elapsedTime > 0.8) {
                    var damage = (5 + randomInt(5)) - ent.defense;
                    ent.health -= damage;
                    this.game.addEntity(new Score(this.game, ent.x, ent.y - 10, damage, "Red"));
                    this.elapsedTime = 0;
                }
            } else if ((ent instanceof Rock || ent instanceof Bush) && collide(this, ent) && ent.health > 0) {
                if (this.state === 0) {
                    this.state = 1;
                    this.elapsedTime = 0;
                } else if (this.elapsedTime > 0.8) {
                    var gather = 3 + randomInt(3);
                    ent.health -= gather;
                    this.game.addEntity(new Score(this.game, ent.x, ent.y - 10, gather, "Yellow"));
                    this.elapsedTime = 0;
                }
            }

        }

        // If it never detected an enemy, make sure it is back to walking.
        if (!combat) {
            this.state = 0;
        }

        this.facing = getFacing(this.velocity);
        if (this.state !== 1) {
          dist = distance(this, this.target);
          this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
            y: (this.target.y - this.y) / dist * this.maxSpeed};
          this.x += this.velocity.x * this.game.clockTick;
          this.y += this.velocity.y * this.game.clockTick;

        }

    };

    loadAnimations() {
        for (var i = 0; i < 2; i++) {
            this.animations.push([]);
            for (var j = 0; j < 4; j++) {
                this.animations[i].push([]);
            }
        }

        // Idle/Walking
        this.animations[0][0].push(this.sideWalkAnim);
        this.animations[0][0].push(this.sideFinish);
        this.animations[0][1].push(this.sideWalkAnim);
        this.animations[0][1].push(this.sideFinish);
        this.animations[0][2].push(this.upWalkAnim);
        this.animations[0][2].push(this.upFinish);
        this.animations[0][3].push(this.downWalkAnim);
        this.animations[0][3].push(this.downFinish);

        // Attacking
        this.animations[1][0].push(this.sideAttackAnim);
        this.animations[1][0].push(this.leftFinishAttack);
        this.animations[1][1].push(this.sideAttackAnim);
        this.animations[1][1].push(this.rightFinishAttack);
        this.animations[1][2].push(this.upAttackAnim);
        this.animations[1][2].push(this.upFinishAttack);
        this.animations[1][3].push(this.downAttackAnim);
        this.animations[1][3].push(this.downFinishAttack);

        console.log(this.animations.length);
        console.log(this.animations[0].length);
        console.log(this.animations[0][0].length);
    };

    drawMinimap(ctx, mmX, mmY) {
        //ctx.fillStyle = "Orange";
        //ctx.fillRect(mmX + this.myTile.myX / params.TILE_W_H, mmY + this.myTile.myY / params.TILE_W_H,
          //params.TILE_W_H / 8, params.TILE_W_H / 8);
    };

    drawMe(ctx) {
        switch (this.facing) {
            case 0:
              this.direction = 2;
              break;
            case (this.facing < 4 && this.facing > 0):
              this.direction = 1;
              break;
            case 4:
              this.direction = 3;
              break;
            case (this.facing > 4):
              this.direction = 0;
              break;
        }

        for (var i = 0; i < 2; i++) {
          this.animations[this.state][this.direction][i].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x,
                                                                this.y - this.game.camera.y, this.scale);
        }

        this.healthbar.drawMe(ctx);
    };
};
