'use strict';
class Map {
    constructor() {
        this.stock = [
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
        this.visible = [
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
        this.hiddenUpperIndexes = this.stock.length - this.visible.length,
        this.hiddenDownIndexes = this.stock.length - 1,
        this.line1 = 229, //
        this.line2_1 = 63,
        this.line2_2 = -20,
        this.line3_1 = -186,
        this.line3_2 = -269,
        this.col0 = 0,
        this.col1 = 30,
        this.col2 = 60,
        this.col3 = 90,
        this.col6 = 180,
        this.col7 = 210,
        this.col8 = 240,
        this.col12 = 360,
        this.col13 = 390,
        this.col14 = 420,
        this.heartLine = -10,
        this.gemLine = 560,
        this.gemTextLine = 585
    }

    renderLogic() {
       if (player.y < 200 && window.isUpDownButPressed && this.hiddenUpperIndexes > 0){
            this.hiddenUpperIndexes--;
            this.hiddenDownIndexes--;
            this.visible.pop();
            this.visible.unshift(this.stock[this.hiddenUpperIndexes]);
            player.handleInput('down');
            allEnemies.forEach( enemy => enemy.moveUp() );
            allGems.forEach( gem => gem.moveUp() );

            //window.isUpDownButPressed = false;

        } else if (player.y > 300 && window.isUpDownButPressed && this.hiddenDownIndexes < this.stock.length-1) {
            this.hiddenUpperIndexes++;
            this.hiddenDownIndexes++;
            this.visible.shift();
            this.visible.push(this.stock[this.hiddenDownIndexes]);
            player.handleInput('up');
            allEnemies.forEach( enemy => enemy.moveDown() );
            allGems.forEach( gem => gem.moveDown() );
        }
        window.isUpDownButPressed = false;
        this.render();
        /* this.stock                 this.visible
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
                ctx.drawImage(Resources.get(this.visible[this.row]), this.col * 101, this.row * 83);
            }
        }
    }
}

class Entities {
    constructor() {
    this.stone = 'images/stone-block.png',
    this.water = 'images/water-block.png',
    this.grass = 'images/grass-block.png',
    this.enemyRight = 'images/enemy-bug.png',
    this.enemyLeft = 'images/enemy-bug-left.png',
    this.charBoy = 'images/char-boy.png',
    this.charDeadBoy = 'images/char-dead-boy.png',
    this.gemBlue = 'images/gem-blue.png',
    this.gemGreen = 'images/gem-green.png',
    this.gemOrange = 'images/gem-orange.png',
    this.heart = 'images/heart.png',
    this.gemBlueSmall = 'images/gem-blue-small.png',
    this.gemGreenSmall = 'images/gem-green-small.png',
    this.gemOrangeSmall = 'images/gem-orange-small.png',
    this.heartSmall = 'images/heart-small.png',
    this.heartSmallWhite = 'images/heart-small-white.png'
    }

    load() {
        return Object.values(this)//workaround to uppload images from stock Resource library
    }

    collapse() {
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

            if ( enemyYlow > playerYhigh && enemyYhigh < playerYlow && enemyXright > playerXleft && enemyXleft < playerXright && !player.isCollapse){
                allEnemies.forEach( enemy => enemy.speed = 0)
                player.entity = entities.charDeadBoy;
                player.isCollapse = true;
                blink(player, 500);
                if(window.heartCounter >= 0){
                    allSmallHearts[window.heartCounter].x *= -1;
                    window.heartCounter--;
                }
            }

            function blink(entity,speed) {
                let n = 4, //variable to blink the char 5 times
                    isBlinked = false,
                    lastXLocation = entity.x;
                blinkTimer()

                function blinkTimer() {
                    if (n > 0){
                        setTimeout(() => {
                            if (isBlinked){
                                entity.x = lastXLocation;
                                n--;
                                isBlinked = false
                            } else { 
                                entity.x = -100;
                                n--;
                                isBlinked = true;
                            }
                            blinkTimer()
                    }, speed)} else { setTimeout( () => { entity.isBlinkFinished = true },300)}
                }
            }
        })
    }

    pickUp() {
        allGems.forEach( (gem, i, arr) => {

            //we add 77px to every gem bug because genuine image contains
            //transparent area from its top to the graphics
            //63px for char image accordingly

            let gemYlow = gem.y + gem.height + 77,
                gemYhigh = gem.y + 77,
                gemXright = gem.x + gem.width,
                gemXleft = gem.x,
                playerYlow = player.y + player.height + 63,
                playerYhigh = player.y + 77,
                playerXright = player.x + player.width + 17,
                playerXleft = player.x + 17;

            if ( gemYlow > playerYhigh && gemYhigh < playerYlow && gemXright > playerXleft && gemXleft < playerXright){
                let removed = arr.splice(i,1);
                switch (true) {
                    case (removed[0] === heart ): {
                        window.heartCounter++;
                        allSmallHearts[window.heartCounter].x *= -1;
                        break;
                    }
                    case (removed[0] === gemBlue1 ||  removed[0] === gemBlue2 ): {
                        window.gemBlueCounter++;
                        break;
                    }
                    case (removed[0] === gemGreen1 ||  removed[0] === gemGreen2 ): {
                        window.gemGreenCounter++;
                        break;
                    }
                    case (removed[0] === gemOrange): {
                        window.gemOrangeCounter++;
                        break;
                    }
                }
                    
            }
        })
    }
}

class Entity {
    render() {
        ctx.drawImage(Resources.get(this.entity), this.x, this.y)
    }
}

class Player extends Entity {
    constructor(){
        super()
        this.x = 202,
        this.startYPosition = -10 + 415,
        this.y = -10 + 415,// -20 - to place the char in the middle of the cell
        this.height = 76,
        this.width = 66,
        this.entity = entities.charBoy,
        this.isCollapse = false,
        this.isBlinkFinished = false
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

class Enemy extends Entity {
    constructor() {
        super()
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
        let random = Math.floor(Math.random() * 1000);
        switch (true){ 
            case (random < 300): this.speed = 200;
                break;

            case (random < 700): this.speed = 300;
                break;

            case (random < 1000): this.speed = 500;
                break;
        }
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
        this.entity = entities.enemyRight
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
        this.entity = entities.enemyLeft
    }

    update(dt) {
        let startPosition =  canvas.width + this.width;
        let endPosition = -this.width * 2;
        if ( endPosition < this.x ){
            this.x = this.x - dt * this.speed;
        } else { this.x = startPosition }
    }
}

class Gems extends Entity {
    constructor() {
        super()
        this.x = 0,
        this.y = 0,
        this.width = 101,//workaround of enemy image px width
        this.height = 66,//workaround of enemy image px height
        this.isTime = false,
        this.isPicked = false
    }

    appear() {
        let random = Math.floor(Math.random()) * 120000;
        setTimeout( () => {this.isTime = true }, random)
    }

    randomizeLocation() {
        let random = Math.floor(Math.random() * canvas.width);
        switch (true){ 
            case (random < 101): this.x = 0;
                break;

            case (random < 202): this.x = 101;
                break;

            case (random < 303): this.x = 202;
                break;

            case (random < 404): this.x = 404;
                break;
            }
    }

    renderVisible() {
        //isTime means if the appearence time is came or not according to its Timeout this.appear()
        if (this.isTime && this.y > -40 && this.y < (canvas.height - 200)){
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
        this.entity = entities.gemBlue
    }
}

class GemGreen extends Gems { 
    constructor() {
        super();
        this.entity = entities.gemGreen
    }
}

class GemOrange extends Gems {
    constructor() {
        super();
        this.entity = entities.gemOrange
    }
}

class Heart extends Gems{
    constructor() {
        super();
        this.entity = entities.heart,
        this.y = -40
    }
}

class SmallGems extends Entity{
    constructor() {
        super()
        this.x = 0,
        this.y = 0
    }
}

class SmallGemBlue extends SmallGems {
    constructor() {
        super()
        this.entity = entities.gemBlueSmall
    }
}

class SmallGemGreen extends SmallGems {
    constructor() {
        super()
        this.entity = entities.gemGreenSmall
    }
}

class SmallGemOrange extends SmallGems {
    constructor() {
        super()
        this.entity = entities.gemOrangeSmall
    }
}
    
class SmallHeart extends SmallGems {
    constructor() {
        super()
        this.entity = entities.heartSmall,
        this.isBlinkFinished = false
    }
}

class SmallHeartWhite extends SmallGems {
    constructor() {
        super()
        this.entity = entities.heartSmallWhite
    }
}

const map = new Map,
    entities = new Entities,
    player = new Player,
    enemy1r = new RightEnemy,
    enemy1l = new LeftEnemy,
    enemy2r = new RightEnemy,
    enemy2l = new LeftEnemy,
    enemy2l2 = new LeftEnemy,
    enemy3r = new RightEnemy,
    enemy3r2 = new RightEnemy,
    enemy3l = new LeftEnemy;

const gemBlue1 = new GemBlue,
    gemBlue2 = new GemBlue,
    gemGreen1 = new GemGreen,
    gemGreen2 = new GemGreen,
    gemOrange = new GemOrange,
    heart = new Heart,
    smallHeartWhite1 = new SmallHeartWhite,
    smallHeartWhite2 = new SmallHeartWhite,
    smallHeartWhite3 = new SmallHeartWhite,
    smallHeartWhite4 = new SmallHeartWhite,
    smallHeart1 = new SmallHeart,
    smallHeart2 = new SmallHeart,
    smallHeart3 = new SmallHeart,
    smallHeart4 = new SmallHeart,
    smallGemBlue = new SmallGemBlue,
    smallGemGreen = new SmallGemGreen,
    smallGemOrange = new SmallGemOrange;

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

const allGems = [
    gemBlue1,
    gemBlue2,
    gemGreen1,
    gemGreen2,
    gemOrange,
    heart
    ];

const allSmallWhiteHearts = [
    smallHeartWhite1,
    smallHeartWhite2,
    smallHeartWhite3,
    smallHeartWhite4
];

const allSmallHearts = [
    smallHeart1,
    smallHeart2,
    smallHeart3
];


const allSmallGems = [
    smallGemBlue,
    smallGemGreen,
    smallGemOrange
];
