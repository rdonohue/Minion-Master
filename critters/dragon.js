class Dragon {
    constructor(game, x, y) {
        Object.assign(this, { game, x, y });

        this.downSheet = ASSET_MANAGER.getAsset("./sprites/reddragonflydown.png");
        this.leftSheet = ASSET_MANAGER.getAsset("./sprites/reddragonflyleft.png");
        this.rightSheet = ASSET_MANAGER.getAsset("./sprites/reddragonflyright.png");
        this.upSheet = ASSET_MANAGER.getAsset("./sprites/reddragonflyup.png");

        this.animations = [];
        this.loadAnimations();

        this.scale = 1;
        this.projectileScale = 1;
        this.direction = 0; // 0 = left, 1 = right, 2 = up, 3 = down
        this.facing = 0;
        this.state = 0;

        this.radius = 20;
        this.visualRadius = 190;
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
        this.health = 300;
        this.maxHealth = 300;
        this.defense = 15;
        this.attack = 20;
        this.agility = minionStats.AGILITY;
        this.intelligence = minionStats.INTELLIGENCE;

        this.dead = false;
        this.removeFromWorld = false;

        this.myType = "dragon";

        this.timeBetweenUpdates = 1/this.agility;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.elapsedTime = 0;

        this.currentAnim = this.animations[this.state][this.direction];
        this.radius = 20;
        this.visualRadius = 190;

    };

    loadAnimations() {
        for (var i = 0; i < 2; i++) {
            this.animations.push([]);
        }

        // Idle/Moving
        this.animations[0].push(new Animator(this.leftSheet, 34, 4, 155, 120, 4, 0.2, 50, false, true));
        this.animations[0].push(new Animator(this.rightSheet, 14, 4, 155, 121, 4, 0.2, 50, false, true));
        this.animations[0].push(new Animator(this.upSheet, 7, 22, 191, 131, 4, 0.2, 14, false, true));
        this.animations[0].push(new Animator(this.downSheet, 7, 26, 195, 109, 4, 0.2, 10, false, true));

        // Attack
        this.animations[1].push(new Animator(this.leftSheet, 34, 524, 155, 92, 4, 0.2, 50, false, true));
        this.animations[1].push(new Animator(this.rightSheet, 15, 524, 155, 92, 4, 0.2, 50, false, true));
        this.animations[1].push(new Animator(this.upSheet, 7, 500, 191, 131, 4, 0.2, 14, false, true));
        this.animations[1].push(new Animator(this.downSheet, 7, 509, 186, 117, 4, 0.2, 21, false, true));

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
          // (ent instanceof Minion || ent instanceof HomeBase || ent instanceof Tower)
          if ((ent instanceof Minion || ent instanceof HomeBase || ent instanceof Tower) && canSee(this, ent)) {
              this.target = ent;
              combat = true;
              if (this.elapsedTime > (0.2 / this.agility) && !collide(this, ent)) {
                  this.elapsedTime = 0;
                  this.game.addEntity(new Fireball(this.game, this.currentAnim.width / 2 + this.x - this.game.camera.x,
                    this.currentAnim.height / 2 + this.y - this.game.camera.y, ent, this.attack, this.projectileScale));
              }
          }
          if ((ent instanceof Minion || ent instanceof HomeBase || ent instanceof Tower) && collide(this, ent) && !ent.dead) {
            if (this.state === 0) {
                this.state = 1;
                this.elapsedTime = 0;
            } else if (this.elapsedTime > 0.8) {
                var damage = (this.attack + randomInt(5)) - ent.defense;
                if (damage <= 0) {
                    damage = 0;
                }
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
      this.animations[this.state][this.direction].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x,
                                                            this.y - this.game.camera.y, this.scale);
      this.currentAnim = this.animations[this.state][this.direction];
      // this.radius = Math.floor(this.currentAnim.width / 2);

      this.healthbar.drawMe(ctx);
    };
};
