import {Space, installSelection, installClicks, SpriteDrawer} from 'canv';
import { createGridCells, range } from './utils/gen';
import { circle } from './utils/simpleObjects';

const animatable = [];

const makeObject = (x, y) => {
    const points = range(0, 16).map(i => {
        const angle = Math.PI * i / 8;
        const d = {x: Math.cos(angle), y: Math.sin(angle)};
        return {x: d.x * 150, y: d.y * 150, length: 150, d};
    })
    return {
        x, y,
        scale: 1,
        data: points,
        draw(ctx) {
            ctx.beginPath();
            this.data.forEach(p => {
                ctx.lineTo(p.x, p.y);
            });
            ctx.strokeStyle = '#137085';
            ctx.lineWidth = 5;
            ctx.closePath();
            ctx.stroke();
        }
    }
}

const limitAbs = (value, limit) => {
    return value > limit ? limit : value < -limit ? -limit : value;
}

const makeController = () => {
    return {
        x: 0, y: 0,
        onClick(pos) {
            animatable[0].animate({animation(ts){
                const t = ts / 300;
                this.position.scale = 1 + Math.sin(t);
                return t < Math.PI;
            }});
            animatable[1].animate({animation(ts){
                const t = ts / 300;
                this.position.center = {x: 400 + Math.cos(t) * 100, y: Math.sin(t) * 100};
                return t < 2 * Math.PI;
            }});
            animatable[2].animate({animation(ts){
                this.data.forEach(p => {
                    p.length += (p.speed || 0);
                    p.speed = limitAbs((p.speed || 0) + (p.force || 0), 3);
                    if (ts > (p.nextForceChange || 0)){
                        p.force = (Math.random() - 0.5) - (p.length - 150)/20;
                        p.nextForceChange = ts + 50;
                    }
                    p.x = p.d.x * p.length;
                    p.y = p.d.y * p.length;
                }});
                return ts < 10000;
            });
        },
        ...circle(50, '#333')
    }
}


window.onload = () => {
    const s = Space(document.getElementById('canvas'), {scale: 0.6});
    s.addDrawable(createGridCells({mainStep: 200}));
    animatable.push(s.addDrawable(makeObject(-500, 0)));
    animatable.push(s.addDrawable(makeObject(500, 0)));
    animatable.push(s.addDrawable(makeObject(0, -500)));
    s.addDrawable(makeController());
    installClicks(s, {});
    s.draw();
};