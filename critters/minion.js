class Minion {
  constructor(theGame, x, y) {
    Object.assign(this, {theGame, x, y });
    this.theCamera = this.theGame.theSM; //theSM is the theGame's theCamera.
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/human_regular.png");
    this.thePlayer = this.theGame.theSM.thePlayer;

    // Different sprites for directions and interactions
    this.downAttack = ASSET_MANAGER.getAsset("./sprites/minion/down_attack.png");
    this.downWalk = ASSET_MANAGER.getAsset("./sprites/minion/down_walk.png");
    this.pickUp = ASSET_MANAGER.getAsset("./sprites/minion/pick_up.png");
    this.sideAttack = ASSET_MANAGER.getAsset("./sprites/minion/side_attack.png");
    this.sideWalk = ASSET_MANAGER.getAsset("./sprites/minion/side_walk.png");
    this.upAttack = ASSET_MANAGER.getAsset("./sprites/minion/up_attack.png");
    this.upWalk = ASSET_MANAGER.getAsset("./sprites/minion/up_walk.png");

    // Down
    this.downWalkAnim = new Animator(this.downWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.downAttackAnim = new Animator(this.downAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Left
    this.leftWalkAnim = new Animator(this.sideWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.leftAttackAnim = new Animator(this.sideAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Right
    this.rightWalkAnim = new Animator(this.sideWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.rightAttackAnim = new Animator(this.sideAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Up
    this.upWalkAnim = new Animator(this.upWalk, 0, 0, 64, 64, 6, 0.25, 0, false, true);
    this.upAttackAnim = new Animator(this.upAttack, 0, 0, 64, 64, 3, 0.25, 0, false, true);

    // Pick Up
    this.leftPick = new Animator(this.pickUp, 0, 0, 64, 64, 5, 0.25, 0, false, true);
    this.rightPick = new Animator(this.pickUp, 0, 0, 64, 64, 5, 0.25, 0, false, true);

    this.animations = [];
    this.loadAnimations();

    this.scale = 1;
    this.direction = 0; // 0 = left, 1 = right, 2 = up, 3 = down
    this.state = 4;
    this.priority = 0;

    this.healthbar = new HealthBar(this.theGame, this);
    this.target = null;

    //Stats
    this.health = minionStats.HEALTH;
    this.maxHealth = minionStats.HEALTH;
    this.regen = this.maxHealth/20;
    this.defense = minionStats.DEFENSE;
    this.attack = minionStats.ATTACK;
    this.gatherRate = 5
    this.agility = minionStats.AGILITY;
    this.intelligence = minionStats.INTELLIGENCE;
    this.combat = false;
    this.maxSpeed = this.agility*50;
    this.actionSpeed = 3/this.agility

    this.velocity = {
      x: 0,
      y: this.maxSpeed
    };

    this.baseWidth = 32;
    this.baseHeight = 32;
    this.radius = this.baseWidth/2*this.scale;
    this.center = {
      x: this.x + this.baseWidth*this.scale/2,
      y: this.y + this.baseHeight*this.scale/2
    }
    this.visualRadius = 50 + this.intelligence*50;
    this.reachRadius = this.radius*1.2;
    this.isSelected = false;

    //i,j for cell, x,y for continuous position.
    this.myType = "minion";
    this.myFaction = "friendly";

    // Object.assign(this, this.name);
    this.timeBetweenUpdates = 1/this.agility;
    //this gives how long this minion will wait before moving.
    //note that its the inverse of the given speed stat.

    this.timer = new Timer();
    this.timeSinceUpdate = 0;

    this.actionTime = 0;
    this.regenTime = 0;
    this.thePlayer = this.theCamera.thePlayer;
  };

  //the move-speed is still staggered a bit, that might be because of async
  //with the draw-method being called...may need to make the minion handle its own draw-update.
  updateMe() {
    this.elapsedTime += this.theGame.clockTick;
    this.actionTime += this.theGame.clockTick;
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

    this.updateHealth();

    if(this.state == 1) {
      this.state = this.attackEnemy();
    } else if (this.state == 2) {
      this.state = this.gatherResources();
    } else if (this.state == 3) {
      this.state = this.moveToTarget();
    } else if (this.state == 4 || !this.target) {
      this.state = this.findNewTarget();
    } else {
      //we entered a invalid state, see console for details on how or when we did that.
      this.debuggerFunction(true);
    }
  };

  debuggerFunction(findNewTarget) {
    let printTime = this.theGame.timer.lastTimestamp;
    if(this.waitTill == 0) {
      this.waitTill = printTime + 1000;
    } else if (this.waitTill < printTime) {
      this.waitTill = 0;
    } else if (!this.waitTill) {
      this.waitTill = 0;
    }
    if(findNewTarget) {
      //try to find new target to try to escape broken state.
      this.state = this.findNewTarget();
    }
  }

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
    if (this.actionTime >= this.actionSpeed*50) {
      //tell console that something went wrong.
      console.log(this + " has entered a broken state!");
      this.actionTime = 0;
    }
  }

  //yes this function is INCREDABLY over-engineered, this is to GURANTEE that minions will ALWAYS
  //in some 'state' and so can be handled as such. note that this.state is NOT the actual state
  //this.state is only the *representation* of the minion's state and thats all it CAN be.

  attackEnemy() {
    if(this.actionTime >= this.actionSpeed && this.target && (this.target.state != 0 || this.target.health > 0)) {
      //we do still have a target to attack and it is alive.
      let ent = this.target;
      if((ent.state != 0 || ent.health > 0) && reach(this, ent)) {
        //the target is alive and in range and we are ready to attack.
        var damage = (this.attack + randomInt(this.attack)) - ent.defense
        if(damage > 0) {
          ent.health -= damage; //don't heal the target by dealing negitive damage!
        }
        this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, damage, "red"));
        this.actionTime = 0;
        return 1;
      } else if ((ent.state != 0 || ent.health > 0) && !reach(this, ent)) {
        return 3;
        //the target moved out of reach, so change to searching state.
      } else {
        //this should not EVER happen!
        return "attack_method entity_handling failure";
      }
    } else if (!this.target || !(this.target.state != 0 || this.target.health < 0)){
      // the target has died (or broke)! find new target.
      this.target = null;
      return 4;
    } else if (this.actionTime < this.actionSpeed) {
      //do nothing cas we are not ready to attack yet.
    } else {
      //this should not EVER happen! this.target yet somehow not have valid stats.
      return "attack_method targeting failed";
    }
  }

  gatherResources() {
    if(this.actionTime >= this.actionSpeed && this.target && (this.target.state != 0 || this.target.health > 0)) {
      //we do still have a target to attack and it is alive.
      let ent = this.target;
      if((ent.state != 0 || ent.health > 0) && reach(this, ent)) {
        //the target is alive and in range and we are ready to attack.
        var gather = (this.gatherRate + randomInt(this.gatherRate))
        if(gather > 0) {
          if(ent instanceof Rock) {
            ent.health -= gather; //don't heal the target by dealing negitive gather!
            this.thePlayer.myRock += gather;
          } else if (ent instanceof Bush) {
            if(this.intelligence == 0 || ent.health/ent.maxHealth > 0.1) { //make smarter minions not kill the food!
              ent.health -= gather; //don't heal the target by dealing negitive gather!
              this.thePlayer.myFood += gather;
            } else if (ent.health/ent.maxHealth > 0.1 && this.intelligence > 0) {
              return 3; // the berries are low on food.
            }
          }
        }
        //this.theGame.addElement(new Score(this.theGame, ent.x, ent.y - 10, gather, "yellow"));
        this.actionTime = 0;
        return 2; //keep gathering.
      } else if ((ent.state != 0 || ent.health > 0) && !reach(this, ent)) {
        return 3;
        //the target moved out of range, so change to hunt-mode.
      } else {
        //this should not EVER happen!
        return "gather_method entity_handling failure";
      }
    } else if (!this.target || !(this.target.state != 0 || this.target.health < 0)){
      // the target has died (or broke)! find new target.
      this.target = null;
      return 4;
    } else if (this.actionTime < this.actionSpeed) {
      //do nothing cas we are not ready to attack yet.
      return 2;
    } else {
      //this should not EVER happen! this.target yet somehow not have valid stats.
      return "gather_method targeting failed";
    }
  }

  moveToTarget() {
    this.debuggerFunction(false);
    if(this.target) {
      let dist = distance(this, this.target);
      this.velocity = {
        x: (this.target.x - this.x)/dist * this.maxSpeed,
        y: (this.target.y - this.y) / dist * this.maxSpeed
      };

      this.x += this.velocity.x * this.theGame.clockTick;
      this.y += this.velocity.y * this.theGame.clockTick;
      this.facing = getFacing(this.velocity);

      if(reach(this, this.target)) {
        if(this.target.myFaction == "enemy") {
          return 1;
        } else if (this.target.myFaction == "resource"){
          return 2;
        } else {
          //just a location, find new location.
          return 4;
        }
      } else {
        //still not reached target so stay in current mode.
        return 3;
      }
    } else if (!this.target || !canSee(this, this.target)){
      //we lost the target or it went out of range.
      return 4;
    }
  }

  findNewTarget() {
    //first look around for enemys
    if(this.intelligence == 0 ) {
      //we are too dumb to attack anything.
    } else if (this.intelligence == 1){
      //we know to attack baddies and thats it.
      this.target = this.theGame.entities.filter(entity => {
        return (
          distance(this,entity) < this.visualRadius &&
          entity.myFaction == "enemy"
        );
      })
    } else if (this.intelligence > 1) {
      //we are smart enough to not attack enemys bigger then us.
      let attackWeight = 3;
      let defenseWeight = 2;
      let maxHealthWeight = 1;
      let totalWeight = attackWeight + defenseWeight + maxHealthWeight
      let that = this;
      this.target = this.theGame.entities.filter(entity => {
        return (
          distance(this,entity) < this.visualRadius &&
          entity.myFaction == "enemy" &&
          (
            ((entity.attack / that.attack) * that.attackWeight) +
            ((entity.defense / that.defense) * that.defenseWeight) +
            ((entity.maxHealth / that.maxHealth) * that.maxHealthWeight)
          ) / (that.totalWeight) > 1
          //if the target's average stats are too great relative to our own, don't try to engage it.
          //(and weighting some more then others), this will sum up to more then 3.
        );
      })
    }

    //either stop here because we have our target,
    //or search for resources.
    if(this.target) {
      return 3;
    }

    if(this.intelligence > 0) {
      //we want to ignore bush's with less then 1% health left if we are not braindead.
      this.target = this.theGame.entities.find(entity => {
        return (
          distance(this,entity) < this.visualRadius &&
          entity.myFaction == "resource" &&
          (entity.subHealth && entity.health/entity.maxHealth > 0.01) //don't over-harvest bushs
        )
      })
    } else {
      this.target = this.theGame.entities.find(entity => {
        return (
          distance(this,entity) < this.visualRadius &&
          entity.myFaction == "resource"
        ) //we are littearlly braindead and don't know better.
      })
    }

    //we don't see any enemys OR resources.
    if(this.target) {
      return 3;
    }

    this.target = pickLocation(this);

    if(this.target) {
      return 3;
    } else {
      return "findNewTarget_method coulden't find a target!";
    }
  }

  drawMinimap(ctx, mmX, mmY) {
    //ctx.fillStyle = "Orange";
    //ctx.fillRect(mmX + this.myTile.myX / params.TILE_W_H, mmY + this.myTile.myY / params.TILE_W_H,
      //params.TILE_W_H / 8, params.TILE_W_H / 8);
  };

  drawMe(ctx) {
    let temp;
    if (this.state == 3 || this.state == 4) {
      temp = 0;
    } else if (this.state == 1 || this.state == 2) {
      temp = 1;
    } else {
      temp = 0; //if dead or broken.
    }

    if (this.facing == 0) {
      this.direction = 2;
    } else if (this.facing < 4 && this.facing > 0) {
      this.direction = 1;
    } else if (this.facing == 4) {
      this.direction = 3
    } else if (this.facing > 4) {
      this.direction = 0;
    }

    let tempAdjust = 70; //I'm not sure why the sprites are so off-center, but I'm doing this for now.

    var w = this.animations[temp][this.direction].width;
        if (this.direction == 1) {
          ctx.save();
          ctx.scale(-1, 1);
          switch (temp) {
            //Walking
            case 0: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                            -(this.center.x - this.theGame.theCamera.x) - w,
                            this.y - this.theGame.theCamera.y,
                            this.scale, 4);
                                                                  break;
            //Attacking
            case 1: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                            -(this.center.x - this.theGame.theCamera.x) - w,
                            this.y - this.theGame.theCamera.y,
                            this.scale, 2);
                                                                  break;
          }
          ctx.restore();
        } else {
          switch (temp) {
            case 0: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                            this.center.x - this.theGame.theCamera.x,
                            this.center.y - this.theGame.theCamera.y,
                            this.scale, 4);
                                                                  break;
            case 1: this.animations[temp][this.direction].drawLongFrame(this.theGame.clockTick, ctx,
                            this.center.x - this.theGame.theCamera.x,
                            this.center.y - this.theGame.theCamera.y,
                            this.scale, 2);
                                                                  break;
          }
        }
        this.healthbar.drawMe(ctx);

    if(params.DEBUG || this.isSelected || this.state < 0 || this.state > 4) {
      ctx.save();
      ctx.strokeStyle = "red";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.radius, 0, 2*Math.PI);
      ctx.stroke();

      ctx.strokeStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.center.x - this.theCamera.x, this.center.y - this.theCamera.y, this.visualRadius, 0, 2*Math.PI);
      ctx.stroke();
      ctx.restore();
    }

    this.healthbar.drawMe(ctx);
  };

  loadAnimations() {
    this.animations.push([]);
    this.animations.push([]);

    // Idle/Walking
    this.animations[0].push(this.leftWalkAnim);
    this.animations[0].push(this.rightWalkAnim);
    this.animations[0].push(this.upWalkAnim);
    this.animations[0].push(this.downWalkAnim);

    // Attacking
    this.animations[1].push(this.leftAttackAnim);
    this.animations[1].push(this.rightAttackAnim);
    this.animations[1].push(this.upAttackAnim);
    this.animations[1].push(this.downAttackAnim);
  };

  drawMinimap(ctx, mmX, mmY, mmW, mmH) {
    let x = mmX + (this.center.x)*(mmW/params.PLAY_WIDTH);
    let y = mmY + (this.center.y)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "orange";
    ctx.strokeRect(x, y, 1, 1);
    ctx.restore();
  }
};
