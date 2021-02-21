class HUD {
    constructor(game) {
        Object.assign(this, { game });
    };

    updateMe() {

    };

    drawMe(ctx) {

    };

};
 /* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function menuFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
};

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

// Minimap for the game.
class MiniMap {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });
    };

    updateMe() {

    };

    drawMe(ctx) {
        // for (var i = 0; i < this.game.entities.length; i++) {
        //    this.game.entities[i].drawMinimap(ctx, this.x, this.y);
        // }

        ctx.fillStyle = "green";
        ctx.fillRect(this.x, this.y, this.w, 192);
        ctx.strokeStyle = "Black";
        ctx.strokeRect(this.x, this.y, this.w - 2, 192 - 1);

    };

};

// Rest of the UI to hold the game menu features.
class UI {
    constructor(game, x, y, w) {
        Object.assign(this, { game, x, y, w });

        this.towerButton = new TowerButton(this.game, 1038, 67);
        this.game.addEntity(this.towerButton);
    };

    updateMe() {

    };

    drawMe(ctx) {
        ctx.fillStyle = "SaddleBrown";
        ctx.fillRect(this.x, this.y, this.w, 576);
        ctx.strokeStyle = "Black";
        ctx.strokeRect(this.x, this.y, this.w - 2, 576 - 1);
        ctx.font = params.TILE_W_H/4 + 'px "Playfair Display SC"';

        ctx.fillStyle = "White";
        ctx.fillText("MiniMap", this.x + 88, 564);
        ctx.strokeStyle = "White"
        ctx.strokeRect(this.x + 84, 548, 76, 22);
        
        this.towerButton.drawMe(this.game.ctx);
    }

};
