# TODO
1. Sprite animation
1. Interaction - mouse (move, scale, rotate??, select)
1. Touch interaction - pinch and zoom, move, rotate?
1. Preserve rotation
1. Fixed place
1. Select order (last, first)


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


# Space options

pass

# Object

pass

# Animation

pass