var gameEngine = new GameEngine();

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/wolfsheet1.png");
ASSET_MANAGER.queueDownload("./sprites/castle.png");

ASSET_MANAGER.downloadAll(function () {
	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	let wolf = new Wolf(gameEngine, 0, 0);
	let castle = new HomeBase(gameEngine, 0, 0);

	gameEngine.init(ctx);

	gameEngine.addEntity(wolf);
	gameEngine.addEntity(castle);

	gameEngine.start();
});
