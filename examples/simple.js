import {Space} from 'canv';
import {genRectGrid} from './utils/gen';


window.onload = () => {
    let direction = 1;
    const s = Space(document.getElementById('canvas'), {animationTick(ts){
        const {scale, angle} = this.position;
        if (scale > 2)
            direction = -1;
        else if (scale < 0.7)
            direction = 1;
        this.position.scale = (scale || 1) * (1 + direction * 0.001);
        this.position.angle = (angle || 0) + 0.003;
        this.objects.forEach(o => {
            o.position.angle = (o.position.angle || 0) - 0.03;
        })
    }});
    genRectGrid().forEach(d => s.addDrawable(d));
    s.launch();
};