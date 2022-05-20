import {Space, SpriteDrawer} from 'canv';
import { createGridCells } from './utils/gen';


const makeImage = (x, y, spriteDrawer) => {
    return {
        x, y, scale: 0.8,
        data: spriteDrawer,
        draw(ctx){
            spriteDrawer.draw(ctx);
        }
    }
}


export const spriteAnimationDemo = (canvas) => {
    const s = Space(canvas, {scale: 0.4});
    s.addDrawable(createGridCells({mainStep: 200}));
    s.addDrawable(makeImage(0, -200, SpriteDrawer({url: "./resources/bunny_animation.png", space: s})));
    const anim = s.addDrawable(makeImage(0, 200, SpriteDrawer({
        url: "./resources/bunny_animation.png", 
        space: s, 
        animationConfig: {
            frameCount: 8,
            getFrame: (index) => {
                return {left: index * 200, top: 0, width: 200, height: 238}
            }
        }
    })));
    anim.animate({animation: anim.data.animate(10, 3.5)});  // frameRate, animationLoops
    anim.animate({animation: anim.data.animate(20, 7), putToQueue: true});
    s.draw();
};