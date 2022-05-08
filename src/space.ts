import {createObject, iDrawable, iObject} from './drawable';


interface iSpace {
    addObject: (obj: iObject) => iObject;
    addDrawable: (drawable: iDrawable) => iObject;
    draw: () => void;
    launch: () => void;
};

interface iPosition {
    x: number;
    y: number;
}

interface iPositioning {
    center?: iPosition;
    angle?: number;
    rotationCenter?: iPosition;
    scale?: number;
}

interface iSpaceOptions extends iPositioning {
    pixelRatio?: number;
    onResize?: () => void;
    setupAutoResize?: boolean;
    animationTick?: (ts: number) => void;
};

const setupResizeHandler = (canvas: HTMLCanvasElement, {pixelRatio, onResize, setupAutoResize=true}: iSpaceOptions): void => {
    if (setupAutoResize){
        if (!onResize){
            const ratio = pixelRatio || window.devicePixelRatio;
            onResize = () => {
                canvas.width = canvas.offsetWidth * ratio;
                canvas.height = canvas.offsetHeight * ratio;
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

    setupResizeHandler(canvas, options);

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

    return {
        addObject(obj: iObject){
            objects.push(obj);
            return obj;
        },
        addDrawable(drawable: iDrawable){
            return this.addObject(createObject(drawable));
        },
        draw(){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const center = options.center || {x: 0, y: 0};
            prepare({...options, center: {x: canvas.width/2 - center.x, y: canvas.height/2 - center.y}});
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
                const tick = () => {
                    options.animationTick?.call(this, 0);
                    this.draw();
                    requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            }
        }
    }
}