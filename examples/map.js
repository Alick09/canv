import {Space, installCanvasControll} from 'canv';
import { createGridCells } from './utils/gen';
import {circle} from './utils/simpleObjects';


const makeImage = (x, y, spriteDrawer) => {
    return {
        x, y, scale: 0.8,
        data: spriteDrawer,
        draw(ctx){
            spriteDrawer.draw(ctx);
        }
    }
}


export const mapDemo = (canvas) => {
    const s = Space(canvas, {scale: 1, center: {x: 0, y: 100}});
    s.addDrawable(createGridCells({mainStep: 100, count: 2}));
    s.addDrawable({x: 0, y: 0, scale: 2, ...circle(10, 'red')});
    installCanvasControll(s, {rotationThreshold: 0.2});
    s.draw();
};