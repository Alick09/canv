import { iObject } from "../drawable";
import { iPosition } from "../positioning";
import { iSpace } from "../space";

interface iGetAll {
    space: iSpace;
    pos: iPosition;
    filter?: (obj: iObject) => boolean;
    prepare?: (obj: iObject) => boolean;
}

interface iFind extends iGetAll {
    getFirst?: boolean;
}

export const findUnderTouch = ({space, pos, filter, prepare, getFirst=false} : iFind): iObject | null => {
    let result: iObject | null = null;
    space.allObjects().forEach(o => {
        prepare ? prepare(o) : null;
        if ((!getFirst || result == null) && (!filter || filter(o)) && o.checkInside(pos))
            result = o;
    });
    return result;
}

export const allUnderTouch = ({space, pos, filter, prepare}: iGetAll): iObject[] => {
    return space.allObjects().filter(o => {
        prepare ? prepare(o) : null;
        return (!filter || filter(o)) && o.checkInside(pos);
    });
}