import {createObject, iDrawable, iObject} from './drawable';
import {tPositionChanger, iPositioning, applyChanger, iPosition, transform} from './positioning';

export interface iSpace {
    canvas: HTMLCanvasElement;
    objects: iObject[];
    addObject: (obj: iObject) => iObject;
    addDrawable: (drawable: iDrawable) => iObject;
    draw: () => void;
    launch: () => void;
    set: (changer: tPositionChanger) => void;
    transform: (pos: iPosition) => iPosition;
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
        return {...pos, center: {
            x: canvas.width/2 - center.x + pos.center.x, 
            y: canvas.height/2 - center.y + pos.center.y
        }};
    };

    const center = options.center || {x: 0, y: 0};

    const space = {
        canvas,
        objects,
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
                const pos = o.position();
                prepare({center: pos, ...pos});
                o.draw(ctx);
                ctx.restore();
            });
            ctx.resetTransform();
        },
        launch() {
            if (!options.animationTick){
                console.warn('Set animationTick in space options to make animation work. Ignoring launch.');
            } else {
                const _space = this;
                const tick = () => {
                    options.animationTick?.call(_space, 0);
                    this.draw();
                    requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            }
        },
        transform(point: iPosition) {
            return transform(point, actualPos());
        },
        set(changer: tPositionChanger) {
            applyChanger(pos, pos, changer);
        }
    }
    
    setupResizeHandler(space, options);

    return space;
}