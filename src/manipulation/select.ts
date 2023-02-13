import { iPosition } from "../positioning";
import { iObject } from "../drawable";
import { iSpace } from "../space"
import { findUnderTouch } from "./search";
import { addPosEventListener } from "./events";

interface iChooseOptions {
    firstIfMany?: boolean
}

type tObjHandler = (obj?:iObject) => void;

export const installSelection = (space: iSpace, options?: iChooseOptions) => {
    options = options || {firstIfMany: false};
    const {firstIfMany} = options;
    const handlers: tObjHandler[] = [];
    addPosEventListener(space, 'click', (pos: iPosition) => {
        let result = findUnderTouch({
            space, pos, getFirst: firstIfMany, filter: o=>o.selectable,
            prepare: (o) => o.selected(false)
        });
        if (result !== null)
            result.selected(true);
        handlers.forEach(h => h(result || undefined));
        space.draw();
    });
    const resp = {
        onSelected(func: (obj?:iObject) => void){
            handlers.push(func);
        }
    };
    return resp;
};


export const installClicks = (space: iSpace, options?: iChooseOptions) => {
    options = options || {firstIfMany: false};
    const {firstIfMany} = options;
    addPosEventListener(space, 'click', (pos: iPosition) => {
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