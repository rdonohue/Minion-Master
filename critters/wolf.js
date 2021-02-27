class Wolf {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfsheet1.png");

        this.animations = [];
        this.loadAnimations();

        this.initialPoint = { x, y };

        this.scale = 1;
        this.direction = 0; // 0 = left, 1 = right, 2 = up, 3 = down
        this.priority = 1;

        this.radius = 20;
        this.visualRadius = 200;
        this.state = 0;

        this.healthbar = new HealthBar(this.game, this);


        this.path = [{ x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
          { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
          { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) },
          { x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) }];

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
        this.maxHealth = minionStats.HEALTH;
        this.defense = minionStats.DEFENSE;
        this.attack = minionStats.ATTACK;
        this.agility = minionStats.AGILITY;
        this.intelligence = minionStats.INTELLIGENCE;

        this.dead = false;
        this.removeFromWorld = false;

        this.myType = "wolf";

        this.timeBetweenUpdates = 1/this.agility;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.elapsedTime = 0;
    };

    // Load the animations for this entity.
    loadAnimations() {
        for (var i = 0; i < 4; i++) {
            this.animations.push([]);
        }
        // Left
        this.animations[0].push(new Animator(this.spritesheet, 320, 288, 64, 32, 5, 0.15, 0, false, true));
        this.animations[0].push(new Animator(this.spritesheet, 320, 352, 64, 32, 5, 0.05, 0, false, true));
        this.animations[0].push(new Animator(this.spritesheet, 512, 202, 64, 25, 1, 3, 0, false, true));

        // Right
        this.animations[1].push(new Animator(this.spritesheet, 320, 128, 64, 32, 5, 0.15, 0, false, true));
        this.animations[1].push(new Animator(this.spritesheet, 320, 160, 64, 32, 5, 0.05, 0, false, true));
        this.animations[1].push(new Animator(this.spritesheet, 512, 9, 64, 25, 1, 3, 0, false, true));

        // Up
        this.animations[2].push(new Animator(this.spritesheet, 164, 134, 25, 57, 5, 0.15, 7, false, true));
        this.animations[2].push(new Animator(this.spritesheet, 164, 258, 25, 57, 5, 0.15, 7, false, true));
        this.animations[2].push(new Animator(this.spritesheet, 260, 84, 25, 40, 1, 3, 0, false, true));

        // Down
        this.animations[3].push(new Animator(this.spritesheet, 4, 192, 25, 64, 5, 0.15, 7, false, true));
        this.animations[3].push(new Animator(this.spritesheet, 4, 256, 25, 64, 5, 0.15, 7, false, true));
        this.animations[3].push(new Animator(this.spritesheet, 100, 79, 25, 49, 1, 3, 0, false, true));
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
            if (ent instanceof Minion && canSee(this, ent)) {
                this.target = ent;
                combat = true;
            }
            if (ent instanceof Minion && collide(this, ent) && !ent.dead) {
              if (this.state === 0) {
                  this.state = 1;
                  this.elapsedTime = 0;
              } else if (this.elapsedTime > 0.8) {
                  var damage = (6 + randomInt(5)) - ent.defense;
                  ent.health -= damage;
                  this.game.addEntity(new Score(this.game, ent.x, ent.y - 10, damage, "Red"));
                  this.elapsedTime = 0;
              }
            }
        }

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

    drawMinimap(ctx, mmX, mmY) {

    };

    drawMe(ctx) {
        if (this.facing == 0) {
          this.direction = 2;
        } else if (this.facing < 4 && this.facing > 0) {
          this.direction = 1;
        } else if (this.facing == 4) {
          this.direction = 3
        } else if (this.facing > 4) {
          this.direction = 0;
        }
        this.animations[this.direction][this.state].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y - this.game.camera.y, this.scale);

        this.healthbar.drawMe(ctx);
    };
};
