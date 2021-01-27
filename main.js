var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/wolfsheet1.png");
ASSET_MANAGER.queueDownload("./sprites/castle.png");
ASSET_MANAGER.queueDownload("./sprites/human_regular.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	// let castle = new HomeBase(gameEngine);

	gameEngine.init(ctx, 15, 12, 64);
	ctx.imageSmoothingEnabled = false;

	var x = 2;
	var y = 2;

	for (var i = 0; i < 5; i++) {
		gameEngine.createANDSpawnMinion(x, y, "minion");
	}

	gameEngine.createANDSpawnMinion(x, y, "wolf");
	gameEngine.createANDSpawnMinion(x, y, "wolf");
	// gameEngine.addEntity(castle);

	gameEngine.start();
});
