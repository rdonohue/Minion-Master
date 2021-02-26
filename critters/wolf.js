class Wolf {
    constructor(theGame, x, y) {
        Object.assign(this, { theGame, x, y });
        this.spritesheet = ASSET_MANAGER.getAsset("./sprites/wolfsheet1.png");
        this.camera = this.theGame.theSM; //theSM is the game's camera.
        //this.animations = [];
        //loadAnimations();

        this.mySearchingAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myLeftAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myRightAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myNorthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.mySouthAnimator = new Animator(this.spritesheet, 320, 128, 64, 32, 4, 0.15, 0, false, true);
        this.myHuntingAnimator = new Animator(this.spritesheet, 320, 160, 64, 32, 4, 0.05, 0, false, true);
        this.myDeadAnimator = new Animator(this.spritesheet, 512, 202, 64, 32, 1, 3, 0, false, true);

        this.initialPoint = { x, y };

        this.scale = 1;
        this.myDirection = 0; // 0 = left, 1 = right, 2 = up, 3 = down
        this.priority = 1;

        this.baseWidth = 64;
        this.baseHeight = 24;

        this.radius = this.baseWidth*this.scale/2;
        this.Center = {
          x: this.x + this.baseWidth*this.scale/2,
          y: this.y + this.baseHeight*this.scale/2
        }


        this.visualRadius = 200;
        this.state = 0;

        this.healthbar = new HealthBar(this.theGame, this);

        this.path = [{ x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) }];

        this.targetID = 0;
        if (this.path && this.path[0]) {
          this.target = this.path[this.targetID];
        }

        this.maxSpeed = 150;
        var dist = distance(this, this.target);
        this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
          y: (this.target.y - this.y) / dist * this.maxSpeed};

        //Stats
        this.health = 100;
        this.maxHealth = 100;
        this.defense = 3;
        this.attack = 5;
        this.agility = minionStats.AGILITY*1.5;
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
            this.animations[i].push([]);
            for (var j = 0; j < 3; j++) {
                this.animations[i][j].push([]);
            }
        }
        // Left
        this.animations[0][0] = new Animator(this.spritesheet, 320, 288, 64, 32, 5, 0.15, 0, false, true);
        this.animations[0][1] = new Animator(this.spritesheet, 320, 352, 64, 32, 5, 0.05, 0, false, true);
        this.animations[0][2] = new Animator(this.spritesheet, 512, 202, 64, 25, 1, 3, 0, false, true);

        // Right
        this.animations[1][0] = new Animator(this.spritesheet, 320, 128, 64, 32, 5, 0.15, 0, false, true);
        this.animations[1][1] = new Animator(this.spritesheet, 320, 160, 64, 32, 5, 0.05, 0, false, true);
        this.animations[1][2] = new Animator(this.spritesheet, 512, 9, 64, 25, 1, 3, 0, false, true);

        // Up
        this.animations[2][0] = new Animator(this.spritesheet, 164, 134, 25, 57, 5, 0.15, 7, false, true);
        this.animations[2][1] = new Animator(this.spritesheet, 164, 258, 25, 57, 5, 0.15, 7, false, true);
        this.animations[2][2] = new Animator(this.spritesheet, 260, 84, 25, 40, 1, 3, 0, false, true);

        // Down
        this.animations[3][0] = new Animator(this.spritesheet, 4, 192, 25, 64, 5, 0.15, 7, false, true);
        this.animations[3][1] = new Animator(this.spritesheet, 4, 256, 25, 64, 5, 0.15, 7, false, true);
        this.animations[3][2] = new Animator(this.spritesheet, 100, 79, 25, 49, 1, 3, 0, false, true);
    };

    updateMe() {
        this.elapsedTime += this.theGame.clockTick;

        this.Center = {
          x: this.x + this.baseWidth*this.scale/2,
          y: this.y + this.baseHeight*this.scale/2
        }
        this.isSelected = (this.theGame.theSM.thePlayer.selected == this);

        var dist = distance(this, this.target);

        if (this.targetID >= this.path.length - 1) {
            this.targetID = 0;
            this.path = [{ x: randomInt(params.CANVAS_WIDTH), y: randomInt(params.CANVAS_HEIGHT) }];
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
        for (var i = 0; i < this.theGame.entities.length; i++) {
            var ent = this.theGame.entities[i];
            if (ent instanceof Minion && canSee(this, ent)) {
                this.target = ent;
                combat = true;
            }
            if (ent instanceof Minion && collide(this, ent) && !ent.dead) {
              if (this.state === 0) {
                  this.state = 1;
                  this.elapsedTime = 0;
              } else if (this.elapsedTime > 0.8) {
                  var damage = (this.attack + randomInt(this.attack)) - ent.defense
                  ent.health -= damage;
                  this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, damage, "Red"));
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
          this.x += this.velocity.x * this.theGame.clockTick;
          this.y += this.velocity.y * this.theGame.clockTick;
          this.facing = getFacing(this.velocity);
        }

    };

    drawMinimap(ctx, mmX, mmY) {

    };

    drawMe(ctx) {
      //this.animations[this.direction][this.state].drawFrame(this.theGame.clockTick, ctx, this.x, this.y, this.scale);
      if (this.state == 0) {
          this.mySearchingAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
      } else if (this.state == 1) {
          this.myHuntingAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
      } else {
          this.myDeadAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
      }

      if(params.DEBUG || this.isSelected) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(this.Center.x - this.camera.x, this.Center.y - this.camera.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();
      }

      this.healthbar.drawMe(ctx);
    };
};
