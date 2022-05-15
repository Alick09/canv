import { Point } from "./point";

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
    if (length < 1e-6)
        return point;

    const curAngle = Math.atan2(vec.y, vec.x);
    const finAngle = curAngle + angle;
    const newVec = {x: Math.cos(finAngle) * length, y: Math.sin(finAngle) * length};
    return Point(anchor).add(newVec);
}

export const transform = (pos: iPosition, setting: iPositioning, shift?: iPosition): iPosition => {
    const {center={x: 0, y: 0}, scale=1.0, angle=0, rotationCenter={x: 0, y: 0}} = setting;
    return rotate(
        Point(pos).sub(center).sub(shift || {x: 0, y: 0}).mul(1/scale), 
        rotationCenter, -angle
    );
}

export const prepareContext = (ctx: CanvasRenderingContext2D, 
    {center, angle, rotationCenter, scale}: iPositioning, shift?: iPosition) =>
{
    if (center)
        ctx.translate(center.x, center.y);
    if (shift)
        ctx.translate(shift.x, shift.y);
    if (scale)
        ctx.scale(scale, scale);
    if (angle){
        if (rotationCenter)
            ctx.translate(rotationCenter.x, rotationCenter.y);
        ctx.rotate(angle);
        if (rotationCenter)
            ctx.translate(-rotationCenter.x, -rotationCenter.y);
    }
}

export const changeRotationCenter = (newCenter: iPosition, setting: iPositioning): iPosition => {
    if (!setting.rotationCenter || !setting.angle){
        setting.rotationCenter = newCenter;
        return {x: 0, y: 0};
    }
    else {
        const shifted = rotate(newCenter, setting.rotationCenter, setting.angle);
        const shift = {x: shifted.x - newCenter.x, y: shifted.y - newCenter.y};
        Object.assign(setting, {
            center: {
                x: (setting.center?.x || 0) + shift.x, 
                y: (setting.center?.y || 0) + shift.y
            },
            rotationCenter: newCenter,
        });
        return shift;
    }
}