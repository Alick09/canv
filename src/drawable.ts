type drawFunction = (ctx: CanvasRenderingContext2D) => void;

export interface iDrawable {
    x: number;
    y: number;
    angle?: number;
    scale?: number;
    hidden?: boolean;
    draw: drawFunction;
    children?: iDrawable[];
};

export interface iObjectPosition {
    x: number;
    y: number;
    angle?: number;
    scale?: number;
};

export interface iObject {
    orig: iDrawable;
    position: () => iObjectPosition;
    draw: drawFunction;
};

export const createObject = (drawable: iDrawable): iObject => {
    return {
        orig: drawable,
        position(){
            return {
                x: drawable.x, 
                y: drawable.y, 
                angle: drawable.angle,
                scale: drawable.scale
            };
        },
        draw(ctx: CanvasRenderingContext2D){
            return drawable.draw.call(this, ctx);
        }
    }
}