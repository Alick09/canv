import {Space, installCanvasControll, installSelection, installMoveObjects} from 'canv';
import { createGridCells, range } from './utils/gen';
import { circle } from './utils/simpleObjects';


const makeComplexObject = (x, y) => {
    const angles = [0, 1, 2, 3, 4, 5].map(i=>i * Math.PI / 3);
    const r1 = 60, r2 = 80, da = Math.PI / 6;
    return {
        x, y,
        scale: 1,
        movable: true,
        selectable: true,
        children: [...angles.map(a=>({
            x: Math.cos(a) * r1, y: Math.sin(a) * r1, 
            selectable: true, movable: true, ...circle(15, '#000000')
        })), ...angles.map(a=>({
            x: Math.cos(a+da) * r2, y: Math.sin(a+da) * r2, ...circle(10, '#000000')
        }))],
        ...circle(40, '#00ff00')
    }
}

export const childrenDemo = (canvas) => {
    const s = Space(canvas, {scale: 0.6});
    s.addDrawable(createGridCells({mainStep: 200}));
    s.addDrawable(makeComplexObject(100, 40));
    s.addDrawable(makeComplexObject(-100, 40));
    s.addDrawable(makeComplexObject(0, -100));
    installSelection(s);
    const mo = installMoveObjects(s, {disableRotation: true});
    installCanvasControll(s, {disableRotation: true, enable: () => !mo.moving()});
    s.draw();
};