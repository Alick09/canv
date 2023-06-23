import {Space, addPosEventListener} from 'canv';
import {infiniteGrid} from './utils/gen';
import {distance} from './utils/misc';
import {circle} from './utils/simpleObjects';
import {applyMovement, vectorTo} from './utils/gameUtils';

class Game {
    constructor(space){
        this.space = space;
        this.speed = {x: 0, y: 0, max: 0.3};
        this.accel = {x: 0, y: 0};
        this._health = 1;
        this._player = null;
        this._gameOver = false;
        this._spawnEnemyInterval = null;
        this._enemies = [];
        this._score = 0;
        this.maxEnemies = 10;
        document.addEventListener('keydown', e=>{
            if (this._gameOver)
                return;
            const x = 0.005;
            switch (e.code) {
                case 'KeyA': this.accel.x = -x; break;
                case 'KeyW': this.accel.y = -x; break;
                case 'KeyD': this.accel.x = x; break;
                case 'KeyS': this.accel.y = x; break;
            }
        });
        document.addEventListener('keyup', e=>{
            switch (e.code) {
                case 'KeyA': if (this.accel.x < 0) this.accel.x = 0; break;
                case 'KeyW': if (this.accel.y < 0) this.accel.y = 0; break;
                case 'KeyD': if (this.accel.x > 0) this.accel.x = 0; break;
                case 'KeyS': if (this.accel.y > 0) this.accel.y = 0; break;
            }
        });
        addPosEventListener(space, 'click', (pos, e) => {
            if (this._gameOver)
                return;
            const playerPos = this._player.position.center;
            const speed = vectorTo(playerPos, space.transform(pos), 0.5);
            space.addDrawable({
                ...playerPos,
                data: this,
                visible: true,
                ...circle(7, 'black')
            }).animate({animation(ts, dt){
                this.position.center.x += speed.x * dt;
                this.position.center.y += speed.y * dt;
                if (this.data._enemies.some(e => {
                    if (!e.data.dead && distance(e.position.center, this.position.center) < 27){
                        e.data.damage++;
                        if (e.data.damage == 7){
                            e.data.dead = true;
                            this.data._score++;
                        }
                        return true;
                    }
                }) || ts >= 3000)
                    this.visible = false;
                return this.visible;
            }});
            e.preventDefault();
        });
    }
    
    addPlayer(){
        const player = {
            x: 0, y: 0,
            data: this,
            ...circle(20, '#00aa77')
        };
        this._player = this.space.addDrawable(player);
    }

    gameOver(){
        this._health = 0;
        this._gameOver = true;
        clearInterval(this._spawnEnemyInterval);
        this._enemies.forEach(e => {e.data.dead = true;});
    }

    spawnEnemy() {
        this._enemies = this._enemies.filter(e => !e.data.dead);
        if (this._enemies.length < this.maxEnemies){
            const phi = Math.random() * Math.PI * 2;
            const bbox = this.space.getBBox();
            const dist = Math.hypot(bbox.w, bbox.h)/2;
            const enemy = this.space.addDrawable({
                x: bbox.x + bbox.w / 2 + Math.cos(phi) * dist,
                y: bbox.y + bbox.h / 2 + Math.sin(phi) * dist,
                data: {dead: false, damage: 0, g: this, player: this._player},
                visible(){ return !this.data.dead; },
                ...circle(20, () => `rgb(${255 - enemy.data.damage * 20}, 0, 50)`)
            });
            enemy.animate({animation(ts, dt) {
                const speed = vectorTo(this.position.center, this.data.player.position.center, 0.2);
                this.position.center.x += speed.x * dt;
                this.position.center.y += speed.y * dt;
                if (distance(this.position.center, this.data.player.position.center) < 40)
                    this.data.g._health -= 0.0001 * dt;
                    if (this.data.g._health < 0) {
                        this.data.g.gameOver();
                    }
                return !this.data.dead;
            }});
            this._enemies.push(enemy);
        }
    }

    run(){
        this._player.animate({animation(ts, dt){
            const g = this.data;
            const p = applyMovement(this.position.center, g.speed, g.accel, g.speed.max, dt);
            g.space.position.center = {x: -p.x, y: -p.y};
            return !this._gameOver;
        }})
        this._spawnEnemyInterval = setInterval(()=>{this.spawnEnemy()}, 1000);
    }

    addHud(){
        const bbox = this.space.getBBox(false);
        const pad = bbox.w / 50;
        this.space.addDrawable({
            fixedPosition: true,
            data: this,
            draw(ctx){
                ctx.fillStyle = '#999';
                ctx.fillRect(pad, pad, pad * 20, pad);
                ctx.fillStyle = '#f53';
                ctx.fillRect(pad, pad, pad * 20 * this.data._health, pad);
                ctx.font = '30px Arial'
                ctx.fillStyle = '#333';
                const prefix = this.data._gameOver ? "Game over. " : "";
                ctx.fillText(prefix + `Score: ${this.data._score}`, pad, pad * 4);
            }
        });
    }

}


export const gameDemo = (canvas) => {
    const s = Space(canvas, {scale: 1, center: {x: 0, y: 0}});
    s.addDrawable(infiniteGrid(s));
    const game = new Game(s);
    game.addPlayer();
    game.addHud();
    game.run();
};