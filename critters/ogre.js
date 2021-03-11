class Ogre {
    constructor(theGame, x, y) {
        Object.assign(this, { theGame, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/ogres.png");
        this.walkAnimator = new Animator(this.spritesheet, 229, 205, 104, 56, 8, 0.1, 96, false, true);
        this.attackAnimator = new Animator(this.spritesheet, 25, 9, 150, 113, 10, 0.05, 42, false, true);

        this.scale = 1;
        this.myDirection = 0; // 0 = left, 1 = right
        this.state = 1;
        this.priority = 2;

        this.visualRadius = 200;

        this.animations = [];
        this.animations.push(this.walkAnimator);
        this.animations.push(this.attackAnimator);

        this.myHealthBar = new HealthBar(this.theGame, this);

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
        this.health = minionStats.HEALTH*2;
        this.maxHealth = minionStats.HEALTH*2;
        this.defense = minionStats.DEFENSE*2;
        this.attack = minionStats.ATTACK*1.5;
        this.agility = minionStats.AGILITY;
        this.intelligence = minionStats.INTELLIGENCE;

        this.dead = false;
        this.removeFromWorld = false;
        this.facing = 0;

        //i,j for cell, x,y for continuous position.
        this.myType = "OGRE";
        this.myFaction = "enemy";
        this.description = "Don't let them destroy your base!"

        // Object.assign(this, this.name);
        this.timeBetweenUpdates = 1/this.agility;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.
        // this.currentAnim = this.animations[this.state];
        this.radius = 20;

        this.center = {
          x: this.x + this.radius*0.8,
          y: this.y + this.radius*0.8
        }

        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.elapsedTime = 0;
    };

    updateMe() {
      this.myHealthBar.updateMe();

      this.elapsedTime += this.theGame.clockTick;
      var dist = distance(this, this.target);

      this.center = {
        x: this.x + this.radius*0.8,
        y: this.y + this.radius*0.8
      }

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
          if (!this.theGame.victory && !this.theGame.theSM.paused && this.theGame.notDead) this.theGame.deadOgres++;
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
          if ((ent instanceof Minion || ent instanceof HomeBase || ent instanceof Tower) && canSee(this, ent)) {
              this.target = ent;
              combat = true;
          }
          if ((ent instanceof Minion || ent instanceof HomeBase || ent instanceof Tower) && collide(this, ent) && !ent.state == 0) {
            if (this.state === 0) {
                this.state = 1;
                this.elapsedTime = 0;
            } else if (this.elapsedTime > 0.8) {
                var damage = (this.attack + randomInt(5)) - ent.defense;
                if (damage <= 0) {
                    damage = 0;
                }
                ent.health -= damage;
                this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, damage, "Red"));
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
        this.x += this.velocity.x * this.theGame.clockTick;
        this.y += this.velocity.y * this.theGame.clockTick;

      }
      this.isSelected = (this.theGame.theCamera.thePlayer.selected == this);
    };

    drawMinimap(ctx, mmX, mmY, mmW, mmH) {
      let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
      let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
      ctx.save();
      ctx.fillStyle = "DarkGreen";
      ctx.fillRect(x, y, 5, 5);
      ctx.restore();
    };

    drawMe(ctx) {
      if (this.facing <= 4) {
        this.direction = 0;
      } else {
        this.direction = 1;
      }

      var w = this.animations[this.state].width;
      if (this.direction == 0) {
        this.animations[this.state].drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
      } else {
        this.animations[this.state].drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
      }

      this.currentAnim = this.animations[this.state];
      this.radius = Math.floor(this.currentAnim.width / 2);

      this.myHealthBar.drawMe(ctx);

      if(params.DEBUG || this.isSelected) {
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(this.center.x - this.theGame.theCamera.x, this.center.y - this.theGame.theCamera.y, this.radius*0.8, 0, 2*Math.PI);
        ctx.fillStyle = "red";
        ctx.font = '16px "Playfair Display SC'
        ctx.stroke();
        ctx.restore();
      }

    };

};
