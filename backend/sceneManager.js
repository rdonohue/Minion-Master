class SceneManager {
  constructor(theGame) {
      this.theGame = theGame;
      this.theGame.theSM = this;
      this.theGame.theCamera = this;

      this.theMiniMap = new MiniMap(this.theGame, 1024, 576, 256);
      this.theHud = new Hud(this.theGame, 1024, 0, 256);
      this.thePlayer = new Player(this.theGame, 100, 150, 10, 5, 0, 0);

      this.maxCamSpeed = 45;
      this.baseCamSpeed = 0;
      this.acceleration = 2/3; //accelerationFactor.

      this.moveRight = this.baseCamSpeed;
      this.moveDown = this.baseCamSpeed;
      this.moveLeft = this.baseCamSpeed;
      this.moveUp = this.baseCamSpeed;

      this.createLevel();
      this.populateLevel();
  };

  createLevel(){
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

  populateLevel(){
    let castleX = params.PLAY_WIDTH/2 - 150 + randomInt(150);
    let castleY = params.PLAY_HEIGHT/2 - 150 + randomInt(150);

    this.x = castleX - params.CANVAS_WIDTH/2; //centering the camera on the castle.
    this.y = castleY - params.CANVAS_HEIGHT/2;

    this.theGame.spawnMe("castle", castleX, castleY);

    //this.resources = new Resources(this.theGame, 15, 15, 3);

    this.theGame.spawnMe("minion", castleX + 80, castleY + 160);
    // this.theGame.spawnMe("minion", castleX + 80, castleY + 160);
    // this.theGame.spawnMe("minion", castleX + 80, castleY + 160);
    this.theGame.spawnMe("wolf", 150, 150);
    this.theGame.spawnMe("wolf", 350, 350);
    this.theGame.spawnMe("wolf", 150, 150);
    this.theGame.spawnMe("wolf", 350, 350);
  }

  update() {
    params.DEBUG = document.getElementById("debug").checked;

    this.theHud.updateMe();
    this.theMiniMap.updateMe();
    this.thePlayer.updateMe();

    this.updateCamera();
  };

  updateCamera(){
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
    this.theMiniMap.drawMe(ctx);
    this.theHud.drawMe(ctx);
    this.thePlayer.drawMe(ctx);
  };
};
