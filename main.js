var ASSET_MANAGER = new AssetManager();

//downloading things.
ASSET_MANAGER.queueDownload("./sprites/human_regular.png");

ASSET_MANAGER.downloadAll(function () {
	var gameEngine = new GameEngine();

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine.init(ctx, 4, 4, 64);

	var x = 2;
	var y = 2;

	gameEngine.createANDSpawnMinion(x,y);
	gameEngine.start();
});
