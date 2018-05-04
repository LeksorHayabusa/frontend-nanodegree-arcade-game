
'use strict';
let Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    const doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d');
    let lastTime,
        isVertPositionChanged;
    window.ctx = ctx;
    window.canvas = canvas;
    window.isVertPositionChanged = isVertPositionChanged;

    canvas.width = 505;
    canvas.height = 626;
    doc.body.appendChild(canvas);

    function init() {
        //reset() не используется
        lastTime = Date.now();
        document.addEventListener('keyup', (e) => {
            const allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            player.handleInput(allowedKeys[e.keyCode]);
        });
        initEnemies();
        allEnemies.forEach( enemy => {
            enemy.randomizeLocation();
            enemy.randomizeSpeed();
        })
        main();
    }

    function main() {
        const now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        map.renderLogic();
        //entities.collapse(dt);
        allEnemies.forEach( enemy => {
            enemy.update(dt);
            enemy.renderVisible()
        })
        allGems.forEach( gem => {
            gem.update(dt);
            gem.render()
        })
        player.render();//renderEntities();
        lastTime = now;
        win.requestAnimationFrame(main) //browser draws slides
    }

    function initEnemies() {    
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
        heart.y = map.line2_2;
    }

    function appearance() {
        ctx.fillStyle = 'red';
        ctx.fillRect(0,0,canvas.width,40)
        ctx.fillRect(0,551,canvas.width,40)
    }

    Resources.load(entities.load());
    Resources.onReady(init)

})(this);
