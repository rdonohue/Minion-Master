class Ogre {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ogres.png");
        this.walkAnimator = new Animator(this.spritesheet, 229, 205, 104, 56, 8, 0.1, 96, false, true);
        this.attackAnimator = new Animator(this.spritesheet, 25, 9, 150, 113, 10, 0.05, 42, false, true);

        this.myScale = 1;
        this.myDirection = 0; // 0 = left, 1 = right
        this.state = 0;
        this.priority = 2;

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

        this.dead = false;
        this.removeFromWorld = false;
        //this.facing = 0;

        //i,j for cell, x,y for continuous position.
        this.myType = "ogre";

        // Object.assign(this, this.name);
        this.timeBetweenUpdates = 1/this.agility;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.elapsedTime = 0;
    };

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
          if ((ent instanceof Minion || ent instanceof HomeBase) && canSee(this, ent) && ent.state != 2) {
              this.target = ent;
              combat = true;
          }
          if ((ent instanceof Minion || ent instanceof HomeBase) && collide(this, ent)) {
              if (this.state === 0) {
                  this.state = 1;
                  this.elapsedTime = 0;
              } else if (this.elapsedTime > 0.8) {
                  ent.health -= (this.attack - ent.defense);
                  this.elapsedTime = 0;
              }
          }

      }

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

    };

    drawMe(ctx) {
      if (this.state == 0) {
        this.walkAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y, this.myScale);
      } else if (this.state == 1) {
        this.attackAnimator.drawFrame(this.game.clockTick, ctx, this.x, this.y-80, this.myScale);
      }

    };

};
