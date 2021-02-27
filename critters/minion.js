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

    this.healthbar = new HealthBar(this.theGame, this);

    //Stats
    this.health = minionStats.HEALTH;
    this.maxHealth = minionStats.HEALTH;
    this.regen = this.maxHealth/20;
    this.defense = minionStats.DEFENSE;
    this.attack = minionStats.ATTACK;
    this.agility = minionStats.AGILITY;
    this.intelligence = minionStats.INTELLIGENCE;
    this.combat = false;
    this.maxSpeed = this.agility*50;
    this.actionSpeed = 3/this.agility

    this.velocity = {
      x: 0,
      y: this.maxSpeed
    };

    this.baseWidth = 16;
    this.baseHeight = 16;
    this.radius = this.baseWidth/2*this.scale;
    this.center = {
      x: this.x + this.baseWidth*this.scale/2,
      y: this.y + this.baseHeight*this.scale/2
    }
    this.visualRadius = 200;
    this.isSelected = false;

    //i,j for cell, x,y for continuous position.
    this.myType = "minion";

    // Object.assign(this, this.name);
    this.timeBetweenUpdates = 1/this.agility;
    //this gives how long this minion will wait before moving.
    //note that its the inverse of the given speed stat.

    this.timer = new Timer();
    this.timeSinceUpdate = 0;

    this.actionTime = 0;
    this.regenTime = 0;
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

      //states are numbered by how "important" the state is,
      //so alive/dead is determined first, followed by "if attacking"
      //followed by "if gathering"...etc.
      //0-->dead,
      //1-->attacking enemy
      //2-->gathering resource.
      //3-->moving to target (moving),
      //4-->searching for enemy/resource (moving),
      //-1 --> means broken state!

      this.updateHealth();
      this.attackEnemy();

    };

    updateHealth() {
      if(this.health < 0) {
        this.state = 0;
        return; //break here NOW as we don't want to regen a minion.
      }
      if (this.regenTime >= 1) {
        this.regenTime = 0;
        //regen health.
        if(this.health < this.maxHealth) {
          this.health += this.regen;
          if (this.health > this.maxHealth) {
            this.health = this.maxHealth
          }
        }
      } else {
        this.regenTime += this.theGame.clockTick;
      }
    }

    reportZombieState() {
      if (this.actionTime >= this.actionSpeed) {
        //tell console that something went wrong.
        console.log(this + " has entered a broken state!");
        this.actionTime = 0;
      }
    }

    //yes this function is INCREDABLY over-engineered, this is to GURANTEE that minions will ALWAYS
    //in some 'state' and so can be handled as such. note that this.state is NOT the actual state
    //this.state is only the *representation* of the minion's state and thats all it CAN be.
    attackEnemy() {
      if(this.target && (this.target.state != 0 || this.target.health > 0)) {
        //we do still have a target to attack and it is alive.
        let ent = this.target;
        if((ent.state != 0 || ent.health > 0) && attack(this, ent)) {
          //the target is alive and in range.
          if (this.actionTime >= this.actionSpeed) {
            //we can attack them!
            var damage = (this.attack + randomInt(this.attack)) - ent.defense
            ent.health -= damage;
            this.theGame.addEntity(new Score(this.theGame, ent.x, ent.y - 10, damage, "Red"));
            this.actionTime = 0;
          } else {
            //we cannot attack them.
          }
        } else if ((ent.state != 0 || ent.health > 0) && !attack(this, ent)) {
          this.state = 3;
          //the target moved out of range, so change to hunt-mode.
        } else {
          //this should not EVER happen!
          this.state = "attack_method entity_handling failure";
        }
      } else if (!this.target || !(this.target.state != 0 || this.target.health > 0)){
        // the target has died (or broke)! find new target.
        this.target = null;
        this.state = 4;
      } else {
        //this should not EVER happen! this.target yet somehow not have valid stats.
        this.state = "attack_method targeting failed";
      }
    }

    drawMinimap(ctx, mmX, mmY) {
        //ctx.fillStyle = "Orange";
        //ctx.fillRect(mmX + this.myTile.myX / params.TILE_W_H, mmY + this.myTile.myY / params.TILE_W_H,
          //params.TILE_W_H / 8, params.TILE_W_H / 8);
    };

    drawMe(ctx) {
        if (this.state > 0 && this.state < 4) {
          this.myAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
        } else if (this.state == 4) {
          this.myBattleAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
        } else if (this.state == 0) {
          this.myDeadAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
        } else {
          ctx.fillText(this.myType + " has entered a broken state: see console for details", this.x, this.y);
          this.myDeadAnimator.drawFrame(this.theGame.clockTick, ctx, this.x - this.theGame.theCamera.x, this.y - this.theGame.theCamera.y, this.scale);
        }

        if(params.DEBUG || this.isSelected || this.state < 0 || this.state > 4) {
          ctx.strokeStyle = "red";
          ctx.beginPath();
          ctx.arc(this.center.x - this.camera.x, this.center.y - this.camera.y, this.radius, 0, 2*Math.PI);
          ctx.stroke();
        }

        this.healthbar.drawMe(ctx);
    };
};
