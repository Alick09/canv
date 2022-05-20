import {Space, SpriteDrawer, installCanvasControll} from 'canv';
import { createGridCells } from './utils/gen';


const makeImage = (x, y, scale, spriteDrawer) => {
    return {
        x, y, scale,
        draw(ctx){
            spriteDrawer.draw(ctx);
        }
    }
}


export const spriteDemo = (canvas) => {
    const s = Space(canvas, {scale: 0.6});
    s.addDrawable(createGridCells({mainStep: 200}));
    s.addDrawable(makeImage(-500, 0, 0.5, SpriteDrawer({url: "./resources/lenna.png", space: s, crop: {left: 200}})));
    s.addDrawable(makeImage(0, 0, 1.2, SpriteDrawer({url: "./resources/logo.svg", space: s})));
    s.addDrawable(makeImage(500, 0, 5.0, SpriteDrawer({content: `
        <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.926 11.3664C25.926 10.3408 25.364 9.45492 24.5371 8.97401V2.33903C24.5371 1.95926 24.2342 0.949707 23.1482 0.949707C22.8392 0.949707 22.5324 1.05301 22.2811 1.25439L18.5905 4.20709C16.7368 5.68886 14.4095 6.50526 12.0371 6.50526H3.7038C2.16952 6.50526 0.926025 7.74875 0.926025 9.28304V13.4497C0.926025 14.984 2.16952 16.2275 3.7038 16.2275H5.16648C5.10615 16.6823 5.07186 17.145 5.07186 17.6164C5.07186 19.3425 5.47377 20.9736 6.18123 22.4315C6.40649 22.8955 6.89825 23.1719 7.41387 23.1719H10.6378C11.7685 23.1719 12.4473 21.8768 11.762 20.9775C11.0502 20.0435 10.627 18.8785 10.627 17.6164C10.627 17.1342 10.6973 16.6706 10.8184 16.2275H12.0371C14.4095 16.2275 16.7368 17.0439 18.5901 18.5257L22.2806 21.4784C22.5268 21.6753 22.8326 21.7828 23.1478 21.783C24.2294 21.783 24.5367 20.7943 24.5367 20.3941V13.7592C25.364 13.2778 25.926 12.392 25.926 11.3664ZM21.7594 17.5044L20.3249 16.3568C17.9811 14.4818 15.0371 13.4497 12.0371 13.4497V9.28304C15.0371 9.28304 17.9811 8.25092 20.3249 6.37592L21.7594 5.22835V17.5044Z" fill="black"/>
        </svg>    
    `, space: s})));
    installCanvasControll(s, {disableRotation: true});
    s.draw();
};