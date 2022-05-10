import { iObject } from "../drawable";
import { iPosition } from "../positioning";
import { iSpace } from "../space";

interface iFind {
    space: iSpace;
    pos: iPosition;
    filter?: (obj: iObject) => boolean;
    getFirst?: boolean;
    prepare?: (obj: iObject) => boolean;
}

export const findUnderTouch = ({space, pos, filter, prepare, getFirst=false} : iFind): iObject | null => {
    let result: iObject | null = null;
    space.objects.forEach(o => {
        prepare ? prepare(o) : null;
        if ((!getFirst || result == null) && (!filter || filter(o)) && o.checkInside(pos))
            result = o;
    });
    return result;
}