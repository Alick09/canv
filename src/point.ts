import { iPosition } from "./positioning";

export interface iPoint extends iPosition {
    add: (other: iPosition) => iPoint;
    sub: (other: iPosition) => iPoint;
    mul: (alpha: number) => iPoint;
}

export const Point = (p?: iPosition): iPoint => {
    const p_ = p || {x: 0, y: 0};
    return {
        ...p_,
        add(other: iPosition){
            return Point({x: p_.x + other.x, y: p_.y + other.y});
        },
        sub(other: iPosition){
            return Point({x: p_.x - other.x, y: p_.y - other.y});
        },
        mul(alpha: number){
            return Point({x: p_.x * alpha, y: p_.y * alpha});
        },
    }
}