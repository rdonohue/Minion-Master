var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/minion/down_attack.png");
ASSET_MANAGER.queueDownload("./sprites/minion/down_walk.png");
ASSET_MANAGER.queueDownload("./sprites/minion/pick_up.png");
ASSET_MANAGER.queueDownload("./sprites/minion/side_attack.png");
ASSET_MANAGER.queueDownload("./sprites/minion/side_walk.png");
ASSET_MANAGER.queueDownload("./sprites/minion/up_attack.png");
ASSET_MANAGER.queueDownload("./sprites/minion/up_walk.png");
ASSET_MANAGER.queueDownload("./sprites/reddragonflydown.png");
ASSET_MANAGER.queueDownload("./sprites/reddragonflyleft.png");
ASSET_MANAGER.queueDownload("./sprites/reddragonflyright.png");
ASSET_MANAGER.queueDownload("./sprites/reddragonflyup.png");
ASSET_MANAGER.queueDownload("./sprites/wolfsheet1.png");
ASSET_MANAGER.queueDownload("./sprites/castle.png");
ASSET_MANAGER.queueDownload("./sprites/ogres.png");
ASSET_MANAGER.queueDownload("./sprites/cave.png");
ASSET_MANAGER.queueDownload("./sprites/tower.png");
ASSET_MANAGER.queueDownload("./sprites/Arrow.png");
ASSET_MANAGER.queueDownload("./sprites/ground_sprites.png");
ASSET_MANAGER.queueDownload("./sprites/trees_stones_bushes.png");
ASSET_MANAGER.queueDownload("./sprites/start_bg.png");

ASSET_MANAGER.queueDownload("./sprites/button_Attack.png");
ASSET_MANAGER.queueDownload("./sprites/button_Agi.png");
ASSET_MANAGER.queueDownload("./sprites/button_Def.png");
ASSET_MANAGER.queueDownload("./sprites/button_Health.png");
ASSET_MANAGER.queueDownload("./sprites/button_Int.png");
ASSET_MANAGER.queueDownload("./sprites/tower.png");
ASSET_MANAGER.queueDownload("./sprites/arrow.png");
ASSET_MANAGER.queueDownload("./sprites/spicy.png");

//Sounds
ASSET_MANAGER.queueDownload("./sounds/Mega_Man_7_Special_Item.mp3");
ASSET_MANAGER.queueDownload("./sounds/Mega_Man_7_Special_Item_2.mp3");


ASSET_MANAGER.downloadAll(function () {
	var gameEngine = new GameEngine();

	var canvas = document.getElementById('gameWorld');
	var ctx = canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	gameEngine.init(ctx);

	new SceneManager(gameEngine);
	//test stuff

	gameEngine.start();
});
