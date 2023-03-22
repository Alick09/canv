import { iPosition } from "../positioning";
import { iSpace } from "../space";

type tPosHandler = (pos: iPosition, e?: MouseEvent) => void;

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

const getPosition = (touches: TouchList, canvasPos: DOMRect) => {
    const firstTwo = Array.from(touches)
        .filter((t: Touch) => t.identifier < 2)
        .sort((a, b) => a.identifier - b.identifier)
        .map((t: Touch) => ({x: t.clientX - canvasPos.x, y: t.clientY - canvasPos.y}));
    if (firstTwo.length == 0) {
        return {center: undefined, rotate: undefined, distance: undefined, fingerCount: 0};
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
        fingerCount: touches.length,
        ...twoConf
    }
}

export const installTouchEvents = (space: iSpace, {startMove, endMove, move, scale, rotate}: iTouchEventOptions, rotationThreshold: number) => {
    const position: iTouchPosition = {
        center: undefined,
        rotate: undefined,
        distance: undefined,
        count: 0,
    };
    const rotation = {
        angleAccum: 0,
        enabled: false
    };
    const canvasPos = space.canvas.getBoundingClientRect();
    const handleTouchEvent = (e: TouchEvent, name: string) => {
        const pos = getPosition(e.touches, canvasPos);
        if (position.distance && pos.distance)
            scale(pos.distance / position.distance);
        if (position.rotate && pos.rotate){
            rotation.angleAccum += pos.rotate - position.rotate;
            if (rotation.enabled)
                rotate(pos.rotate - position.rotate, pos.center);
            else if (Math.abs(rotation.angleAccum) > rotationThreshold)
                rotation.enabled = true;
        }
        else {
            if (!pos.rotate)
                Object.assign(rotation, {angleAccum: 0, enabled: false});
            if (pos.center && !position.center)
                startMove(pos.center);
            else if (!pos.center && position.center)
                endMove();
            else if (pos.center && position.center){
                if (pos.count !== position.count)
                    startMove(pos.center);
                else
                    move(pos.center);
            }
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

interface iOnLongPressProps {
    pressDurationThreshold?: number;
    jitterRadius?: number;
    handler: tPosHandler;
}

export const onLongPress = (space: iSpace, {handler, pressDurationThreshold=700, jitterRadius=20}: iOnLongPressProps) => {
    const startPress: any = {
        pos: undefined,
        time: undefined,
    };
    const canvasPos = space.canvas.getBoundingClientRect();
    const handleTouchEvent = (e: TouchEvent, name: string) => {
        const pos = getPosition(e.touches, canvasPos);
        if (pos.fingerCount !== 1 || name == 'cancel'){
            startPress.pos = undefined;
        } else if (pos.center) {
            if (name == 'start'){
                Object.assign(startPress, {pos: pos.center, time: Date.now()});
                setTimeout(()=>{
                    if (startPress.pos)
                        handler(pos.center);
                }, pressDurationThreshold);
            }
            if (startPress.pos === undefined)
                return;
            if (name == 'move' && Math.hypot(pos.center.x - startPress.pos.x, pos.center.y - startPress.pos.y) > jitterRadius)
                startPress.pos = undefined;
        }
    }

    space.canvas.addEventListener('touchstart', (e) => handleTouchEvent(e, 'start'));
    space.canvas.addEventListener('touchend', (e) => handleTouchEvent(e, 'end'));
    space.canvas.addEventListener('touchcancel', (e) => handleTouchEvent(e, 'cancel'));
    space.canvas.addEventListener('touchmove', (e) => handleTouchEvent(e, 'move'));
};