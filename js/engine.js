
'use strict';
const Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    const doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        startButton = document.getElementById('start_game'),
        buttonSet = document.querySelector('#button_set button'),
        background = document.getElementById('background');
    let lastTime,
        isVertPositionChanged,
        gemBlueCounter = 0,
        gemGreenCounter = 0,
        gemOrangeCounter = 0;
    window.ctx = ctx;
    window.canvas = canvas;
    window.isVertPositionChanged = isVertPositionChanged;
    window.gemBlueCounter = gemBlueCounter;
    window.gemGreenCounter = gemGreenCounter;
    window.gemOrangeCounter = gemOrangeCounter;

    canvas.width = 505;
    canvas.height = 600;
    doc.body.appendChild(canvas);


    Resources.load(entities.load());
    Resources.onReady(init)


    function init() {
        startButton.removeAttribute('disabled');
        startButton.addEventListener('click', () => started())
    }

    function started() {
        //reset() не используется
        background.classList.add('hidden')
        lastTime = Date.now();
        document.addEventListener('keyup', e => {
            const allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            !player.isCollapse ? player.handleInput(allowedKeys[e.keyCode]) : '';
        });
        buttonSet.addEventListener('click', e => {
            console.log('e key - ' + e.target.getAttribute('id'))
            const allowedKeys = {
                arrowLeft: 'left',
                arrowUp: 'up',
                arrowRight: 'right',
                arrowDown: 'down'
            };
            //!player.isCollapse ? player.handleInput(allowedKeys[e.keyCode]) : '';
        });
        initEnities();
        allEnemies.forEach( enemy => {
            enemy.randomizeLocation();
            enemy.randomizeSpeed();
        })
        allGems.forEach( gem => {
            gem.randomizeLocation();
            gem.appear();
        })
        main();
    }

    function restartGame() {
        map.visible = [
            'images/stone-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/stone-block.png',
            'images/grass-block.png',
            'images/grass-block.png'
        ];
        map.hiddenUpperIndexes = map.stock.length - map.visible.length,
        map.hiddenDownIndexes = map.stock.length - 1,
        initEnities()
        player.isCollapse = false;
        player.isBlinkFinished = false;
        player.x = 202;
        player.y = 405;
        player.entity = entities.charBoy;
        allEnemies.forEach( enemy => {
            enemy.randomizeLocation();
            enemy.randomizeSpeed();
        })
        const allGems = [
            gemBlue1,
            gemBlue2,
            gemGreen1,
            gemGreen2,
            gemOrange,
            heart
            ];
    }

    function main() {
        const now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        map.renderLogic();
        entities.collapse();
        allEnemies.forEach( enemy => {
            enemy.update(dt)
            enemy.renderVisible()
        })
        entities.pickUp()
        allGems.forEach( gem => { gem.renderVisible() })
        player.render()
        appearance()
        textGem(window.gemBlueCounter, 2, map.col2)
        textGem(window.gemGreenCounter, 2, map.col8)
        textGem(window.gemOrangeCounter, 1, map.col14)
        allSmallWhiteHearts.forEach( h => { h.render() })
        allSmallHearts.forEach( h => { h.render() })
        allSmallGems.forEach( g => { g.render() })
        lastTime = now;
        (player.isBlinkFinished) ? restartGame() : '';
        win.requestAnimationFrame(main) //browser draws slides
    }

    function initEnities() {    
        enemy1r.y = map.line1;
        enemy1l.y = map.line1;
        enemy2r.y = map.line2_1;
        enemy2l.y = map.line2_2;
        enemy2l2.y = map.line2_2;
        enemy3r.y = map.line3_1;
        enemy3r2.y = map.line3_2;
        enemy3l.y = map.line3_2;

        gemBlue1.y = map.line1;
        gemBlue2.y = map.line3_1;
        gemGreen1.y = map.line3_2;
        gemGreen2.y = map.line2_2;
        gemOrange.y = map.line3_2;
        heart.y = map.line2_2 + 20; //20px is workaround the difference between
                                    // heart's image size and enemys' image size from the top edge
        smallHeartWhite1.x = map.col0;
        smallHeartWhite2.x = map.col1;
        smallHeartWhite3.x = map.col2;
        smallHeartWhite4.x = -map.col3;
        smallHeart1.x = map.col0;
        smallHeart2.x = map.col1;
        smallHeart3.x = map.col2;
        smallHeart4.x = -map.col3;
        allSmallHearts.forEach( h => h.y = map.heartLine )
        allSmallWhiteHearts.forEach( h => h.y = map.heartLine )
        allSmallGems.forEach( g => g.y = map.gemLine )
        smallGemBlue.x = map.col1;
        smallGemGreen.x = map.col7;
        smallGemOrange.x = map.col13;
    }

    function appearance() {
        ctx.fillStyle = '#438b49';
        ctx.fillRect(0,551,canvas.width,40);
    }

    function textGem(counter, number, mapCol) {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText( counter + ' / ' + number, mapCol, map.gemTextLine);
        ctx.stroke()
    }

})(this);
