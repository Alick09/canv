import { Point } from "./point";

export type tNumberCallable = () => number;

export interface iDynamicPosition {
    x: number | tNumberCallable;
    y: number | tNumberCallable;
};

export interface iPosition {
    x: number;
    y: number;
};

export interface iPositioning {
    center?: iDynamicPosition;
    angle?: number;
    rotationCenter?: iPosition;
    scale?: number;
};

export const getPos = (pos: iDynamicPosition): iPosition => {
    const getValue = (v: number | tNumberCallable) => {
        return (typeof v =='function') ? v() : v;
    };
    return {x: getValue(pos.x), y: getValue(pos.y)};
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
        Point(pos).sub(getPos(center)).sub(shift || {x: 0, y: 0}).mul(1/scale), 
        rotationCenter, -angle
    );
}

export const backTransform = (pos: iPosition, setting: iPositioning, shift?: iPosition): iPosition => {
    const {center={x: 0, y: 0}, scale=1.0, angle=0, rotationCenter={x: 0, y: 0}} = setting;
    return Point(rotate(pos, rotationCenter, angle)).mul(scale).add(shift || {x: 0, y: 0}).add(getPos(center));
}

export const prepareContext = (ctx: CanvasRenderingContext2D, 
    {center, angle, rotationCenter, scale}: iPositioning, shift?: iPosition) =>
{
    if (center){
        const c = getPos(center)
        ctx.translate(c.x, c.y);
    }
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
        const center = getPos(setting.center || {x: 0, y: 0});
        Object.assign(setting, {
            center: {
                x: center.x + shift.x, 
                y: center.y + shift.y
            },
            rotationCenter: newCenter,
        });
        return shift;
    }
}