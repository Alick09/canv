import { iPoint, Point } from "../point";
import { changeRotationCenter, iPosition } from "../positioning";
import { iSpace } from "../space";
import { setupMoveEvents, iCanvasMoveOptions } from "./movementEvents";


export const installCanvasControll = (space: iSpace, options?: iCanvasMoveOptions) => {
    let canvasPos: iPoint = Point();
    return setupMoveEvents(space, {
        startMove(pos: iPosition){
            canvasPos = Point(space.position.center);
            return true;
        },
        move(pos: iPosition, shift: iPosition){
            space.position.center = canvasPos.add(shift);
        },
        scale(factor: number){
            space.position.scale = (space.position.scale || 1) * factor;
        },
        rotate(dAngle: number, rotationCenter: iPosition){
            changeRotationCenter(space.transform(rotationCenter), space.position);
            space.position.angle = (space.position.angle || 0) + dAngle;
        }
    }, options);
}