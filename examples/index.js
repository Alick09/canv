import { Space } from 'canv';
import { simpleDemo } from './simple';
import { animationDemo } from "./animation";
import { selectionDemo } from './selection';
import { spriteDemo } from './sprite';
import { spriteAnimationDemo } from './spriteAnimation';
import { mapDemo } from './map';

const demoCollection = {
    simple: simpleDemo,
    animation: animationDemo,
    selection: selectionDemo,
    sprite: spriteDemo,
    spriteAnimation: spriteAnimationDemo,
    map: mapDemo
}

window.onload = () => {
    let canvas = document.getElementById('canvas');
    let space = null;
    document.getElementById('demo-selector').onchange = function(){
        const newCanvas = canvas.cloneNode(true);
        if (space)
            space.reset();
        canvas.parentNode.replaceChild(newCanvas, canvas);
        canvas = newCanvas;
        space = demoCollection[this.value](canvas);
    };
    document.getElementById('demo-selector').onchange();
};