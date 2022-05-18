import {Space, installSelection, installCanvasControll} from 'canv';
import {genRectGrid} from './utils/gen';


export const selectionDemo = (canvas) => {
    const s = Space(canvas, {scale: 0.6});
    genRectGrid().forEach(d => s.addDrawable({
        selectable: true,
        angle: Math.random(), scale: Math.random() + 0.5, 
        ...d
    }));
    installSelection(s);
    installCanvasControll(s, {wheelRotate: false});
    s.draw();
};