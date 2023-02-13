import { iPosition } from "../positioning"
import { iSpace } from "../space";

type tPosListener = (pos: iPosition, e: MouseEvent) => void;
type tPosEvent = 'click' | 'mousedown' | 'mouseup' | 'mousemove' | 'contextmenu';

export const addPosEventListener = (space: iSpace, eventName: tPosEvent, listener: tPosListener) => {
    space.canvas.addEventListener(eventName, (e: MouseEvent) => {
        listener({x: e.offsetX, y: e.offsetY}, e);
    })
}