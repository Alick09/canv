export const circle = (radius, color) => {
    return {
        draw(ctx) {
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        },
        checkInside(pos) {
            return Math.hypot(pos.x, pos.y) < radius;
        },
    }
};