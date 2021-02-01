var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/human_regular.png");
ASSET_MANAGER.queueDownload("./sprites/wolfsheet1.png");
ASSET_MANAGER.queueDownload("./sprites/castle.png");
ASSET_MANAGER.queueDownload("./sprites/ground_sprites.png");
ASSET_MANAGER.queueDownload("./sprites/trees_stones_bushes.png");

ASSET_MANAGER.downloadAll(function () {
	var gameEngine = new GameEngine();

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	let castle = new HomeBase(gameEngine, 500, 300, 430, 461);
	let corners = new Grasscorner(gameEngine, 0, 0);
	let vertwalls = new Vertwall(gameEngine, 0, params.TILE_W_H);
	let horiwalls = new Horiwall(gameEngine, params.TILE_W_H, 0);
	let intGrass = new InteriorGrass(gameEngine, params.TILE_W_H, params.TILE_W_H);
	let resources = new Resources(gameEngine, 0, 0);

	gameEngine.init(ctx, 15, 12, 64);
  ctx.imageSmoothingEnabled = false;

	gameEngine.addEntity(corners);
	gameEngine.addEntity(vertwalls);
	gameEngine.addEntity(horiwalls);
	gameEngine.addEntity(intGrass);
	gameEngine.addEntity(castle);
	gameEngine.addEntity(resources);

  	//in order:
	//spawn x,y
	//intelligence NOT ACTUALLY IMPLEMENTED!
	//speed
	gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD/2,"minion");
	gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD,"minion");
	gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD*2,"minion");
	gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD*4,"minion");
	gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD*8,"minion");
	gameEngine.createANDSpawnEntity(2,2, params.BASE_SPD*16,"minion");

	gameEngine.createANDSpawnEntity(2,4, params.BASE_SPD*8,"wolf");
	gameEngine.createANDSpawnEntity(2,4, params.BASE_SPD*32,"wolf");

	gameEngine.start();
});
