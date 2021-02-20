class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        // this.minimap = new MiniMap(this.game, 1024, 576, 256);
        // this.ui = new UI(this.game, 1024, 0, 256);
        this.theHud = this.game.theHud;
        // this.thePlayer = new Player(this.game, 100, 150, 10, 5, 0, 0);

        this.loadLevel();
        this.notDead = true;
    };

    loadLevel() {
        this.game.entities = [];

      	let corners = new Grasscorner(this.game, 0, 0);
      	let vertwalls = new Vertwall(this.game, 0, params.TILE_W_H);
      	let horiwalls = new Horiwall(this.game, params.TILE_W_H, 0);
      	let intGrass = new InteriorGrass(this.game, params.TILE_W_H, params.TILE_W_H);
      	let resources = new Resources(this.game, params.TILE_W_H, params.TILE_W_H);

        this.game.addEntity(corners);
        this.game.addEntity(vertwalls);
        this.game.addEntity(horiwalls);
        this.game.addEntity(intGrass);
        this.game.addEntity(resources);
        this.game.theBase = new HomeBase(this.game, 150, 150, 0.15);

        // this.game.addEntity(this.minimap);
        // this.game.addEntity(this.ui);
        // this.game.addEntity(this.thePlayer);
        // this.game.spawnMe("minion", 0, 0);
      	// this.game.spawnMe("wolf", 800, 0);
    };

    update() {
        // params.DEBUG = document.getElementById("debug").checked;
        //I do like debug being outside the game itself instead of how I have it.
        //, but for now I'm removing this.

        const TICK = this.game.clockTick;

        let midpoint = params.CANVAS_WIDTH / 2;

        //Check for play area edge
        if (this.game.left && this.x > 0) {
            this.x -= 10;
        }
        if (this.game.right && this.x < params.CANVAS_WIDTH - 10) {
            this.x += 10;
        }
        if (this.game.up && this.y > 3) {
            this.y -= 10;
        }
        if (this.game.down && this.y < params.CANVAS_HEIGHT - 10) {
            this.y += 10;
        }
    };

    draw(ctx) {
      if(this.notDead) {
        // this.minimap.drawMe(ctx);
        // this.ui.drawMe(ctx);
        this.theHud.drawMe(ctx);
        // this.thePlayer.drawMe(ctx);
      } else {
        ctx.clearRect(0,0,params.CANVAS_WIDTH,params.CANVAS_HEIGHT)
        ctx.fillText("YOU DIED", 150, 50);
      }
    };
};
