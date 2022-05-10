import {createObject, iDrawable, iObject} from './drawable';
import {iPositioning, iPosition, transform} from './positioning';

export interface iSpace {
    canvas: HTMLCanvasElement;
    objects: iObject[];
    addObject: (obj: iObject) => iObject;
    addDrawable: (drawable: iDrawable) => iObject;
    draw: () => void;
    launch: () => void;
    position: iPositioning;
    triggerAnimation: () => void;
    transform: (pos: iPosition) => iPosition;
    options: iSpaceOptions;
    
};

interface iSpaceOptions extends iPositioning {
    pixelRatio?: number;
    onResize?: () => void;
    setupAutoResize?: boolean;
    animationTick?: (ts: number) => void;
};

const setupResizeHandler = (space: iSpace, {pixelRatio, onResize, setupAutoResize=true}: iSpaceOptions): void => {
    if (setupAutoResize){
        if (!onResize){
            const ratio = pixelRatio || window.devicePixelRatio;
            onResize = () => {
                space.canvas.width = space.canvas.offsetWidth * ratio;
                space.canvas.height = space.canvas.offsetHeight * ratio;
                space.draw();
            };
        }
        window.onresize = onResize;
        onResize();
    }
}

export const Space = (canvas: HTMLCanvasElement, options: iSpaceOptions): iSpace => 
{
    const ctx = canvas.getContext('2d');
    if (ctx === null){
        throw TypeError("Can't get context2d from canvas");
    }

    const objects: iObject[] = [];

    const prepare = ({center, angle, rotationCenter, scale}: iPositioning) => {
        if (center)
            ctx.translate(center.x, center.y);
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

    const pos = {
        center: {x: 0, y: 0},
        scale: options.scale,
        angle: options.angle,
        rotationCenter: Object.assign({x: 0, y: 0}, options.rotationCenter)
    }

    const actualPos = () => {
        return {...space.position, center: {
            x: canvas.width/2 - center.x + space.position.center.x, 
            y: canvas.height/2 - center.y + space.position.center.y
        }};
    };

    const center = options.center || {x: 0, y: 0};

    let animationIsGoing = false;
    const animateObjects = () => {
        const ts = Date.now();
        let animationAlive = false;
        objects.forEach(o => {
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

    const space = {
        options,
        canvas,
        objects,
        position: pos,
        addObject(obj: iObject){
            obj.parent = this;
            objects.push(obj);
            return obj;
        },
        addDrawable(drawable: iDrawable){
            return this.addObject(createObject(drawable));
        },
        draw(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            prepare(actualPos());
            objects.forEach(o => {
                ctx.save();
                prepare(o.position);
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
                const tick = () => {
                    this.options.animationTick?.call(_space, 0);
                    this.draw();
                    requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            }
        },
        transform(point: iPosition) {
            return transform(point, actualPos());
        }
    }
    
    setupResizeHandler(space, options);

    return space;
}