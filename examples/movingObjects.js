import {Space, installSelection, installCanvasControll, installMoveObjects} from 'canv';
import {genRectGrid} from './utils/gen';


export const movingDemo = (canvas) => {
    const s = Space(canvas, {scale: 0.6});
    genRectGrid().forEach(d => s.addDrawable({
        selectable: true,
        movable: true,
        angle: Math.random(), scale: Math.random() + 0.5, 
        ...d
    }));
    installSelection(s);
    const mo = installMoveObjects(s, {});
    installCanvasControll(s, {wheelRotate: false, enable: () => !mo.moving()});
    s.draw();
};