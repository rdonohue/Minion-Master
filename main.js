var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/human_regular.png");
ASSET_MANAGER.queueDownload("./sprites/wolfsheet1.png");
ASSET_MANAGER.queueDownload("./sprites/castle.png");
ASSET_MANAGER.queueDownload("./sprites/ogres.png");
ASSET_MANAGER.queueDownload("./sprites/cave.png");
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

	let castle = new HomeBase(gameEngine, 400, 525, 430, 461);
	let corners = new Grasscorner(gameEngine, 0, 0);
	let vertwalls = new Vertwall(gameEngine, 0, params.TILE_W_H);
	let horiwalls = new Horiwall(gameEngine, params.TILE_W_H, 0);
	let intGrass = new InteriorGrass(gameEngine, params.TILE_W_H, params.TILE_W_H);
	let resources = new Resources(gameEngine, params.TILE_W_H, params.TILE_W_H);

	let minimap = new MiniMap(gameEngine, 1024, 576, 256);
	let ui = new UI(gameEngine, 1024, 0, 256);
	let hud = new HUD(gameEngine);

	let cave = new Cave(gameEngine, 700, 50);

	gameEngine.init(ctx, params.CANVAS_WIDTH / 128,
		 							params.CANVAS_HEIGHT / 128,
									params.TILE_W_H * 2);
  ctx.imageSmoothingEnabled = false;

	gameEngine.addEntity(corners);
	gameEngine.addEntity(vertwalls);
	gameEngine.addEntity(horiwalls);
	gameEngine.addEntity(intGrass);
	gameEngine.addEntity(resources);
	gameEngine.addEntity(minimap);
	gameEngine.addEntity(ui);
	gameEngine.addEntity(castle);
	gameEngine.addEntity(cave);

	//gameEngine.spawnMe("castle", 500, 300);
	gameEngine.spawnMe("minion", 0, 0);
	gameEngine.spawnMe("minion", 10, 300);
	gameEngine.spawnMe("minion", 50, 550);
	//gameEngine.spawnMe("wolf", 800, 0);
	//gameEngine.spawnMe("wolf", 800, 100);
	//gameEngine.spawnMe("wolf", 500, 700);
	//gameEngine.spawnMe("ogre", 900, 50);
	//gameEngine.spawnMe("ogre", 700, 25);

	gameEngine.start();
});
