class Minion {
    constructor(theGame, x, y) {
        Object.assign(this, { theGame, x, y });
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

        this.healthbar = new HealthBar(this);
        this.x = theGame.theBase.x;
        this.y = theGame.theBase.y;

        this.path = [{ x: randomInt(params.PLAY_WIDTH), y: randomInt(params.PLAY_HEIGHT) }];

        this.targetID = 0;
        if (this.path && this.path[0]) {
          this.target = this.path[this.targetID];
        }

        this.maxSpeed = 100;
        var dist = distance(this, this.target);
        this.velocity = {
          x: (this.target.x - this.x)/dist * this.maxSpeed,
          y: (this.target.y - this.y)/dist * this.maxSpeed
        };

        //Stats
        this.health = minionStats.HEALTH;
        this.maxHealth = minionStats.HEALTH;
        this.defense = minionStats.DEFENSE;
        this.attack = minionStats.ATTACK;
        this.agility = minionStats.AGILITY;
        this.intelligence = minionStats.INTELLIGENCE;
        this.combat = false;
        this.myHunger = 1;
        this.myButtons = [];
        //how much food this minion eats per second

        //this.facing = 0;

        //i,j for cell, x,y for continuous position.
        this.myType = "minion";
        this.state = 1;

        // Object.assign(this, this.name);
        this.timeBetweenUpdates = 1/this.agility;
        //this gives how long this minion will wait before moving.
        //note that its the inverse of the given speed stat.

        this.timer = new Timer();
        this.timeSinceUpdate = 0;

        this.elapsedTime = 0;
    };

    //seperating buttonManagement off to make it easer for re-use.
    buttonManagement() {
      var theClick = this.theGame.click;
      var theCam = this.theGame.camera;
      if(theClick && theClick.x - theCam.x < params.CANVAS_WIDTH) {
        //a click was found, so check to see if it was for this entity
        //by seeing if the click was within this entity's radius.
        var myLoc = {
          x: this.x - theCam.x + this.ow,
          y: this.y - theCam.y + this.oh
        }
        var dist = distance(theClick, myLoc);
        if(dist<this.radius) {
          this.theHud.setSelected(this);
        }
      }
      return this.selected;
    }

//the move-speed is still staggered a bit, that might be because of async
//with the draw-method being called...may need to make the minion handle its own draw-update.
    updateMe() {
      // If its health is 0, it is dead.
      if (this.health <= 0) {
          this.state = 0;
          return false;
      }

      this.elapsedTime += this.theGame.clockTick;

      var dist = distance(this, this.target);

      if (this.targetID >= this.path.length - 1) {
          this.targetID = 0;
          this.path = [{ x: randomInt(params.PLAY_WIDTH), y: randomInt(params.PLAY_HEIGHT) }];
      }

      if (dist < 5) {
          if (this.targetID < this.path.length - 1 && this.target === this.path[this.targetID]) {
              this.targetID++;
          }
          this.target = this.path[this.targetID];
      }


      for (var i = 0; i < this.theGame.entities.length; i++) {
          var ent = this.theGame.entities[i];
          if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave
            || ent instanceof Rock || ent instanceof Bush) && canSee(this, ent) && ent.health > 0) {
              this.target = ent;
              this.state = 2 //attacking
          }
          if ((ent instanceof Wolf || ent instanceof Ogre || ent instanceof Cave) && collide(this, ent)) {
              if (this.state == 1) {
                this.elapsedTime = 0;
              } else if (this.elapsedTime > 0.8) {

                  var damage = (5 + randomInt(5)) - ent.defense;
                  ent.health -= damage;
                  this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, damage, "Red"));
                  this.elapsedTime = 0;
              }
          } else if ((ent instanceof Rock || ent instanceof Bush) && collide(this, ent) && ent.health > 0) {
              if (this.state === 0) {
                  this.state = 1;
                  this.elapsedTime = 0;
              } else if (this.elapsedTime > 0.8) {
                  var gather = 3 + randomInt(3);
                  ent.health -= gather;
                  this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, gather, "Yellow"));
                  this.elapsedTime = 0;
              }
          }
      }

      if (this.state != 0 && this.state != 2) {
        //cannot be dead or attacking if we want to move.
        dist = distance(this, this.target);
        this.velocity = { x: (this.target.x - this.x)/dist * this.maxSpeed,
          y: (this.target.y - this.y) / dist * this.maxSpeed};
        this.x += this.velocity.x * this.theGame.clockTick;
        this.y += this.velocity.y * this.theGame.clockTick;
        this.facing = getFacing(this.velocity);
      }

      return this.buttonManagement();
    };

    drawMinimap(ctx, mmX, mmY) {
        //ctx.fillStyle = "Orange";
        //ctx.fillRect(mmX + this.myTile.myX / params.TILE_W_H, mmY + this.myTile.myY / params.TILE_W_H,
          //params.TILE_W_H / 8, params.TILE_W_H / 8);
    };

    drawMe(ctx) {
        if (this.state == 1) {
            this.myAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.camera.x - this.radius, this.y - this.theGame.camera.y - this.radius, this.myScale);
        } else if (this.state == 2) {
            this.myBattleAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.camera.x - this.radius, this.y - this.theGame.camera.y - this.radius, this.myScale);
        } else {
            this.myDeadAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.camera.x - this.radius, this.y - this.theGame.camera.y - this.radius, this.myScale);
        }

        if(params.DEBUG || this.isSelected) {
          ctx.lineWidth = 1;
          ctx.strokeStyle= "red";
          ctx.beginPath();
          ctx.arc(this.x - this.theGame.camera.x + this.ow, this.y - this.theGame.camera.y + this.oh, this.radius, 0, 2 * Math.PI);
          ctx.stroke();
        }

        this.healthbar.drawMe(ctx);
    };
};
