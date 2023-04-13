import { iPosition } from "../positioning";
import { iObject } from "../drawable";
import { iSpace } from "../space"
import { findUnderTouch } from "./search";
import { addPosEventListener } from "./events";

interface iChooseOptions {
    firstIfMany?: boolean,
    filter?: (o: iObject)=>boolean;
}

type tObjHandler = (obj?:iObject) => void;

export const installSelection = (space: iSpace, options: iChooseOptions = {}) => {
    options = Object.assign(
        {
            firstIfMany: false, 
            filter: (o: iObject)=>o.selectable
        }, options
    );
    const handlers: tObjHandler[] = [];
    addPosEventListener(space, 'click', (pos: iPosition) => {
        let result = findUnderTouch({
            space, pos, getFirst: options.firstIfMany, filter: options.filter,
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


export const installClicks = (space: iSpace, options: iChooseOptions = {}) => {
    options = Object.assign(
        {
            firstIfMany: false, 
            filter: (o: iObject)=>o.clickable()
        }, options
    );
    addPosEventListener(space, 'click', (pos: iPosition) => {
        let result = findUnderTouch({
            space, pos, getFirst: options.firstIfMany, filter: options.filter,
        });
        if (result !== null)
            result.click();
        space.draw();
    });
    const resp = {
        
    };
    return resp;
};