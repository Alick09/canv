import { iObject } from "../drawable";
import { iPoint, Point } from "../point";
import { changeRotationCenter, iPosition, iPositioning } from "../positioning";
import { iSpace } from "../space"
import { setupMoveEvents, iCanvasMoveOptions } from "./movementEvents";
import { findUnderTouch } from "./search";

interface iMoveConfig {
    pos: iPoint;
    object?: iObject
}

type tChangedMap = {
    [key: string]: iPositioning;
}

interface iMoveObjectsOptions extends iCanvasMoveOptions {
    posConstraint?: (newPos: iPoint) => iPoint;
}

export const installMoveObjects = (space: iSpace, options?: iMoveObjectsOptions) => {
    const config: iMoveConfig = {
        pos: Point(),
        object: undefined,
    }
    let changed: tChangedMap = {};
    return {
        ...setupMoveEvents(space, {
            startMove(pos: iPosition){
                const object = findUnderTouch({space, pos, filter: (o) => o.movable && o.selected()});
                if (object){
                    Object.assign(config, {
                        pos: Point(object.position.center),
                        object
                    });
                    return true;
                };
                return false;
            },
            move(pos: iPosition, shift: iPosition){
                if (config.object){
                    const newPos = config.pos.add(shift);
                    config.object.position.center = options?.posConstraint ? options.posConstraint(newPos) : newPos;
                    changed[config.object.id] = config.object.position;
                }
            },
            endMove(){
                config.object = undefined;
            },
            scale(factor: number){
                if (config.object){
                    const pos = config.object.position;
                    pos.scale = (pos.scale || 1) * factor;
                }
            },
            rotate(dAngle: number, rotationCenter: iPosition){
                if (config.object){
                    changeRotationCenter(config.object.transform(rotationCenter), config.object.position);
                    config.object.position.angle = (config.object.position.angle || 0) + dAngle;
                }
            }
        }, options),
        getChanged(){ return changed; },
        resetChanged(){ changed = {}; }
    }
};