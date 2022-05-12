export interface iPosition {
    x: number;
    y: number;
};

export interface iPositioning {
    center?: iPosition;
    angle?: number;
    rotationCenter?: iPosition;
    scale?: number;
};

const rotate = (point: iPosition, anchor: iPosition, angle: number): iPosition => {
    if (angle == 0)
        return point;
    const vec = {x: point.x - anchor.x, y: point.y - anchor.y};
    const length = Math.hypot(vec.x, vec.y);
    if (length == 0)
        return point;
    const curAngle = Math.atan2(vec.y, vec.x);
    const finAngle = curAngle + angle;
    const newVec = {x: Math.cos(finAngle) * length, y: Math.sin(finAngle) * length};
    return {x: anchor.x + newVec.x, y: anchor.y + newVec.y};
}

export const transform = (pos: iPosition, setting: iPositioning, shift?: iPosition): iPosition => {
    const {center={x: 0, y: 0}, scale=1.0, angle=0, rotationCenter={x: 0, y: 0}} = setting;
    return rotate({
        x: (pos.x - center.x - (shift?.x || 0)) / scale,
        y: (pos.y - center.y - (shift?.y || 0)) / scale
    }, rotationCenter, -angle);
}