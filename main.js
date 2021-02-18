var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/human_regular.png");
ASSET_MANAGER.queueDownload("./sprites/wolfsheet1.png");
ASSET_MANAGER.queueDownload("./sprites/castle.png");
ASSET_MANAGER.queueDownload("./sprites/ogres.png");
ASSET_MANAGER.queueDownload("./sprites/cave.png");
ASSET_MANAGER.queueDownload("./sprites/tower.png");
ASSET_MANAGER.queueDownload("./sprites/Arrow.png");
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

	gameEngine.init(ctx);

	new SceneManager(gameEngine);

	gameEngine.start();
});
