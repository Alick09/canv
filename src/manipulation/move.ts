import { iObject } from "../drawable";
import { iPoint, Point } from "../point";
import { changeRotationCenter, iPosition } from "../positioning";
import { iSpace } from "../space"
import { setupMoveEvents, iCanvasMoveOptions } from "./movementEvents";
import { findUnderTouch } from "./search";

interface iMoveConfig {
    pos: iPoint;
    object?: iObject
}

export const installMoveObjects = (space: iSpace, options?: iCanvasMoveOptions) => {
    const config: iMoveConfig = {
        pos: Point(),
        object: undefined,
    }
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
                if (config.object)
                    config.object.position.center = config.pos.add(shift);
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

    }
};