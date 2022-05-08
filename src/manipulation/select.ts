import { iPosition } from "../positioning";
import { iObject } from "../drawable";
import { iSpace } from "../space"
import { findUnderTouch } from "./search";



export const installSelection = (space: iSpace) => {
    space.canvas.addEventListener('click', (e) => {
        clicked({x: e.offsetX, y: e.offsetY});
    });
    const clicked = (pos: iPosition) => {
        let result = findUnderTouch({space, pos});
        console.log(result);
        if (result !== null)
            result.selected(true);
        space.draw();
    }
    const resp = {
        
    };

    return resp;
}