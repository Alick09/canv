<p align="center">
  <img src="https://raw.githubusercontent.com/Alick09/canv/main/docs/resources/logo.svg" alt="Canv's logo" width="300"/>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/canv"><img src="https://img.shields.io/npm/v/canv" alt="npm" /></a>
  <img alt="GitHub code size in bytes" src="https://img.shields.io/github/languages/code-size/Alick09/canv">
  <img src="https://img.shields.io/bundlephobia/minzip/canv" alt="npm bundle size" />
  <img src="https://img.shields.io/github/last-commit/Alick09/canv" alt="GitHub last commit" />
</p>


## Demo page: [Demo](https://alick09.github.io/canv/)

# Introduction

This package is very simple with no dependencies and will help to implement a lot of useful features on canvas.
This is main features:
* Object oriented flow
* Easy work with images and sprites
* Easy to implement animation (game or just beautiful effect)
* Setup interactions (select or move objects on canvas, pinch and zoom, mobile support, etc)
* Tha base part of Canv is space. It could be moved, scaled and rotated.
* Objects can contain children and it would work as you expect
* There are many options for objects to make them work as you want

# Installation
```
npm install canv
```

# Quick example

```js
import {Space} from 'canv';

window.onload = () => {
    const s = Space(document.getElementById('canvas'), {scale: 0.7});
    s.addDrawable({
        x: 0, y: 0,
        draw(ctx){
            ctx.beginPath();
            ctx.fillStyle = '#000';
            ctx.rect(-100, -100, 200, 200);
            ctx.fill();
            ctx.closePath();
        }
    });
    s.draw();
};
```


# API reference

## Space(canvas: HTMLCanvasElement, options: iSpaceOptions) => iSpace
> See all interface details in src/space.ts file

**options (iSpaceOptions)**
- `pixelRatio` - (*optional*, number) - set if you need to set your custom pixelRatio
- `onResize` - (*optional*, () => void) - onResize handler (pixelRatio will be ignored if this param set)
- `setupAutoResize` - (*optional*, boolean) - flag to setup resize handler or not (default true)
- `animationTick` - (*optional*, (ts: number) => void) - set if you have dynamic content which should be always animated. The parameter of function is timestamp

**properties**
- `canvas` - (HTMLCanvasElement) -  canvas you are bringing to space as a first param
- `objects` - (iObject[]) - all objects of a space
- `pixelRatio` - (number) - canvas pixel ratio
- `position` - (iPositioning) - some positional information (see interface section for details)
- `options` - (iSpaceOptions) - options of space (from constructor)

**methods**
- `addDrawable(drawable)` - add drawable as object to the space
- `draw()` - draws everything
- `launch()` - should be called if you set animationTick in options
- `transform(pos)` - transforms position from page space to the current space.


## Drawable
> Usefull interface for creating new object
- `x` - (number)
- `y` - (number)
- `draw` - (tDrawFunction)
- `data` - (*optional*, any) - data can be used in animation (see examples/animation.js)
- `angle` - (*optional*, number) - default 0
- `scale` - (*optional*, number) - default 1
- `rotationCenter` - (*optional*, iPosition) - default (0, 0) *(center)*
- `hidden` - (*optional*, boolean) - default false
- `children` - (*optional*, iDrawable[])
- `checkInside` - (*optional*, tCheckInside) - checker to make interactions work (selecting, clicking, dragging objects) - see examples/selection.js
- `selectable` - (*optional*, boolean) - default false, works with checkInside only
- `fixedOrientation` - (*optional*, boolean) - default false, set true to preserve angle of object while rotating space.
- `fixedPosition` - (*optional*, boolean) - default false, set true to preserve position (useful for things like hud)
- `onClick` - (*optional*, (pos: iPosition) => void) - click handler (see examples/animation.js)

## Object
> All objects in space stores as Objects not Drawables
- `parent` - (*iObject | iSpace*) - parent node
- `orig` - (*iDrawable*)
- `selectable` - (*boolean*)
- `data` - (*any*)
- `getSpace` - (*() => iSpace*)
- `position` - (*iPositioning*)
- `draw` - (*tDrawFunction*)
- `checkInside` - (*tCheckInside*)
- `inAnimationLoop` - (*boolean*)
- `click` - (*()=>void*)
- `clickable` - (*()=>boolean*)
- `selected` - (*(val?:boolean) => boolean*)
- `transform` - (*(position: iPosition) => iPosition*)
- `animate` - (*(options: iAnimateOptions) => void*)
- `applyAnimation` - (*tAnimationFunc*)
- `stopAnimation` - (*(all?: boolean) => void*)


# Interaction tools

To make some interaction methods work you need install them.
So there are several methods for installing this methods:
- `installSelection(space)` - install it to make object selection possible in your project
- `installClicks(space)` - to make click on object work
- `installCanvasControll(space)` - the biggest feature which allows you to scale using wheel, move canvas space dragging with mouse and use touch features like pinch-n-zoom and rotate (with 2 fingers).


# Contribution

1. `npm uninstall canv` if you've installed it already
1. git clone this repo
1. run `npm i && npm run build` (or `npm run watch`)
1. run `npm link`
1. then you can import this library usual way `import {Space} from 'canv';`

Here are the list of known issues: <a href="https://github.com/Alick09/canv/issues">Canv issues</a>
