export const genRectGrid = () => {
    const objects = [];
    const size = 45;
    for (let y = -760; y <= 760; y += 80){
        for (let x = -760; x <= 760; x+= 80){
            objects.push({
                x, y,
                draw(ctx){
                    ctx.beginPath();
                    ctx.fillStyle = this.selected() ? '#f00' : '#000';
                    ctx.rect(-size/2, -size/2, size, size);
                    ctx.fill();
                    ctx.closePath();
                },
                checkInside({x, y}) {
                    return Math.abs(x) < size/2 && Math.abs(y) < size/2;
                }
            });
        }
    }
    return objects;
}