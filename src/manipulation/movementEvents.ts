import { iPoint, Point } from "../point";
import { changeRotationCenter, iPosition, transform } from "../positioning";
import { iSpace } from "../space";
import { addPosEvenListener } from "./events";

type tPosHandler = (pos: iPosition) => void;

interface iTouchEventOptions {
    startMove: tPosHandler;
    endMove: () => void;
    move: tPosHandler;
    scale: (factor: number) => void;
    rotate: (dAngle: number, rotationCenter: iPosition) => void;
}

interface iTouchPosition {
    center?: iPosition;
    rotate?: number;
    distance?: number;
    count: number;
}

export interface iCanvasMoveOptions {
    ctrlWheelRotate?: boolean;
    wheelRotate?: boolean;
    ctrlWheelScale?: boolean;
    scaleForce?: number;
    rotateForce?: number;
}

const installTouchEvents = (space: iSpace, {startMove, endMove, move, scale, rotate}: iTouchEventOptions) => {
    const position: iTouchPosition = {
        center: undefined,
        rotate: undefined,
        distance: undefined,
        count: 0
    }
    const canvasPos = space.canvas.getBoundingClientRect();
    const getPosition = (touches: TouchList) => {
        const firstTwo = Array.from(touches)
            .filter((t: Touch) => t.identifier < 2)
            .sort((a, b) => a.identifier - b.identifier)
            .map((t: Touch) => ({x: t.clientX - canvasPos.x, y: t.clientY - canvasPos.y}));
        if (firstTwo.length == 0) {
            return {center: undefined, rotate: undefined, distance: undefined};
        }
        const accum = firstTwo.reduce((acc, t) => ({x: acc.x + t.x, y: acc.y + t.y}), {x: 0, y: 0});
        const twoConf: iTouchPosition = {
            distance: undefined,
            rotate: undefined,
            count: firstTwo.length
        };
        if (firstTwo.length > 1){
            const d = {x: firstTwo[0].x - firstTwo[1].x, y: firstTwo[0].y - firstTwo[1].y};
            twoConf.distance = Math.hypot(d.x, d.y);
            twoConf.rotate = Math.atan2(d.y, d.x);
        }
        return {
            center: {x: accum.x / firstTwo.length, y: accum.y / firstTwo.length},
            ...twoConf
        }
    }

    const handleTouchEvent = (e: TouchEvent, name: string) => {
        const pos = getPosition(e.touches);
        if (position.distance && pos.distance)
            scale(pos.distance / position.distance);
        if (position.rotate && pos.rotate)
            rotate(pos.rotate - position.rotate, pos.center);
        else if (pos.center && !position.center)
            startMove(pos.center);
        else if (!pos.center && position.center)
            endMove();
        else if (pos.center && position.center){
            if (pos.count !== position.count)
                startMove(pos.center);
            else
                move(pos.center);
        }
        
        Object.assign(position, pos);
    }

    space.canvas.addEventListener('touchstart', (e) => handleTouchEvent(e, 'start'));
    space.canvas.addEventListener('touchend', (e) => handleTouchEvent(e, 'end'));
    space.canvas.addEventListener('touchcancel', (e) => handleTouchEvent(e, 'cancel'));
    space.canvas.addEventListener('touchmove', (e) => handleTouchEvent(e, 'move'));
    return {

    };
};

interface iCanvasControllConfig {
    startPos: iPosition;
    startCanvPos: iPoint;
    moving: boolean;
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
    const options_ = Object.assign({wheelRotate: true, ctrlWheelScale: true}, options || {});

    const config: iCanvasControllConfig = {
        startPos: {x: 0, y: 0},
        startCanvPos: Point({x: 0, y: 0}),
        moving: false,
    };

    // pos = (curPos - startPos)/scale + canvStartPos

    const startMove = (pos: iPosition) => {
        config.startPos = pos;
        config.startCanvPos = Point(space.position.center || {x: 0, y: 0});
        if (callbacks.startMove){
            config.moving = callbacks.startMove(pos);
            space.draw();
        }
        else {
            config.moving = true;
        }
    };
    const move = (pos: iPosition) => {
        if (config.moving){
            const scale = (space.position.scale || 1);
            const shift = Point(pos).sub(config.startPos).mul(1/scale);
            if (callbacks.move){
                callbacks.move(pos, shift);
                space.draw();
            }
        }
    };
    const endMove = () => {
        config.moving = false;
        if (callbacks.endMove){
            callbacks.endMove();
            space.draw();
        }
    };
    const scale = (factor: number) => {
        if (callbacks.scale){
            callbacks.scale(factor);
            space.draw();
        }
    };
    const rotate = (dAngle: number, rotationCenter: iPosition) => {
        if (callbacks.rotate){
            callbacks.rotate(dAngle, rotationCenter);
            space.draw();
        }
    };

    const scaleForce = options_.scaleForce || 0.05;
    const rotateForce = options_.rotateForce || 0.02;
    space.canvas.addEventListener('wheel', (e) => {
        if (e.ctrlKey && options_.ctrlWheelRotate || (!e.ctrlKey && options_.wheelRotate)){
            const dAngle = e.deltaY > 0.1 ? rotateForce : e.deltaY < -0.1 ? -rotateForce: 0;
            rotate(dAngle, {x: e.offsetX, y: e.offsetY});
        } else if (e.ctrlKey && options_.ctrlWheelScale || (!e.ctrlKey && options_.ctrlWheelRotate)) {
            scale(e.deltaY > 0.1 ? 1 - scaleForce : e.deltaY < -0.1 ? (1/(1 - scaleForce)): 1);
        }
        e.preventDefault();
    });
    addPosEvenListener(space, 'mousedown', startMove);
    addPosEvenListener(space, 'mouseup', endMove);
    addPosEvenListener(space, 'mousemove', move);
    installTouchEvents(space, {startMove, move, endMove, rotate, scale});
    return {
        moving(){ return config.moving; }
    }
}