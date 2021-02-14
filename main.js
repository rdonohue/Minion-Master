var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/human_regular.png");
ASSET_MANAGER.queueDownload("./sprites/wolfsheet1.png");
ASSET_MANAGER.queueDownload("./sprites/castle.png");
ASSET_MANAGER.queueDownload("./sprites/ground_sprites.png");
ASSET_MANAGER.queueDownload("./sprites/trees_stones_bushes.png");
ASSET_MANAGER.queueDownload("./sprites/button_Attack.png");
ASSET_MANAGER.queueDownload("./sprites/button_Agi.png");
ASSET_MANAGER.queueDownload("./sprites/button_Def.png");
ASSET_MANAGER.queueDownload("./sprites/button_Health.png");
ASSET_MANAGER.queueDownload("./sprites/button_Int.png");

ASSET_MANAGER.downloadAll(function () {
	var gameEngine = new GameEngine();

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	//let castle = new HomeBase(gameEngine, 500, 300, 430, 461);
	let corners = new Grasscorner(gameEngine, 0, 0);
	let vertwalls = new Vertwall(gameEngine, 0, params.TILE_W_H);
	let horiwalls = new Horiwall(gameEngine, params.TILE_W_H, 0);
	let intGrass = new InteriorGrass(gameEngine, params.TILE_W_H, params.TILE_W_H);
	let resources = new Resources(gameEngine, params.TILE_W_H, params.TILE_W_H);

	// let minimap = new MiniMap(gameEngine, 1024, 576, 256);

	gameEngine.init(ctx, params.CANVAS_WIDTH / 128,
		 							params.CANVAS_HEIGHT / 128,
									params.TILE_W_H * 2);
  ctx.imageSmoothingEnabled = false;

	gameEngine.addEntity(corners);
	gameEngine.addEntity(vertwalls);
	gameEngine.addEntity(horiwalls);
	gameEngine.addEntity(intGrass);
	gameEngine.addEntity(resources);

  //in order:
	//spawn x,y
	//intelligence NOT ACTUALLY IMPLEMENTED!
	//speed
	gameEngine.spawnMe("minion", 0, 0);
	gameEngine.spawnMe("wolf", 800, 0);
	//gameEngine.createANDSpawnEntity(3, 3, "minion");
	//gameEngine.createANDSpawnEntity(5, 4, "minion");
	// gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD*4,"minion");
	// gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD*8,"minion");
	// gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD*16,"minion");

	//gameEngine.createANDSpawnEntity(2, 4, "wolf");
	// gameEngine.createANDSpawnEntity(2,4, params.BASE_SPD*32,"wolf");
	gameEngine.start();
});
