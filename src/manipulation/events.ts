import { iPosition } from "../positioning"
import { iSpace } from "../space";

type tPosListener = (pos: iPosition) => void;
type tPosEvent = 'click' | 'mousedown';

export const addPosEvenListener = (space: iSpace, eventName: tPosEvent, listener: tPosListener) => {
    space.canvas.addEventListener(eventName, (e: MouseEvent) => {
        listener({x: e.offsetX, y: e.offsetY});
    })
}