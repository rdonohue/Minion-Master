class SceneManager {
  constructor(theGame) {
      Object.assign(this, { theGame });
      this.theGame.theSM = this;
      this.theGame.theCamera = this;

      this.theMiniMap = new MiniMap(this.theGame, 1024, 576, 256);
      this.theHud = new Hud(this.theGame, 1024, 0, 256);
      this.thePlayer = new Player(this.theGame, 200, 200, 3, 2, 0, 0);

      // Credits to: https://vnitti.itch.io/grassy-mountains-parallax-background
      this.startbg = ASSET_MANAGER.getAsset("./sprites/start_bg.png");

      this.maxCamSpeed = 45;
      this.baseCamSpeed = 0;
      this.acceleration = 2/3; //accelerationFactor.

      this.moveRight = this.baseCamSpeed;
      this.moveDown = this.baseCamSpeed;
      this.moveLeft = this.baseCamSpeed;
      this.moveUp = this.baseCamSpeed;
      this.paused = false;
      this.title = true;
      this.victory = false;
      this.gameover = false;
      this.endMusic = true;
      this.score = 0;


      this.createLevel();
      ASSET_MANAGER.adjustVolume(0.25);
      this.startMusic = new Audio("./sounds/Mega_Man_7_Special_Item_2.mp3");
      this.startMusic.volume = 0.2;

      this.caveTimer = -15; //give player extra 15 seconds
      this.dragonTimer = -30; //give player extra 30 seconds
      this.dragonSpawnRate = 90;
      this.caveSpawnRate = 30

      this.start = false;
  };

  createLevel() {
    //let castle = new HomeBase(theGameEngine, 500, 300, 430, 461);
    let corners = new Grasscorner(this.theGame, 0, 0);
    let vertwalls = new Vertwall(this.theGame, 0, params.TILE_W_H);
    let horiwalls = new Horiwall(this.theGame, params.TILE_W_H, 0);
    let intGrass = new InteriorGrass(this.theGame, params.TILE_W_H, params.TILE_W_H);

    this.theGame.addElement(corners);
    this.theGame.addElement(vertwalls);
    this.theGame.addElement(horiwalls);
    this.theGame.addElement(intGrass);
  };

  startGame(start) {
    if (start) {           // New Game
      this.title = false;
      this.startMusic.play();
      this.populateLevel();
    } else {               // Restart
      this.theGame.notDead = true;
      this.victory = false;
      this.theGame.clearEntities();
      this.thePlayer = new Player(this.theGame, 200, 200, 3, 2, 0, 0);
      this.caveTimer = -15; //give player extra 15 seconds
      this.dragonTimer = -30; //give player extra 30 seconds
      this.dragonSpawnRate = 90;
      this.caveSpawnRate = 30
      this.endMusic = true;
      this.score = 0;
      this.gameover = false;
      this.startMusic.play();
      this.populateLevel();
    }

  };

  populateLevel() {
    let castleX = params.PLAY_WIDTH/2 - 150 + randomInt(150);
    let castleY = params.PLAY_HEIGHT/2 - 150 + randomInt(150);

    this.x = castleX - params.CANVAS_WIDTH/2; //centering the camera on the castle.
    this.y = castleY - params.CANVAS_HEIGHT/2;

    this.theGame.spawnMe("castle", castleX, castleY);

    this.resources = new Resources(this.theGame, 8, 8, 3);

    this.theGame.spawnMe("wolf", 550, 550);
    this.theGame.spawnMe("wolf", 1000, 1200);
  };

  update() {
    if(params.DEBUG) {
      console.log(Math.round(this.dragonTimer) + ", " + Math.round(this.caveTimer));
    }
    params.DEBUG = document.getElementById("debug").checked;
    if (this.title && this.theGame.click) {
      if (this.theGame.mouse && this.theGame.mouse.y > 300 && this.theGame.mouse.y < 350) {
        this.startGame(true);
      }
    } else if ((!this.theGame.notDead || this.victory) && this.theGame.click) {
      if (this.theGame.mouse && this.theGame.mouse.y > 650 && this.theGame.mouse.y < 700) {
        this.startGame(false);
      }
    } else {
      this.theHud.updateMe();
      this.theMiniMap.updateMe();
      this.thePlayer.updateMe();
      this.updateCamera();
    }

    if(this.caveTimer >= this.caveSpawnRate) {
      this.theGame.spawnMe("cave", 150 + randomInt(150), 300);
      this.caveTimer = 0;
      //spawn cave every 30 second's
    }
    this.caveTimer += this.theGame.clockTick;

    // Every 2 minutes, a dragon will spawn if not already present.
    if(!this.theGame.entities.find(entity => entity.myType == "dragon")) {
      if (this.dragonTimer >= this.dragonSpawnRate) {
        this.theGame.spawnMe("dragon", params.PLAY_WIDTH - 150 - randomInt(150), 300);
        this.dragonTimer = 0
      }
    } else {
      this.dragonTimer = 0;
    }
    this.dragonTimer += this.theGame.clockTick;

    if(this.theGame.theBase && this.theGame.theBase.health <= 0) {
      this.theGame.notDead = false;
    } else if (this.theGame.theBase && this.theGame.theBase.health > 0){
      this.theGame.notDead = true;
    }
  };

  updateCamera() {
    var mapBorder = 0;

    //Check for play area edge
    var left = this.theGame.left && this.x > -mapBorder;
    var right = this.theGame.right && this.x < params.PLAY_WIDTH - params.CANVAS_WIDTH + mapBorder;
    var up = this.theGame.up && this.y > -mapBorder;
    var down = this.theGame.down && this.y < params.PLAY_HEIGHT - params.CANVAS_HEIGHT + mapBorder;

    if (left) {
      this.x -= this.moveLeft;
      this.moveLeft += this.acceleration;
    } else {
      this.moveLeft = this.baseCamSpeed;
    }
    if (right) {
        this.x += this.moveRight;
        this.moveRight += this.acceleration;
    } else {
      this.moveRight = this.baseCamSpeed;
    }
    if (up) {
        this.y -= this.moveUp;
        this.moveUp += this.acceleration;
    } else {
        this.moveUp = this.baseCamSpeed;
    }
    if (down) {
        this.y += this.moveDown;
        this.moveDown += this.acceleration;
    } else {
        this.moveDown = this.baseCamSpeed;
    }

    if(this.x < -mapBorder) {
      this.x = -mapBorder;
      this.moveLeft = this.baseCamSpeed;
    } else if (this.x > params.PLAY_WIDTH - params.CANVAS_WIDTH + mapBorder) {
      this.x = params.PLAY_WIDTH - params.CANVAS_WIDTH + mapBorder;
      this.moveRight = this.baseCamSpeed;
    }

    if(this.y < -mapBorder) {
      this.y = -mapBorder;
      this.moveUp = this.baseCamSpeed;
    } else if (this.y > params.PLAY_HEIGHT - params.CANVAS_HEIGHT + mapBorder) {
      this.y = params.PLAY_HEIGHT - params.CANVAS_HEIGHT + mapBorder;
      this.moveDown = this.baseCamSpeed;
    }
  };

  drawCamera(ctx, mmX, mmY, mmW, mmH) {
    //leftEdgeOfMapOnMiniMap = mmX;
    //topEdgeOfMapOnMiniMap = mmY;
    //we want to find the location of the 4 sides of the camera relative to the maps
    //dimensions and then translate and down-scale it to the mini-map's dimensions.
    let leftside = mmX + (this.x)*(mmW/params.PLAY_WIDTH);
    let rightside = mmX + (this.x+params.CANVAS_WIDTH)*(mmW/params.PLAY_WIDTH);
    let topside = mmY + (this.y)*(mmH/params.PLAY_HEIGHT);
    let bottomside = mmY + (this.y+params.CANVAS_HEIGHT)*(mmH/params.PLAY_HEIGHT);
    ctx.save();
    ctx.strokeStyle = "white";
    ctx.strokeRect(leftside, topside, rightside - leftside, bottomside - topside);
    ctx.restore();
  };


  /*
  * Helper function to determine the win or loss title.
  */
  endGame(ctx, title) {
    if (this.endMusic) {
      ASSET_MANAGER.playAsset("./sounds/Mega_Man_7_Special_Item.mp3");
      this.endMusic = false;
    }
    ctx.save();
    ctx.drawImage(this.startbg, 0, 0, 384, 216, 0, 0, 1280, 768);
    ctx.fillStyle = "White";
    ctx.font = 64 + 'px "Press Start 2P"';
    let xCenter = (1280 - (ctx.measureText(title).width)) / 2;
    ctx.fillText(title, xCenter, 125);

    this.generateScore(ctx);

    ctx.font = 48 + 'px "Press Start 2P"';
    ctx.fillStyle = this.theGame.mouse && this.theGame.mouse.y > 650 && this.theGame.mouse.y < 700 ? "Orange" : "White";
    let subtitle = "Play Again?";
    xCenter = (1280 - (ctx.measureText(subtitle).width)) / 2;
    ctx.fillText(subtitle, xCenter, 700);
    ctx.restore();
  }

  /*
  * Helper function to generate the total score and game statistics.
  * This function is only called from endGame(ctx, title).
  */
  generateScore(ctx) {
    let statYCenter = 325;
    const increment = 30;
    let title = "Score"
    ctx.fillStyle = "White";
    ctx.font = 48 + 'px "Press Start 2P"';
    let xCenter = (1280 - (ctx.measureText(title).width)) / 2;
    ctx.fillText(title, xCenter, 225);

    ctx.font = 32 + 'px "Press Start 2P"';

    if (!this.gameover){
      this.score = Math.round(this.theGame.getScore());
    }
    xCenter = (1280 - (ctx.measureText(this.score).width)) / 2;
    ctx.fillText(this.score, xCenter, 275);
    ctx.font = 24 + 'px "Press Start 2P"';
    //Total Minion stat
    xCenter = (960 - (ctx.measureText("Total Minions:").width)) / 2;
    ctx.fillText("Total Minions: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.minionCount).width)) / 2;
    ctx.fillText(this.theGame.minionCount, xCenter, statYCenter);
    statYCenter += increment;
    //Dead Minion stat
    xCenter = (960 - (ctx.measureText(" Dead Minions:").width)) / 2;
    ctx.fillText(" Dead Minions: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.deadMinions).width)) / 2;
    ctx.fillText(this.theGame.deadMinions, xCenter, statYCenter);
    statYCenter += increment;
    //Total Tower stat
    xCenter = (960 - (ctx.measureText(" Total Towers:").width)) / 2;
    ctx.fillText(" Total Towers: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.towerCount).width)) / 2;
    ctx.fillText(this.theGame.towerCount, xCenter, statYCenter);
    statYCenter += increment;
    //Dead Tower stat
    xCenter = (960 - (ctx.measureText("  Dead Towers:").width)) / 2;
    ctx.fillText("  Dead Towers: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.deadTowers).width)) / 2;
    ctx.fillText(this.theGame.deadTowers, xCenter, statYCenter);
    statYCenter += increment;
    //Dead Wolves stat
    xCenter = (960 - (ctx.measureText("  Dead Wolves:").width)) / 2;
    ctx.fillText("  Dead Wolves: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.deadWolves).width)) / 2;
    ctx.fillText(this.theGame.deadWolves, xCenter, statYCenter);
    statYCenter += increment;
    //Dead Ogres stat
    xCenter = (960 - (ctx.measureText("   Dead Ogres:").width)) / 2;
    ctx.fillText("   Dead Ogres: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.deadOgres).width)) / 2;
    ctx.fillText(this.theGame.deadOgres, xCenter, statYCenter);
    statYCenter += increment;
    //Dead Dragon stat
    xCenter = (960 - (ctx.measureText(" Dead Dragons:").width)) / 2;
    ctx.fillText(" Dead Dragons: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.deadDragon).width)) / 2;
    ctx.fillText(this.theGame.deadDragon, xCenter, statYCenter);
    statYCenter += increment;
    //Total rocks
    xCenter = (960 - (ctx.measureText("  Total Rocks:").width)) / 2;
    ctx.fillText("  Total Rocks: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.totalRock).width)) / 2;
    ctx.fillText(this.theGame.totalRock, xCenter, statYCenter);
    statYCenter += increment;
    //Total food
    xCenter = (960 - (ctx.measureText("   Total Food:").width)) / 2;
    ctx.fillText("  Total Food: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.totalFood).width)) / 2;
    ctx.fillText(this.theGame.totalFood, xCenter, statYCenter);
    statYCenter += increment;
    //Spent rocks
    xCenter = (960 - (ctx.measureText("   Spent Rock:").width)) / 2;
    ctx.fillText("  Spent Rock: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.spentRock).width)) / 2;
    ctx.fillText(this.theGame.spentRock, xCenter, statYCenter);
    statYCenter += increment;
    //Spent Food
    xCenter = (960 - (ctx.measureText("   Spent Food:").width)) / 2;
    ctx.fillText("  Spent Food: ", xCenter, statYCenter);
    xCenter = (1600 - (ctx.measureText(this.theGame.spentFood).width)) / 2;
    ctx.fillText(this.theGame.spentFood, xCenter, statYCenter);
    statYCenter += increment;
    statYCenter = 325;

    this.gameover = true;
  }

  draw(ctx) {
    let endTitle = this.victory && this.theGame.notDead ? "YOU'VE WON!" : "YOU'VE LOST!!"

    if (this.title) {
      ctx.save();
      ctx.drawImage(this.startbg, 0, 0, 384, 216, 0, 0, 1280, 768);
      ctx.fillStyle = "White";
  		ctx.font = 64 + 'px "Press Start 2P"';
  		let title = "MINION MASTER";
  		let xCenter = (1280 - (ctx.measureText(title).width)) / 2;
  		ctx.fillText(title, xCenter, 125);
  		ctx.font = 48 + 'px "Press Start 2P"';
      ctx.fillStyle = this.theGame.mouse && this.theGame.mouse.y > 300 && this.theGame.mouse.y < 350 ? "Orange" : "White";
  		let subtitle = "Start Game";
  		xCenter = (1280 - (ctx.measureText(subtitle).width)) / 2;
  		ctx.fillText(subtitle, xCenter, 350);
      ctx.restore();
    } else if (this.victory) {
      this.endGame(ctx, endTitle);
    } else if (!this.theGame.notDead) {
      this.endGame(ctx, endTitle);
    } else {
      this.theMiniMap.drawMe(ctx);
      this.theHud.drawMe(ctx);
      this.thePlayer.drawMe(ctx);
    }
  };

};
