import {Space, installSelection, installCanvasControll} from 'canv';
import {genRectGrid} from './utils/gen';


window.onload = () => {
    const s = Space(document.getElementById('canvas'), {scale: 0.6});
    genRectGrid().forEach(d => s.addDrawable({
        selectable: true,
        angle: Math.random(), scale: Math.random() + 0.5, 
        ...d
    }));
    installSelection(s);
    installCanvasControll(s);
    s.draw();
};