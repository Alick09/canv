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
};


export const createGridCells = ({count=20, mainStep=100, secondaryDivisions=2}) => {
    const inf_ = count * mainStep;
    const line = ({ctx, pos, width, color='#888', horizontal=true}) => {
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.strokeStyle = color;
        if (horizontal){
            ctx.moveTo(-inf_, pos);
            ctx.lineTo(inf_, pos);
        } else {
            ctx.moveTo(pos, -inf_);
            ctx.lineTo(pos, inf_);
        }
        ctx.stroke();
        ctx.closePath();
    }
    return {
        x: 0, y: 0,
        draw(ctx){
            for (let i = -count; i <= count; ++i){
                let s = mainStep * i;
                line({ctx, pos: s, width: 2, horizontal: true});
                line({ctx, pos: s, width: 2, horizontal: false});
                if (i < count){
                    for (let j = 1; j < secondaryDivisions; ++j){
                        const p = j / secondaryDivisions;
                        const s_ = s + p * mainStep;
                        line({ctx, pos: s_, color: '#ccc', width: 1, horizontal: true});
                        line({ctx, pos: s_, color: '#ccc', width: 1, horizontal: false});
                    }
                }
            }
        }
    }
};


export const range = (from_, to_, step = 1) => {
    const result = [];
    for (let i = from_; i < to_; i += step) {
        result.push(i);
    }
    return result;
};


export const infiniteGrid = (space, gridSize=100) => {
    return {
        draw(ctx){
            const bbox = space.getBBox(true);
            const lx = (Math.round(bbox.x / gridSize) - 1) * gridSize;
            const ty = (Math.round(bbox.y / gridSize) - 1) * gridSize;
            ctx.strokeStyle = '#00000020';
            ctx.lineWidth = 3;
            ctx.beginPath();
            range(lx, bbox.x + bbox.w + 1, gridSize).forEach((x) => {
                ctx.moveTo(x, bbox.y);
                ctx.lineTo(x, bbox.y + bbox.h);
            });
            range(ty, bbox.y + bbox.h + 1, gridSize).forEach((y) => {
                ctx.moveTo(bbox.x, y);
                ctx.lineTo(bbox.x + bbox.w, y);
            });
            ctx.closePath();
            ctx.stroke();
        }
    }
};