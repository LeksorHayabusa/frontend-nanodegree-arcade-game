'use strict';
class Map {
    constructor() {
        this.stockMap = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/grass-block.png',   // Row 3 of 2 of grass
            'images/stone-block.png',   // Row 4 of 3 of stone
            'images/stone-block.png',   // Row 5 of 3 of stone
            'images/grass-block.png',   // Row 6 of 2 of grass
            'images/stone-block.png',   // Row 7 of 3 of stone
            'images/grass-block.png',   // Row 8 of 2 of grass
            'images/grass-block.png'    // Row 9 of 2 of grass
        ],
        this.visibleMap = [
            'images/stone-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/grass-block.png'
        ],
        this.numRows = 6,
        this.numCols = 5,
        this.row = '',
        this.col = '',
        this.hiddenUpperIndexes = this.stockMap.length - this.visibleMap.length,
        this.hiddenDownIndexes = this.stockMap.length - 1,
        this.line1 = 229, //
        this.line2_1 = 63,
        this.line2_2 = -20,
        this.line3_1 = -186,
        this.line3_2 = -269;
    }

    renderLogic() {
       if (player.y < 200 && window.isUpDownButPressed && this.hiddenUpperIndexes > 0){
            this.hiddenUpperIndexes--;
            this.hiddenDownIndexes--;
            this.visibleMap.pop();
            this.visibleMap.unshift(this.stockMap[this.hiddenUpperIndexes]);
            player.handleInput('down');
            allEnemies.forEach( enemy => enemy.moveUp() );

            //window.isUpDownButPressed = false;

        } else if (player.y > 300 && window.isUpDownButPressed && this.hiddenDownIndexes < this.stockMap.length-1) {
            this.hiddenUpperIndexes++;
            this.hiddenDownIndexes++;
            this.visibleMap.shift();
            this.visibleMap.push(this.stockMap[this.hiddenDownIndexes]);
            player.handleInput('up');
            allEnemies.forEach( enemy => enemy.moveDown() );
        }
        window.isUpDownButPressed = false;
        this.render();
        /* this.stockMap                 this.visibleMap
        *   [[],[],[],[],[]] this.hiddenUpperIndexes - number of top rows are left
        *   [[],[],[],[],[]]  it may have indexes from 0 to 3
        *   [[],[],[],[],[]]                  [[],[],[],[],[]]
        *   [[],[],[],[],[]]                  [[],[],[],[],[]]
        *   [[],[],[],[],[]]                  [[],[],[],[],[]]
        *   [[],[],[],[],[]]                  [[],[],[],[],[]]
        *   [[],[],[],[],[]]                  [[],[],[],[],[]]
        *   [[],[],[],[],[]]                  [[],[],[],[],[]]
        *   [[],[],[],[],[]] this.hiddenDownIndexes - number of bottom rows are left
        *   [[],[],[],[],[]]   it may have indexes from 6 to 9
        *   [[],[],[],[],[]]
        * When the condition this.hiddenUpperIndexes<1 && pushImage>=3 then Player cannot step upper
        * When the condition this.hiddenUpperIndexes>=3 && pushImage<1 then Player cannot step upper
        */
    }

        render() {
            ctx.clearRect(0,0,canvas.width,canvas.height)//clear canvas before redraw
            for (this.row = 0; this.row < this.numRows; this.row++) {
                for (this.col = 0; this.col < this.numCols; this.col++) {
                    ctx.drawImage(Resources.get(this.visibleMap[this.row]), this.col * 101, this.row * 83);
                }
            }
        }
    }

const map = new Map;

class Entities {
    constructor() {
    this.stone = 'images/stone-block.png',
    this.water = 'images/water-block.png',
    this.grass = 'images/grass-block.png',
    this.enemyRight = 'images/enemy-bug.png',
    this.enemyLeft = 'images/enemy-bug-left.png',
    this.charBoy = 'images/char-boy.png',
    this.charDeadBoy = 'images/char-dead-boy.png',
    this.charCatGirl = 'images/char-cat-girl.png',
    this.charHornGirl = 'images/char-horn-girl.png',
    this.charPinkGirl = 'images/char-pink-girl.png',
    this.charPrinces = 'images/char-princess-girl.png',
    this.gemBlue = 'images/gem-blue.png',
    this.gemGreen = 'images/gem-green.png',
    this.gemOrange = 'images/gem-orange.png',
    this.heart = 'images/heart.png'
    }

    load() {
        return Object.values(this)//workaround to uppload images from stock Resource func
    }

    collapse(dt) {
        allEnemies.forEach( enemy => {

            //we add 77px to every enemy bug because genuine image contains
            //transparent area from its top to the graphics
            //63px for char image accordingly

            let enemyYlow = enemy.y + enemy.height + 77,
                enemyYhigh = enemy.y + 77,
                enemyXright = enemy.x + enemy.width,
                enemyXleft = enemy.x,
                playerYlow = player.y + player.height + 63,
                playerYhigh = player.y + 77,
                playerXright = player.x + player.width + 17,
                playerXleft = player.x + 17;

            if ( enemyYlow > playerYhigh && enemyYhigh < playerYlow && enemyXright > playerXleft && enemyXleft < playerXright){
                    player.charImage = entities.charDeadBoy;
                    /*let n = 5, //variable to blink the char thrice
                        isBlinked = false,
                        lastXLocation = player.x,
                        lastYLocation = player.y;
                        //enemy.renderVisible()
                    function blinkPlayer() {
                        if ( --n > 0){
                            if (isblinked) {
                                isBlinked = false;
                                setTimeout( () => {
                                    player.x = lastXLocation;
                                    player.y = lastYLocation;
                                }, 300)
                            } else {
                                isBlinked = true;
                                setTimeout( () => {
                                    player.x = -100;
                                    player.y = -170;
                                }, 300)
                            }
                            
                            setTimeout( blinkPlayer, 1000 )
                        } else { 
                            setTimeout( () => {
                                player.x = 202;
                                player.y = 405;    
                            }, 1000)
                            
                        }
                    }
            } else {
                allEnemies.forEach((enemy)=>{
                    enemy.update(dt);
                    //enemy.renderVisible()
                })*/
            }
        })
    }

    pickUp() {

    }
}

const entities = new Entities;

class Player{
    constructor(){
        this.x = 202,
        this.y = -10 + 415,// -20 - to place the char in the middle of the cell
        this.height = 76,
        this.width = 66,
        this.charImage = entities.charBoy
    }
    render() {
        ctx.drawImage(Resources.get(this.charImage), this.x, this.y)
    }
    handleInput(keys) {
        switch(keys){
            case 'left': (this.x >= 101) ? this.x -= 101 : '';
                break;

            case 'right': (this.x < 404) ? this.x += 101 : '';
                break;

            case 'up': (this.y >= 22) ? this.y -= 83 : '';
                window.isUpDownButPressed = true;
                break;
    
            case 'down': (this.y <373) ? this.y += 83 : '';
                window.isUpDownButPressed = true;
                break;
        }
    }
}
const player = new Player;

class Enemy {
    constructor() {
        this.x = -this.width,
        this.y = 0,
        this.speed = 100,
        this.width = 101,//workaround of enemy image px width
        this.height = 66//workaround of enemy image px height
    }

    randomizeLocation() {
        let random = Math.floor(Math.random() * canvas.width);
        this.x = random;
    }

    randomizeSpeed() {
     let random = Math.floor(Math.random() * 600);
        this.speed = random;   
    }

    render() {
        ctx.drawImage(Resources.get(this.enemy), this.x, this.y)
    }

    renderVisible() {
        if( this.y > -40 && this.y < (canvas.height - 200)){
            this.render()
        }
    }

    moveUp() {
        this.y += 83;
    }
    
    moveDown() {
        this.y  -= 83;
    }
}

class RightEnemy extends Enemy {
    constructor(){
        super();
        this.enemy = entities.enemyRight
    }

    update(dt) {
        let startPosition = -this.width,
            endPosition =  canvas.width + this.width;
        if (this.x < endPosition){
            this.x = this.x + dt * this.speed;
        } else { this.x = startPosition }
    }
}

class LeftEnemy extends Enemy {
    constructor(){
        super();
        this.enemy = entities.enemyLeft
    }

    update(dt) {
        let startPosition =  canvas.width + this.width;
        let endPosition = -this.width * 2;
        if ( endPosition < this.x ){
            this.x = this.x - dt * this.speed;
        } else { this.x = startPosition }
    }
}

class Gems {
    constructor() {
        this.x = 0,
        this.y = 0
    }
    
    update(dt) {

    }

    render() {
        ctx.drawImage(Resources.get(this.gem), this.x, this.y)
    }

    renderVisible() {
        if( this.y > -40 && this.y < (canvas.height - 200)){
            this.render()
        }
    }

    moveUp() {
        this.y += 83;
    }
    
    moveDown() {
        this.y  -= 83;
    }
}

class GemBlue extends Gems {
    constructor() {
        super();
        this.gem = entities.gemBlue
    }
}

class GemGreen extends Gems { 
    constructor() {
        super();
        this.gem = entities.gemGreen
    }
}

class GemOrange extends Gems {
    constructor() {
        super();
        this.gem = entities.gemOrange
    }
}

class Heart extends Gems{
    constructor() {
        super();
        this.gem = entities.heart
    }
}

const 
    enemy1r = new RightEnemy,
    enemy1l = new LeftEnemy,
    enemy2r = new RightEnemy,
    enemy2l = new LeftEnemy,
    enemy2l2 = new LeftEnemy,
    enemy3r = new RightEnemy,
    enemy3r2 = new RightEnemy,
    enemy3l = new LeftEnemy,

    gemBlue1 = new GemBlue,
    gemBlue2 = new GemBlue,
    gemGreen1 = new GemGreen,
    gemGreen2 = new GemGreen,
    gemOrange = new GemOrange,
    heart = new Heart;

const allEnemies = [
    enemy1r,
    enemy1l,
    enemy2r,
    enemy2l,
    enemy2l2,
    enemy3r,
    enemy3r2,
    enemy3l
    ];

let visibleEnemies = [];

const allGems = [
    gemBlue1,
    gemBlue2,
    gemGreen1,
    gemGreen2,
    gemOrange,
    heart
    ]
