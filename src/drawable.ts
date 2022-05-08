import {applyChanger, iPosition, iPositioning, tPositionChanger, transform} from './positioning';
import {iSpace} from './space';

type tDrawFunction = (ctx: CanvasRenderingContext2D) => void;
type tCheckInside = (pos: iPosition) => boolean;

export interface iDrawable {
    x: number;
    y: number;
    angle?: number;
    scale?: number;
    rotationCenter?: iPosition;
    hidden?: boolean;
    draw: tDrawFunction;
    children?: iDrawable[];
    checkInside?: tCheckInside;
    selectable?: boolean;
};

export interface iObjectPosition {
    x: number;
    y: number;
    angle?: number;
    scale?: number;
};

export interface iObject {
    parent?: iObject | iSpace;
    orig: iDrawable;
    position: () => iObjectPosition;
    draw: tDrawFunction;
    set: (changer: tPositionChanger) => void;
    checkInside: tCheckInside;
    selected: (val?:boolean) => boolean;
    transform: (position: iPosition) => iPosition;
};

export const createObject = (drawable: iDrawable): iObject => {
    const pos = {
        center: {x: drawable.x || 0, y: drawable.y || 0},
        angle: drawable.angle,
        scale: drawable.scale,
        rotationCenter: drawable.rotationCenter
    };

    if (drawable.selectable && drawable.checkInside === undefined)
        throw TypeError("Drawable should have checkInside method to be selectable");
    
    const core = {
        selected: false
    };

    return {
        parent: undefined,
        orig: drawable,
        position(){
            return {x: pos.center.x, y: pos.center.y, ...pos};
        },
        draw(ctx: CanvasRenderingContext2D){
            return drawable.draw.call(this, ctx);
        },
        set(changer: tPositionChanger) {
            applyChanger(pos, pos, changer);
        },
        checkInside(pos: iPosition) {
            if (!drawable.selectable || !drawable.checkInside)
                return false;
            return drawable.checkInside.call(this, this.transform(pos));
        },
        selected(val?:boolean) {
            if (val !== undefined)
                core.selected = val;
            return core.selected;
        },
        transform(position: iPosition) {
            const point = this.parent ? this.parent.transform(position) : position;
            return transform(point, pos);
        }
    }
}