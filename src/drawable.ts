import { tAnimationFunc } from './animation';
import {iPosition, iPositioning, prepareContext, transform} from './positioning';
import {iSpace} from './space';


type tDrawFunction = (ctx: CanvasRenderingContext2D) => void;
type tCheckInside = (pos: iPosition) => boolean;


export interface iDrawable {
    x: number;
    y: number;
    draw: tDrawFunction;
    data?: any;
    angle?: number;
    scale?: number;
    rotationCenter?: iPosition;
    hidden?: boolean;
    children?: iDrawable[];
    checkInside?: tCheckInside;
    selectable?: boolean;
    fixedOrientation?: boolean;
    fixedPosition?: boolean;
    onClick?: (pos: iPosition) => void;
};

interface iAnimateOptions {
    animation: tAnimationFunc;
    force?: boolean;
    putToQueue?: boolean;
}

export interface iObject {
    parent?: iObject | iSpace;
    orig: iDrawable;
    selectable: boolean;
    data: any;
    getSpace: () => iSpace;
    position: iPositioning;
    draw: tDrawFunction;
    checkInside: tCheckInside;
    inAnimationLoop: boolean;
    click: ()=>void;
    clickable: ()=>boolean;
    selected: (val?:boolean) => boolean;
    transform: (position: iPosition) => iPosition;
    animate: (options: iAnimateOptions) => void;
    applyAnimation: tAnimationFunc;
    stopAnimation: (all?: boolean) => void;
};

interface iCurrentAnimation {
    func: tAnimationFunc;
    queue: tAnimationFunc[];
    start: number;
}


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

    const lastInside: iPosition = {x: 0, y: 0};
    const currentAnimation: iCurrentAnimation = {
        func: (ts: number) => false,
        queue: [],
        start: -1
    };

    const setNextAnimation = (ts = -1) => {
        const nextAnimation = currentAnimation.queue.shift();
        if (nextAnimation){
            currentAnimation.func = nextAnimation;
            currentAnimation.start = ts;
        }
    }

    return {
        parent: undefined,
        orig: drawable,
        inAnimationLoop: false,
        selectable: drawable.selectable || false,
        position: pos,
        data: drawable.data,
        draw(ctx: CanvasRenderingContext2D){
            prepareContext(ctx, this.position);
            return drawable.draw.call(this, ctx);
        },
        getSpace(){
            if (!this.parent)
                throw ReferenceError("Couldn't traverse to space from object. Parent is null.");
            if ('selectable' in this.parent)
                return this.parent.getSpace();
            return this.parent;
        },
        checkInside(pos: iPosition) {
            if (!drawable.checkInside)
                return false;
            const objectPosition = this.transform(pos);
            const isInside = drawable.checkInside.call(this, objectPosition);
            if (isInside)
                Object.assign(lastInside, objectPosition);
            return isInside;
        },
        selected(val?:boolean) {
            if (val !== undefined)
                core.selected = val;
            return core.selected;
        },
        click() {
            drawable.onClick ? drawable.onClick(lastInside) : null;
        },
        clickable() {
            return drawable.onClick !== undefined;
        },
        transform(position: iPosition) {
            const point = this.parent ? this.parent.transform(position) : position;
            return transform(point, pos);
        },
        animate({animation, force=false, putToQueue=false}) {
            if (force || !this.inAnimationLoop){
                this.inAnimationLoop = true;
                currentAnimation.func = animation;
                currentAnimation.start = -1;
                this.getSpace().triggerAnimation();
            } else if (putToQueue){
                currentAnimation.queue.push(animation);
            }
        },
        stopAnimation(all=false){
            if (all || currentAnimation.queue.length == 0)
                this.inAnimationLoop = false;
            else
                setNextAnimation();
        },
        applyAnimation(ts: number){
            if (!this.inAnimationLoop)
                return false;
            if (currentAnimation.start < 0){
                currentAnimation.start = ts;
            } else {
                const alive = currentAnimation.func.call(this, ts - currentAnimation.start);
                if (!alive){
                    if (currentAnimation.queue.length == 0)
                        this.inAnimationLoop = false;
                    else
                        setNextAnimation(ts);
                }
            }
            return this.inAnimationLoop;
        }
    }
}