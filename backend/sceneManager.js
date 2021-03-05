class SceneManager {
    constructor(game) {
        this.game = game;
        this.game.camera = this;
        this.x = 0;
        this.y = 0;

        this.minimap = new MiniMap(this.game, 1024, 576, 256);
        this.ui = new UI(this.game, 1024, 0, 256);
        this.hud = new HUD(this.game);
        this.thePlayer = new Player(this.game, 100, 150, 10, 5, 0, 0);
        this.loadLevel();
    };

    loadLevel() {
        this.game.entities = [];
        this.x = 0;

        //let castle = new HomeBase(gameEngine, 500, 300, 430, 461);
      	let corners = new Grasscorner(this.game, 0, 0);
      	let vertwalls = new Vertwall(this.game, 0, params.TILE_W_H);
      	let horiwalls = new Horiwall(this.game, params.TILE_W_H, 0);
      	let intGrass = new InteriorGrass(this.game, params.TILE_W_H, params.TILE_W_H);
      	let resources = new Resources(this.game, params.TILE_W_H, params.TILE_W_H);
        let base = new HomeBase(this.game, 500, 400);
        this.game.addEntity(corners);
        this.game.addEntity(vertwalls);
        this.game.addEntity(horiwalls);
        this.game.addEntity(intGrass);
        this.game.addEntity(resources);

        this.game.addEntity(base);
        this.game.addEntity(this.minimap);
        this.game.addEntity(this.ui);
        this.game.addEntity(this.ui.towerButton);
        this.game.addEntity(this.hud);
        this.game.addEntity(this.thePlayer);
        this.game.spawnMe("minion", 0, 0);
      	this.game.spawnMe("wolf", 200, 0);
        this.game.spawnMe("wolf", 0, 200);
        //this.game.spawnMe("dragon", 1200, 590);
    };

    update() {
        params.DEBUG = document.getElementById("debug").checked;

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
            this.minimap.drawMe(ctx);
            this.ui.drawMe(ctx);
            this.hud.drawMe(ctx);
            this.thePlayer.drawMe(ctx);
    };
};
