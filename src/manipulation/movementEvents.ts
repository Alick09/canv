import { iPoint, Point } from "../point";
import { iPosition } from "../positioning";
import { iSpace } from "../space";
import { addPosEventListener } from "./events";
import { installTouchEvents } from "./touch";

export interface iCanvasMoveOptions {
    ctrlWheelRotate?: boolean;
    wheelRotate?: boolean;
    ctrlWheelScale?: boolean;
    scaleForce?: number;
    rotateForce?: number;
    rotationThreshold?: number;
    disableRotation?: boolean;
    disableScale?: boolean;
    leftMouseButtonOnly?: boolean;
    disableMacWheelMove?: boolean;
    enable?: ()=>boolean;
    onMoveStart?: (pos: iPosition) => void;
    onMove?: (pos: iPosition) => void;
    onMoveEnd?: () => void;
}

interface iCanvasControllConfig {
    startPos: iPosition;
    startCanvPos: iPoint;
    moving: boolean;
    lastContinuousMove: number;
    continuousPoint: iPoint;
    continuousMoving: boolean;
}

interface iCallbacks {
    startMove?: (pos: iPosition) => boolean;
    move?: (pos: iPosition, shift: iPosition) => void;
    endMove?: () => void;
    scale?: (factor: number) => void;
    rotate?: (dAngle: number, rotationCenter: iPosition) => void;
}

export const setupMoveEvents = (space: iSpace, callbacks: iCallbacks, options?: iCanvasMoveOptions) => {
    space.canvas.style.touchAction = 'none';
    space.canvas.style.userSelect = 'none';
    const options_ = Object.assign({
        ctrlWheelScale: true,
        rotationThreshold: 0,
        enable(){ return true; },
        onMoveStart(pos: iPosition){},
        onMove(pos: iPosition){},
        onMoveEnd(){},
        leftMouseButtonOnly: true,
        disableMacWheelMove: false
    }, options || {});

    const config: iCanvasControllConfig = {
        startPos: {x: 0, y: 0},
        startCanvPos: Point({x: 0, y: 0}),
        moving: false,
        lastContinuousMove: 0,
        continuousPoint: Point(),
        continuousMoving: false
    };

    // pos = (curPos - startPos)/scale + canvStartPos

    const startMove = (pos: iPosition, e?: MouseEvent) => {
        if (options_.enable() && (!e || !options_.leftMouseButtonOnly || e.button == 0)){
            options_.onMoveStart(pos);
            config.startPos = pos;
            config.startCanvPos = Point(space.position.center);
            if (callbacks.startMove){
                config.moving = callbacks.startMove(pos);
                space.draw();
            }
            else {
                config.moving = true;
            }
        }
    };
    const move = (pos: iPosition) => {
        if (config.moving && options_.enable()){
            options_.onMove(pos);
            const scale = (space.position.scale || 1);
            const shift = Point(pos).sub(config.startPos).mul(1/scale);
            if (callbacks.move){
                callbacks.move(pos, shift);
                space.draw();
            }
        }
    };
    const endMove = () => {
        if (options_.enable()){
            options_.onMoveEnd();
            config.moving = false;
            if (callbacks.endMove){
                callbacks.endMove();
                space.draw();
            }
        }
    };
    const continuousMove = (pos: iPosition, shift: iPosition) => {
        if (!config.continuousMoving && callbacks.startMove){
            config.continuousMoving = callbacks.startMove(pos);
            config.continuousPoint = Point(pos);
            config.startPos = pos;
            space.draw();
        }
        if (callbacks.move){
            const scale = (space.position.scale || 1);
            config.continuousPoint = config.continuousPoint.add(shift);
            callbacks.move(config.startPos, config.continuousPoint.sub(config.startPos).mul(1/scale));
            space.draw();
        }
        config.lastContinuousMove = Date.now();
        setTimeout(()=>{
            if (Date.now() - config.lastContinuousMove > 150){
                if (callbacks.endMove)
                    callbacks.endMove();
                config.continuousMoving = false;
            }
        }, 200);
    };
    const scale = (factor: number) => {
        if (!options_.disableScale && callbacks.scale && options_.enable()){
            callbacks.scale(factor);
            space.draw();
        }
    };
    const rotate = (dAngle: number, rotationCenter: iPosition) => {
        if (!options_.disableRotation && callbacks.rotate && options_.enable()){
            callbacks.rotate(dAngle, rotationCenter);
            space.draw();
        }
    };

    const scaleForce = options_.scaleForce || 0.05;
    const rotateForce = options_.rotateForce || 0.02;
    const platform = (navigator as any)?.userAgentData?.platform || navigator?.platform || "unknown";
    const isMac = platform.toLowerCase().indexOf('mac') >= 0;
    space.canvas.addEventListener('wheel', (e) => {
        const ops = {rotate: 1, scale: 2, move: 3, nothing: 4};
        const op = (()=>{
            if (options_.ctrlWheelRotate && e.ctrlKey)
                return ops.rotate;
            if (options_.ctrlWheelScale && e.ctrlKey)
                return ops.scale;
            if (options_.wheelRotate && !e.ctrlKey)
                return ops.rotate;
            return isMac && !options_.disableMacWheelMove ? ops.move : ops.nothing;
        })();
        if (op == ops.rotate){
            const dAngle = e.deltaY > 0.1 ? rotateForce : e.deltaY < -0.1 ? -rotateForce: 0;
            rotate(dAngle, {x: e.offsetX, y: e.offsetY});
        } else if (op == ops.scale) {
            scale(e.deltaY > 0.1 ? 1 - scaleForce : e.deltaY < -0.1 ? (1/(1 - scaleForce)): 1);
        } else if (op == ops.move) {
            const factor = 0.7;
            continuousMove({x: e.offsetX, y: e.offsetY}, {x: -e.deltaX * factor, y: -e.deltaY * factor});
        }
        e.preventDefault();
    });
    addPosEventListener(space, 'mousedown', startMove);
    addPosEventListener(space, 'mouseup', endMove);
    addPosEventListener(space, 'mousemove', move);
    installTouchEvents(space, {startMove, move, endMove, rotate, scale}, options_.rotationThreshold);
    return {
        moving(){ return config.moving || config.continuousMoving; }
    }
}