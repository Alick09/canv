import { iPosition } from "../positioning";
import { iObject } from "../drawable";
import { iSpace } from "../space"
import { findUnderTouch } from "./search";
import { addPosEvenListener } from "./events";

interface iChooseOptions {
    firstIfMany?: boolean
}

export const installSelection = (space: iSpace, options?: iChooseOptions) => {
    options = options || {firstIfMany: false};
    const {firstIfMany} = options;
    addPosEvenListener(space, 'click', (pos: iPosition) => {
        let result = findUnderTouch({
            space, pos, getFirst: firstIfMany, filter: o=>o.selectable,
            prepare: (o) => o.selected(false)
        });
        if (result !== null)
            result.selected(true);
        space.draw();
    });
    const resp = {
        
    };
    return resp;
};


export const installClicks = (space: iSpace, options?: iChooseOptions) => {
    options = options || {firstIfMany: false};
    const {firstIfMany} = options;
    addPosEvenListener(space, 'click', (pos: iPosition) => {
        let result = findUnderTouch({
            space, pos, getFirst: firstIfMany, filter: o=>o.clickable(),
        });
        if (result !== null)
            result.click();
        space.draw();
    });
    const resp = {
        
    };
    return resp;
};