var ASSET_MANAGER = new AssetManager();

//downloading things.
ASSET_MANAGER.queueDownload("./sprites/human_regular.png");

ASSET_MANAGER.downloadAll(function () {
	var gameEngine = new GameEngine();

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');

	gameEngine.init(ctx, 20, 20, 64);

	var x = 2;
	var y = 2;
	
	console.log("initalization complete!");
	gameEngine.createANDSpawnMinion(x,y);
	console.log("spawned minion at: "+y+","+y);
	gameEngine.start();
	console.log("start-up complete!");
});
