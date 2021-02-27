class SceneManager {
  constructor(theGame) {
      this.theGame = theGame;
      this.theGame.theSM = this;
      this.theGame.theCamera = this;

      this.x = 0;
      this.y = 0;

      this.theMiniMap = new MiniMap(this.theGame, 1024, 576, 256);
      this.theHud = new Hud(this.theGame, 1024, 0, 256);
      this.thePlayer = new Player(this.theGame, 100, 150, 10, 5, 0, 0);

      this.createLevel();
      this.populateLevel();
  };

  createLevel(){
    //let castle = new HomeBase(theGameEngine, 500, 300, 430, 461);
    let corners = new Grasscorner(this.theGame, 0, 0);
    let vertwalls = new Vertwall(this.theGame, 0, params.TILE_W_H);
    let horiwalls = new Horiwall(this.theGame, params.TILE_W_H, 0);
    let intGrass = new InteriorGrass(this.theGame, params.TILE_W_H, params.TILE_W_H);
    let resources = new Resources(this.theGame, params.TILE_W_H, params.TILE_W_H);

    this.theGame.addEntity(corners);
    this.theGame.addEntity(vertwalls);
    this.theGame.addEntity(horiwalls);
    this.theGame.addEntity(intGrass);
    this.theGame.addEntity(resources);
  }

  populateLevel(){
    this.theGame.spawnMe("castle", 150, 150);
    this.theGame.spawnMe("minion", 0, 0);
    this.theGame.spawnMe("minion", 0, 0);
    this.theGame.spawnMe("minion", 0, 0);
    this.theGame.spawnMe("minion", 0, 0);
    this.theGame.spawnMe("wolf", 800, 0);
    this.theGame.spawnMe("wolf", 0, 400);
  }

  update() {
    params.DEBUG = document.getElementById("debug").checked;

    this.theHud.updateMe();
    this.theMiniMap.updateMe();
    this.thePlayer.updateMe();

    this.updateCamera();
  };

  updateCamera(){
    //Check for play area edge
    if (this.theGame.left && this.x > 0) {
        this.x -= 10;
    }
    if (this.theGame.right && this.x < params.CANVAS_WIDTH - 10) {
        this.x += 10;
    }
    if (this.theGame.up && this.y > 3) {
        this.y -= 10;
    }
    if (this.theGame.down && this.y < params.CANVAS_HEIGHT - 10) {
        this.y += 10;
    }
  }

  draw(ctx) {
    this.theMiniMap.drawMe(ctx);
    this.theHud.drawMe(ctx);
    this.thePlayer.drawMe(ctx);
  };
};
