class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this; //should rename to SM I think.

        this.x = 0;
        this.y = 0;

        this.maxCamSpeed = 45;
        this.baseCamSpeed = 0;
        this.acceleration = 2/3; //accelerationFactor.

        this.moveRight = this.baseCamSpeed;
        this.moveDown = this.baseCamSpeed;
        this.moveLeft = this.baseCamSpeed;
        this.moveUp = this.baseCamSpeed;

        // this.minimap = new MiniMap(this.game, 1024, 576, 256);
        // this.ui = new UI(this.game, 1024, 0, 256);
        this.theHud = this.game.theHud;
        // this.thePlayer = new Player(this.game, 100, 150, 10, 5, 0, 0);

        this.generateLevel();
        this.populateLevel();
    };

    generateLevel() {
        this.game.entities = [];

      	let corners = new Grasscorner(this.game, 0, 0);
      	let vertwalls = new Vertwall(this.game, 0, params.TILE_W_H);
      	let horiwalls = new Horiwall(this.game, params.TILE_W_H, 0);
      	let intGrass = new InteriorGrass(this.game, params.TILE_W_H, params.TILE_W_H);
      	let resources = new Resources(this.game, params.TILE_W_H, params.TILE_W_H);

        this.game.addBackgroundEntity(corners);
        this.game.addBackgroundEntity(vertwalls);
        this.game.addBackgroundEntity(horiwalls);
        this.game.addBackgroundEntity(intGrass);
    };

    populateLevel() {

      let resources = new Resources(this.game, params.TILE_W_H, params.TILE_W_H);
      this.game.addBackgroundEntity(resources);

      this.game.spawnMe("base",
        randomInt(100) + 200, randomInt(100) + 200
      );

      // this.game.addEntity(this.minimap);
      // this.game.addEntity(this.ui);
      // this.game.addEntity(this.thePlayer);
      // this.game.spawnMe("minion", 0, 0);
      // this.game.spawnMe("wolf", 800, 0);
    }

    update() {
        // params.DEBUG = document.getElementById("debug").checked;
        //I do like debug being outside the game itself instead of how I have it.
        //, but for now I'm removing this.

        let midpoint = params.CANVAS_WIDTH / 2;

        var mapBorder = 20;

        //Check for play area edge
        var left = this.game.left && this.x > -mapBorder;
        var right = this.game.right && this.x < params.PLAY_WIDTH - params.CANVAS_WIDTH + mapBorder;
        var up = this.game.up && this.y > -mapBorder;
        var down = this.game.down && this.y < params.PLAY_HEIGHT - params.CANVAS_HEIGHT + mapBorder;

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

    draw(ctx) {
      if(this.game.theBase) {
        // this.minimap.drawMe(ctx);
        // this.ui.drawMe(ctx);
        this.theHud.drawMe(ctx);
        // this.thePlayer.drawMe(ctx);
      } else {
        ctx.clearRect(0, 0,
          params.CANVAS_WIDTH, params.CANVAS_HEIGHT
        )

        ctx.fillText("YOU DIED", 150, 50);
      }
    };
};
