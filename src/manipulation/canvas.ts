import { iPoint, Point } from "../point";
import { changeRotationCenter, iPosition } from "../positioning";
import { iSpace } from "../space";
import { setupMoveEvents, iCanvasMoveOptions } from "./movementEvents";


interface iCanvasControlOptions extends iCanvasMoveOptions {
    enable?: ()=>boolean;
}


export const installCanvasControll = (space: iSpace, options?: iCanvasControlOptions) => {
    let canvasPos: iPoint = Point();
    return setupMoveEvents(space, {
        startMove(pos: iPosition){
            canvasPos = Point(space.position.center);
            return options?.enable ? options.enable() : true;
        },
        move(pos: iPosition, shift: iPosition){
            space.position.center = canvasPos.add(shift);
        },
        scale(factor: number){
            if (!options?.enable || options.enable())
                space.position.scale = (space.position.scale || 1) * factor;
        },
        rotate(dAngle: number, rotationCenter: iPosition){
            if (!options?.enable || options.enable()){
                changeRotationCenter(space.transform(rotationCenter), space.position);
                space.position.angle = (space.position.angle || 0) + dAngle;
            }
        }
    }, options);
}