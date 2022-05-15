import { iPosition } from "./positioning";

export interface iPoint extends iPosition {
    add: (other: iPosition) => iPoint;
    sub: (other: iPosition) => iPoint;
    mul: (alpha: number) => iPoint;
}

export const Point = (p: iPosition): iPoint => {
    return {
        ...p,
        add(other: iPosition){
            return Point({x: p.x + other.x, y: p.y + other.y});
        },
        sub(other: iPosition){
            return Point({x: p.x - other.x, y: p.y - other.y});
        },
        mul(alpha: number){
            return Point({x: p.x * alpha, y: p.y * alpha});
        },
    }
}