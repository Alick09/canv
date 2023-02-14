import {tAnimationFunc} from './animation';
import {backTransform, iPosition, iPositioning, prepareContext, tNumberCallable, transform} from './positioning';
import {iSpace} from './space';


type tDrawFunction = (ctx: CanvasRenderingContext2D) => void;
type tCheckInside = (pos: iPosition) => boolean;

export interface iDrawable {
    x: number | tNumberCallable;
    y: number | tNumberCallable;
    draw: tDrawFunction;
    id?: string;
    data?: any;
    angle?: number;
    scale?: number;
    rotationCenter?: iPosition;
    hidden?: boolean;
    children?: iDrawable[];
    checkInside?: tCheckInside;
    selectable?: boolean;
    movable?: boolean;
    fixedOrientation?: boolean;
    fixedPosition?: boolean;
    fixedScale?: boolean;
    onClick?: (pos: iPosition) => void;
    objRef?: iObject;
};

interface iAnimateOptions {
    animation: tAnimationFunc;
    force?: boolean;
    putToQueue?: boolean;
}

export interface iObject {
    id: string;
    parent?: iObject | iSpace;
    orig: iDrawable;
    selectable: boolean;
    movable: boolean;
    data: any;
    visible: boolean;
    getSpace: () => iSpace;
    position: iPositioning;
    draw: tDrawFunction;
    checkInside: tCheckInside;
    inAnimationLoop: boolean;
    children?: iObject[];
    click: ()=>void;
    clickable: ()=>boolean;
    selected: (val?:boolean) => boolean;
    transform: (position: iPosition, relativeTo?: iObject | iSpace) => iPosition;
    backTransform: (position: iPosition, relativeTo?: iObject | iSpace) => iPosition;
    animate: (options: iAnimateOptions) => void;
    applyAnimation: tAnimationFunc;
    stopAnimation: (all?: boolean) => void;
    resetPosition: () => void;
    plainObjects: () => iObject[];
    addObject: (o: iObject) => iObject;
    addDrawable: (c: iDrawable) => iObject;
    spliceObject: (index: number, deleteAmount: number, o: iObject) => iObject;
    spliceDrawable: (index: number, deleteAmount: number, c: iDrawable) => iObject;
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

    function getPosition(this: iObject) : iPositioning{
        const result: iPositioning = {
            ...this.position,
        };
        const fixed = {
            angle: this.orig.fixedOrientation,
            center: this.orig.fixedPosition,
            scale: this.orig.fixedScale
        }
        if (fixed.angle || fixed.center || fixed.scale){
            const space = this.getSpace();
            if (space){
                if (fixed.angle){
                    result.angle = (result.angle || 0) - (space.position?.angle || 0);
                }
            }
        }
        return result;
    }

    const res: iObject = {
        id: drawable.id || (Math.random() + 1).toString(36).substring(2),
        parent: undefined,
        orig: drawable,
        inAnimationLoop: false,
        selectable: drawable.selectable || false,
        movable: drawable.movable || false,
        position: pos,
        visible: true,
        data: drawable.data,
        children: undefined,
        draw(ctx: CanvasRenderingContext2D){
            if (this.visible){
                const newPosition = getPosition.call(this);
                prepareContext(ctx, newPosition);
                drawable.draw.call(this, ctx);
                if (this.children){
                    this.children.forEach(c=>{
                        ctx.save();
                        c.draw(ctx);
                        ctx.restore();
                    });
                }
            }
        },
        getSpace(){
            if (!this.parent)
                throw ReferenceError("Couldn't traverse to space from object. Parent is null.");
            if ('selectable' in this.parent)
                return this.parent.getSpace();
            return this.parent;
        },
        checkInside(pos: iPosition) {
            if (!drawable.checkInside || !this.visible)
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
        transform(position: iPosition, relativeTo?: iObject | iSpace) {
            if (relativeTo && 'selectable' in relativeTo && relativeTo.id == this.id)
                return position;
            const point = this.parent ? this.parent.transform(position) : position;
            return transform(point, this.position);
        },
        backTransform(position: iPosition, relativeTo?: iObject | iSpace) {
            if (relativeTo && 'selectable' in relativeTo && relativeTo.id == this.id)
                return position;
            const point = backTransform(position, this.position);
            return this.parent ? this.parent.backTransform(point) : point;
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
        },
        resetPosition() {
            Object.assign(this.position, {
                center: {x: drawable.x || 0, y: drawable.y || 0},
                angle: drawable.angle,
                scale: drawable.scale,
                rotationCenter: drawable.rotationCenter
            });
        },
        plainObjects() {
            const res = [this];
            if (this.children)
                this.children.forEach(c=>res.push(...c.plainObjects()));
            return res;
        },
        addObject(o: iObject){
            this.getSpace().resetObjectCache();
            o.parent = this;
            if (!this.children){
                this.children = [];
            }
            this.children.push(o);
            return o;
        },
        addDrawable(c: iDrawable) {
            const obj = createObject(c);
            return this.addObject(obj);
        },
        spliceObject(index: number, deleteAmount: number, o: iObject) {
            this.getSpace().resetObjectCache();
            o.parent = this;
            if (!this.children){
                this.children = [];
            }
            this.children.splice(index, deleteAmount, o);
            return o;
        },
        spliceDrawable(index: number, deleteAmount: number, c: iDrawable) {
            const obj = createObject(c);
            return this.spliceObject(index, deleteAmount, obj);
        }
    };
    drawable.objRef = res;
    if (drawable.children){
        res.children = drawable.children.map(c=>{
            const obj = createObject(c);
            obj.parent = res;
            return obj;
        });
    }
    return res;
}