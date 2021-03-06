import {createObject, iDrawable, iObject} from './drawable';
import {iPositioning, iPosition, transform, prepareContext, backTransform} from './positioning';

export interface iSpace {
    canvas: HTMLCanvasElement;
    objects: iObject[];
    pixelRatio: number;
    addObject: (obj: iObject) => iObject;
    addDrawable: (drawable: iDrawable) => iObject;
    draw: () => void;
    launch: () => void;
    position: iPositioning;
    triggerAnimation: () => void;
    transform: (pos: iPosition) => iPosition;
    backTransform: (pos: iPosition) => iPosition;
    options: iSpaceOptions;
    stopAnimation: () => void;
    reset: () => void;
};

interface iSpaceOptions extends iPositioning {
    pixelRatio?: number;
    onResize?: () => void;
    setupAutoResize?: boolean;
    animationTick?: (ts: number) => void;
};

const setupResizeHandler = (space: iSpace, {pixelRatio, onResize, setupAutoResize=true}: iSpaceOptions): number => {
    let ratio = 1;
    if (setupAutoResize){
        if (!onResize){
            ratio = pixelRatio || Math.ceil(window.devicePixelRatio);
            onResize = () => {
                space.canvas.width = space.canvas.offsetWidth * ratio;
                space.canvas.height = space.canvas.offsetHeight * ratio;
                space.draw();
            };
        }
        window.onresize = onResize;
        onResize();
    }
    return ratio;
}

export const Space = (canvas: HTMLCanvasElement, options: iSpaceOptions): iSpace => 
{
    const ctx = canvas.getContext('2d');
    if (ctx === null){
        throw TypeError("Can't get context2d from canvas");
    }

    const pos = {
        center: {x: 0, y: 0},
        scale: options.scale,
        angle: options.angle,
        rotationCenter: Object.assign({x: 0, y: 0}, options.rotationCenter)
    }

    const actualPos = () => {
        const pos = space.position;
        const scale = (space.position.scale || 1) * space.pixelRatio;
        return {
            ...pos, scale,
            center: {x: (pos.center?.x || 0) * scale, y: (pos.center?.y || 0) * scale}
        };
    };

    const center = options.center || {x: 0, y: 0};
    const shift = () => {
        const scale = (space.position.scale || 1) * space.pixelRatio;
        return {x: canvas.width/2 - scale * center.x, y: canvas.height/2 - scale * center.y}
    }

    let animationIsGoing = false;
    const animateObjects = () => {
        const ts = Date.now();
        let animationAlive = false;
        space.objects.forEach(o => {
            if (o.applyAnimation(ts))
                animationAlive = true;
        });
        if (animationAlive){
            space.draw();
            requestAnimationFrame(animateObjects);
        }
        else
            animationIsGoing = false;
    };

    const space: iSpace = {
        options,
        canvas,
        objects: [],
        pixelRatio: 1,
        position: pos,
        addObject(obj: iObject){
            obj.parent = this;
            this.objects.push(obj);
            return obj;
        },
        addDrawable(drawable: iDrawable){
            return this.addObject(createObject(drawable));
        },
        draw(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            prepareContext(ctx, actualPos(), shift());
            this.objects.forEach(o => {
                ctx.save();
                o.draw(ctx);
                ctx.restore();
            });
            ctx.resetTransform();
        },
        triggerAnimation() {
            if (!animationIsGoing){
                animationIsGoing = true;
                requestAnimationFrame(animateObjects);
            }
        },
        launch() {
            if (!this.options.animationTick){
                console.warn('Set animationTick in space options to make animation work. Ignoring launch.');
            } else {
                const _space = this;
                const _startTs = Date.now();
                const tick = () => {
                    if (this.options.animationTick){
                        this.options.animationTick.call(_space, Date.now() - _startTs);
                        this.draw();
                        requestAnimationFrame(tick);
                    }
                }
                requestAnimationFrame(tick);
            }
        },
        stopAnimation() {
            this.options.animationTick = undefined;
        },
        transform(point: iPosition) {
            const scale = this.pixelRatio;
            return transform({x: point.x * scale, y: point.y * scale}, actualPos(), shift());
        },
        backTransform(point: iPosition) {
            const scale = this.pixelRatio;
            const result = backTransform({x: point.x, y: point.y}, actualPos(), shift());
            return {x: result.x / scale, y: result.y / scale};
        },
        reset(){
            this.objects = [];
            this.stopAnimation();
            animationIsGoing = false;
            this.position = {
                center: {x: 0, y: 0},
                scale: options.scale,
                angle: options.angle,
                rotationCenter: Object.assign({x: 0, y: 0}, options.rotationCenter)
            }
        }
    }
    
    space.pixelRatio = setupResizeHandler(space, options);

    return space;
}