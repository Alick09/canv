import {Space} from 'canv';
import {genRectGrid} from './utils/gen';


window.onload = () => {
    const objects = [];
    let direction = 1;
    const s = Space(document.getElementById('canvas'), {animationTick(ts){
        this.set(({scale, angle}) => {
            if (scale > 2)
                direction = -1;
            else if (scale < 0.7)
                direction = 1;
            return {
                scale: (scale || 1) * (1 + direction * 0.001),
                angle: (angle || 0) + 0.003
            };
        });
        objects.forEach(o => {
            o.set(({angle}) => ({angle: (angle || 0) - 0.03}));
        })
    }});
    genRectGrid().forEach(d => objects.push(s.addDrawable(d)));
    s.launch();
};