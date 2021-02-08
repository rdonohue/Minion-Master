class Ogre {
    constructor(game) {
        Object.assign(this, {game});
        // this.spritesheet = ASSETMANAGER.getAsset("/sprites/ogres.png");
        // this.mySearchingAnimator = new Animator(values go here);
        // this.myHuntingAnimator = new Animator(values go here);
        // this.myDeadAnimator = new Animator(values go here);

        this.health = 100;
        this.defense = 0.0;
        this.agility = 2;
        this.attack = 5;
        this.dead = false;
        this.removeFromWorld = false;
        this.speed = 1;
        this.myType = "ogre";

        this.timeBetweenUpdates = 1/this.agility;

        this.n = "n";
        this.e = "e";
        this.w = "w";
        this.s = "s";
        // (n, e, s, w) --> (up, right, down, left, diagonals don't exist)
        this.timer = new Timer();
        this.timeSinceUpdate = 0;
        this.isHunting = false;
    };

    updateMe() {

    };

    // Engaging in combat with minions.
    fight(enemy) {
        if (enemy.health != 0 && this.health != 0) {
            enemy.health -= Math.floor(this.attack - (enemy.defense * this.attack));
            this.health -= Math.floor(enemy.attack - (this.defense * enemy.attack));
            if (enemy.health <= 0) {
                enemy.die();
            }
            if (this.health <= 0) {
                die();
            }
        }
    };

    damage(projectile) {
        // this.health -= Math.floor(projectile.attack - (this.defense * projectile.attack));
        // if (this.health <= 0) {
        //    die();
        // }
    };

    die() {
        this.dead = true;
        this.removeFromWorld = true;
        this.myTile = NULL;
    };

    drawMinimap(ctx, mmX, mmY) {
        ctx.fillStyle = "DarkOliveGreen";
        // ctx.fillRect(params);
    };

    drawMe(ctx) {

    };

};
