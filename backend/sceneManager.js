class SceneManager {
  constructor(theGame) {
      this.theGame = theGame;
      this.theGame.theSM = this;
      this.theGame.theCamera = this;

      this.theMiniMap = new MiniMap(this.theGame, 1024, 576, 256);
      this.theHud = new Hud(this.theGame, 1024, 0, 256);
      this.thePlayer = new Player(this.theGame, 100, 150, 5, 3, 0, 0);

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
      this.endMusic = 0;

      this.createLevel();
      ASSET_MANAGER.playAsset("./sounds/Mega_Man_7_Special_Item_2.mp3");
      // this.populateLevel();

      this.caveTimer = 0;
      this.dragonTimer = 59000;

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
  }

  startGame() {
    this.populateLevel();
  }

  populateLevel() {
    let castleX = params.PLAY_WIDTH/2 - 150 + randomInt(150);
    let castleY = params.PLAY_HEIGHT/2 - 150 + randomInt(150);

    this.x = castleX - params.CANVAS_WIDTH/2; //centering the camera on the castle.
    this.y = castleY - params.CANVAS_HEIGHT/2;

    this.theGame.spawnMe("castle", castleX, castleY);

    this.resources = new Resources(this.theGame, 8, 8, 3);

    this.theGame.spawnMe("minion", castleX + 80, castleY + 160);
    // this.theGame.spawnMe("minion", castleX + 80, castleY + 160);
    // this.theGame.spawnMe("minion", castleX + 80, castleY + 160);
    this.theGame.spawnMe("wolf", 550, 550);
    this.theGame.spawnMe("ogre", 350, 350);
    this.theGame.spawnMe("cave", 250, 250);
  }

  update() {
    params.DEBUG = document.getElementById("debug").checked;

    if (this.title && this.theGame.click) {
      if (this.theGame.mouse && this.theGame.mouse.y > 300 && this.theGame.mouse.y < 350) {
        this.title = false;
        this.startGame();
      }
    } else {
      this.theHud.updateMe();
      this.theMiniMap.updateMe();
      this.thePlayer.updateMe();
      this.updateCamera();
    }

    if(this.caveTimer >= 60000) {
      this.theGame.spawnMe("cave", params.PLAY_WIDTH/4 - 150 + randomInt(150), 1800);
      this.caveTimer = 0;
      //spawn cave every 30 second's
    } else {
      this.caveTimer += this.theGame.clockTick;
    }

    if(this.dragonTimer >= 60000) {
      this.theGame.entities.addEntity(new Dragon(params.PLAY_WIDTH/4 - 150 + randomInt(150), 1800));
      this.dragonTimer = -1;
      //spawn dragon at 2 minutes
    } else if (this.dragonTimer != -1) {
      this.dragonTimer += this.theGame.clockTick;
    }

    if(!this.theGame.theBase && !this.paused && !this.title) {
      this.theGame.notDead = false;
    } else {
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
  }

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
  }

  draw(ctx) {
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
      if (this.endMusic < 1) {
        ASSET_MANAGER.playAsset("./sounds/Mega_Man_7_Special_Item.mp3");
        this.endMusic++;
      }
      ctx.save();
      ctx.drawImage(this.startbg, 0, 0, 384, 216, 0, 0, 1280, 768);
      ctx.fillStyle = "White";
  		ctx.font = 64 + 'px "Press Start 2P"';
  		let title = "YOU'VE WON!";
  		let xCenter = (1280 - (ctx.measureText(title).width)) / 2;
  		ctx.fillText(title, xCenter, 125);
  		ctx.font = 48 + 'px "Press Start 2P"';
      ctx.fillStyle = this.theGame.mouse && this.theGame.mouse.y > 300 && this.theGame.mouse.y < 350 ? "Orange" : "White";
  		let subtitle = "Play Again?";
  		xCenter = (1280 - (ctx.measureText(subtitle).width)) / 2;
  		ctx.fillText(subtitle, xCenter, 350);
      ctx.restore();
    } else if (this.theGame.notDead){
      this.theMiniMap.drawMe(ctx);
      this.theHud.drawMe(ctx);
      this.thePlayer.drawMe(ctx);
    } else if (!this.theGame.notDead){
      this.theMiniMap.drawMe(ctx);
      this.theHud.drawMe(ctx);
      this.thePlayer.drawMe(ctx);
      if (this.endMusic < 1) {
        ASSET_MANAGER.playAsset("./sounds/Mega_Man_7_Special_Item.mp3");
        this.endMusic++;
      }
      ctx.save();
      ctx.drawImage(this.startbg, 0, 0, 384, 216, 0, 0, 1280, 768);
      ctx.fillStyle = "White";
  		ctx.font = 64 + 'px "Press Start 2P"';
  		let title = "YOU'VE LOST!!";
  		let xCenter = (1280 - (ctx.measureText(title).width)) / 2;
  		ctx.fillText(title, xCenter, 125);
  		ctx.font = 48 + 'px "Press Start 2P"';
      ctx.fillStyle = this.theGame.mouse && this.theGame.mouse.y > 300 && this.theGame.mouse.y < 350 ? "Orange" : "White";
  		let subtitle = "Play Again?";
  		xCenter = (1280 - (ctx.measureText(subtitle).width)) / 2;
  		ctx.fillText(subtitle, xCenter, 350);
      ctx.restore();
    }
  };
};
