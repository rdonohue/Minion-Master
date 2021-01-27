var ASSET_MANAGER = new AssetManager();

//downloading things.
ASSET_MANAGER.queueDownload("./sprites/human_regular.png");

ASSET_MANAGER.downloadAll(function () {
	var gameEngine = new GameEngine();

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine.init(ctx, 15, 12, 64);
	ctx.imageSmoothingEnabled = false;

	var x = 2;
	var y = 2;
	//spawn x,y
	//intelligence, speed
	gameEngine.createANDSpawnMinion(x,y,0,1);
	gameEngine.createANDSpawnMinion(x,y,0,50);
	gameEngine.createANDSpawnMinion(x,y,0,1);
	gameEngine.createANDSpawnMinion(x,y,0,5);
	gameEngine.createANDSpawnMinion(x,y,0,100);

	gameEngine.start();
});
