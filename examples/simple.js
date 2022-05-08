import {Space} from 'canv';

const getDrawables = () => {
    const objects = [];
    for (let i = 0; i < 400; ++i){
        const ix = i % 20;
        const iy = 0 | (i / 20);
        const x = (ix - 9.5) * 80;
        const y = (iy - 9.5) * 80;
        const isCenter = Math.abs(x) + Math.abs(y) < 81;
        const size = 45;
        objects.push({
            x,
            y,
            draw(ctx){
                ctx.beginPath();
                ctx.fillStyle = isCenter ? '#f00' : '#000';
                ctx.rect(-size/2, -size/2, size, size);
                ctx.fill();
                ctx.closePath();
            }
        });
    }
    return objects;
}


window.onload = () => {
    const objects = [];
    const s = Space(document.getElementById('canvas'), {animationTick: ()=>{
        // space.scale *= 1.001;
        // const da = 0.003;
        // space.rotate.angle += da;
        // objects.forEach(o => {o.rotate -= 10 * da});
    }});
    getDrawables().forEach(d => objects.push(s.addDrawable(d)));
    s.launch();
};