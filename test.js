const objects = [];
const space = {
    cx: 0, cy: 0,
    rotate: {angle: 0, center: {x: 0, y: 0}},
    scale: 0.3
}

for (let i = 0; i < 400; ++i){
    const ix = i % 20;
    const iy = 0 | (i / 20);
    const x = (ix - 9.5) * 80;
    const y = (iy - 9.5) * 80;
    const isCenter = Math.abs(x) + Math.abs(y) < 81;
    objects.push({x, y, size: 45, rotate: 0, color: isCenter ? '#f00' : '#000'});
}

const animate = () => {
    space.scale *= 1.001;
    const da = 0.003;
    space.rotate.angle += da;
    objects.forEach(o => {o.rotate -= 10 * da});
}

const draw = (ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(canvas.width/2 - space.cx, canvas.height/2 - space.cy);
    ctx.scale(space.scale, space.scale);
    ctx.translate(space.rotate.center.x, space.rotate.center.y);
    ctx.rotate(space.rotate.angle);
    ctx.translate(-space.rotate.center.x, -space.rotate.center.y);

    // ctx.translate();
    objects.forEach(o => {
        ctx.save();
        ctx.translate(o.x, o.y);
        ctx.rotate(o.rotate);
        ctx.beginPath();
        ctx.fillStyle = o.color;
        ctx.rect(-o.size/2, -o.size/2, o.size, o.size);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    });
    ctx.resetTransform(1, 0, 0, 1, 0, 0);
}

const run = (ctx) => {
    const tick = () => {
        animate();
        draw(ctx);
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

window.onload = () => {
    const el = document.getElementById('canvas');
    const ratio = window.devicePixelRatio;
    const resize = () => {
        el.width = el.offsetWidth * ratio;
        el.height = el.offsetHeight * ratio;
    };
    window.onresize = resize;
    resize();
    const ctx = el.getContext('2d');
    run(ctx);
};