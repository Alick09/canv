(()=>{var t={349:function(t){var n;n=()=>(()=>{"use strict";var t={d:(n,e)=>{for(var i in e)t.o(e,i)&&!t.o(n,i)&&Object.defineProperty(n,i,{enumerable:!0,get:e[i]})},o:(t,n)=>Object.prototype.hasOwnProperty.call(t,n),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},n={};t.r(n),t.d(n,{Space:()=>o,SpriteDrawer:()=>f,installCanvasControll:()=>u,installClicks:()=>s,installSelection:()=>c});var e=function(t,n,e){var i=n.center,o=void 0===i?{x:0,y:0}:i,r=n.scale,a=void 0===r?1:r,c=n.angle,s=void 0===c?0:c,l=n.rotationCenter,u=void 0===l?{x:0,y:0}:l;return function(t,n,e){if(0==e)return t;var i={x:t.x-n.x,y:t.y-n.y},o=Math.hypot(i.x,i.y);if(0==o)return t;var r=Math.atan2(i.y,i.x)+e,a=Math.cos(r)*o,c=Math.sin(r)*o;return{x:n.x+a,y:n.y+c}}({x:(t.x-o.x-((null==e?void 0:e.x)||0))/a,y:(t.y-o.y-((null==e?void 0:e.y)||0))/a},u,-s)},i=function(){return i=Object.assign||function(t){for(var n,e=1,i=arguments.length;e<i;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},i.apply(this,arguments)},o=function(t,n){var o=t.getContext("2d");if(null===o)throw TypeError("Can't get context2d from canvas");var r=[],a=function(t,n){var e=t.center,i=t.angle,r=t.rotationCenter,a=t.scale;e&&o.translate(e.x,e.y),n&&o.translate(n.x,n.y),a&&o.scale(a,a),i&&(r&&o.translate(r.x,r.y),o.rotate(i),r&&o.translate(-r.x,-r.y))},c={center:{x:0,y:0},scale:n.scale,angle:n.angle,rotationCenter:Object.assign({x:0,y:0},n.rotationCenter)},s=function(){var t=h.position,n=(h.position.scale||1)*h.pixelRatio;return i(i({},t),{scale:n,center:{x:t.center.x*n,y:t.center.y*n}})},l=n.center||{x:0,y:0},u=function(){var n=(h.position.scale||1)*h.pixelRatio;return{x:t.width/2-n*l.x,y:t.height/2-n*l.y}},f=!1,d=function(){var t=Date.now(),n=!1;r.forEach((function(e){e.applyAnimation(t)&&(n=!0)})),n?(h.draw(),requestAnimationFrame(d)):f=!1},h={options:n,canvas:t,objects:r,pixelRatio:1,position:c,addObject:function(t){return t.parent=this,r.push(t),t},addDrawable:function(t){return this.addObject(function(t){var n={center:{x:t.x||0,y:t.y||0},angle:t.angle,scale:t.scale,rotationCenter:t.rotationCenter};if(t.selectable&&void 0===t.checkInside)throw TypeError("Drawable should have checkInside method to be selectable");var i={selected:!1},o={x:0,y:0},r={func:function(t){return!1},queue:[],start:-1},a=function(t){void 0===t&&(t=-1);var n=r.queue.shift();n&&(r.func=n,r.start=t)};return{parent:void 0,orig:t,inAnimationLoop:!1,selectable:t.selectable||!1,position:n,data:t.data,draw:function(n){return t.draw.call(this,n)},getSpace:function(){if(!this.parent)throw ReferenceError("Couldn't traverse to space from object. Parent is null.");return"selectable"in this.parent?this.parent.getSpace():this.parent},checkInside:function(n){if(!t.checkInside)return!1;var e=this.transform(n),i=t.checkInside.call(this,e);return i&&Object.assign(o,e),i},selected:function(t){return void 0!==t&&(i.selected=t),i.selected},click:function(){t.onClick&&t.onClick(o)},clickable:function(){return void 0!==t.onClick},transform:function(t){var i=this.parent?this.parent.transform(t):t;return e(i,n)},animate:function(t){var n=t.animation,e=t.force,i=void 0!==e&&e,o=t.putToQueue,a=void 0!==o&&o;i||!this.inAnimationLoop?(this.inAnimationLoop=!0,r.func=n,r.start=-1,this.getSpace().triggerAnimation()):a&&r.queue.push(n)},stopAnimation:function(t){void 0===t&&(t=!1),t||0==r.queue.length?this.inAnimationLoop=!1:a()},applyAnimation:function(t){return!!this.inAnimationLoop&&(r.start<0?r.start=t:r.func.call(this,t-r.start)||(0==r.queue.length?this.inAnimationLoop=!1:a(t)),this.inAnimationLoop)}}}(t))},draw:function(){o.clearRect(0,0,t.width,t.height),a(s(),u()),r.forEach((function(t){o.save(),a(t.position),t.draw(o),o.restore()})),o.resetTransform()},triggerAnimation:function(){f||(f=!0,requestAnimationFrame(d))},launch:function(){var t=this;if(this.options.animationTick){var n=this,e=function(){var i;null===(i=t.options.animationTick)||void 0===i||i.call(n,0),t.draw(),requestAnimationFrame(e)};requestAnimationFrame(e)}else console.warn("Set animationTick in space options to make animation work. Ignoring launch.")},transform:function(t){return e(t,s(),u())}};return h.pixelRatio=function(t,n){var e=n.pixelRatio,i=n.onResize,o=n.setupAutoResize,r=1;return(void 0===o||o)&&(i||(r=e||window.devicePixelRatio,i=function(){t.canvas.width=t.canvas.offsetWidth*r,t.canvas.height=t.canvas.offsetHeight*r,t.draw()}),window.onresize=i,i()),r}(h,n),h},r=function(t){var n=t.space,e=t.pos,i=t.filter,o=t.prepare,r=t.getFirst,a=void 0!==r&&r,c=null;return n.objects.forEach((function(t){o&&o(t),a&&null!=c||i&&!i(t)||!t.checkInside(e)||(c=t)})),c},a=function(t,n,e){t.canvas.addEventListener(n,(function(t){e({x:t.offsetX,y:t.offsetY})}))},c=function(t,n){var e=(n=n||{firstIfMany:!1}).firstIfMany;return a(t,"click",(function(n){var i=r({space:t,pos:n,getFirst:e,filter:function(t){return t.selectable},prepare:function(t){return t.selected(!1)}});null!==i&&i.selected(!0),t.draw()})),{}},s=function(t,n){var e=(n=n||{firstIfMany:!1}).firstIfMany;return a(t,"click",(function(n){var i=r({space:t,pos:n,getFirst:e,filter:function(t){return t.clickable()}});null!==i&&i.click(),t.draw()})),{}},l=function(){return l=Object.assign||function(t){for(var n,e=1,i=arguments.length;e<i;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t},l.apply(this,arguments)},u=function(t){t.canvas.style.touchAction="none";var n={startPos:{x:0,y:0},startCanvPos:{x:0,y:0},moving:!1},e=function(e){n.startPos=e,n.startCanvPos=t.position.center||{x:0,y:0},n.moving=!0,t.draw()},i=function(e){if(n.moving){var i=t.position.scale||1;t.position.center={x:n.startCanvPos.x+(e.x-n.startPos.x)/i,y:n.startCanvPos.y+(e.y-n.startPos.y)/i}}t.draw()},o=function(){n.moving=!1,t.draw()},r=function(n){t.position.scale=(t.position.scale||1)*n,t.position.center,t.draw()};t.canvas.addEventListener("wheel",(function(t){r(t.deltaY>.1?.95:t.deltaY<-.1?1.05:1),t.preventDefault()})),a(t,"mousedown",e),a(t,"mouseup",o),a(t,"mousemove",i),function(t,n){var e=n.startMove,i=n.endMove,o=n.move,r=n.scale,a=n.rotate,c={center:void 0,rotate:void 0,distance:void 0,count:0},s=t.canvas.getBoundingClientRect(),u=function(t,n){var u=function(t){var n=Array.from(t).filter((function(t){return t.identifier<2})).sort((function(t,n){return t.identifier-n.identifier})).map((function(t){return{x:t.clientX-s.x,y:t.clientY-s.y}}));if(0==n.length)return{center:void 0,rotate:void 0,distance:void 0};var e=n.reduce((function(t,n){return{x:t.x+n.x,y:t.y+n.y}}),{x:0,y:0}),i={distance:void 0,rotate:void 0,count:n.length};if(n.length>1){var o={x:n[0].x-n[1].x,y:n[0].y-n[1].y};i.distance=Math.hypot(o.x,o.y),i.rotate=Math.atan2(o.y,o.x)}return l({center:{x:e.x/n.length,y:e.y/n.length}},i)}(t.touches);c.distance&&u.distance&&r(u.distance/c.distance),c.rotate&&u.rotate&&a(u.rotate-c.rotate),u.center&&!c.center?e(u.center):!u.center&&c.center?i():u.center&&c.center&&(u.count!==c.count&&e(u.center),o(u.center)),Object.assign(c,u)};t.canvas.addEventListener("touchstart",(function(t){return u(t)})),t.canvas.addEventListener("touchend",(function(t){return u(t)})),t.canvas.addEventListener("touchcancel",(function(t){return u(t)})),t.canvas.addEventListener("touchmove",(function(t){return u(t)}))}(t,{startMove:e,move:i,endMove:o,rotate:function(n){t.position.angle=(t.position.angle||0)+n,t.draw()},scale:r})},f=function(t){var n=t.size,e=void 0===n?{w:0,h:0}:n,i=t.drawLoading,o=t.space,r=t.crop,a=void 0===r?{}:r,c=t.animationConfig,s=function(t,n){var e={};for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&n.indexOf(i)<0&&(e[i]=t[i]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(i=Object.getOwnPropertySymbols(t);o<i.length;o++)n.indexOf(i[o])<0&&Object.prototype.propertyIsEnumerable.call(t,i[o])&&(e[i[o]]=t[i[o]])}return e}(t,["size","drawLoading","space","crop","animationConfig"]),l=new Image(e.w?e.w:void 0,e.h?e.h:void 0),u=function(t){var n=t.url,e=t.content,i=t.base64,o=t.dataType,r=void 0===o?"image/svg+xml":o;if(!n&&!e&&!i)throw TypeError("You should initialize sprite drawer with url, content or base64");if(n)return n;var a=i;return!a&&e&&(a=btoa(e)),"data:".concat(r,";base64,").concat(a)}(s),f=i||function(t){t.beginPath(),t.fillStyle="#00000080";var n=e.w||100,i=e.h||100;t.rect(-n/2,-i/2,n,i),t.fill(),t.closePath()},d={loaded:!1,frame:void 0,animationConfig:c,draw:function(t){this.loaded?function(t,n){var i={left:a.left||0,top:a.top||0,width:a.width||0,height:a.height||0},o=e.w,r=e.h;n.frame&&(Object.assign(i,n.frame),o=n.frame.width,r=n.frame.height),t.drawImage(l,i.left,i.top,i.width,i.height,-o/2,-r/2,o,r)}(t,this):f(t)},animate:function(t,n){var e,i=this;if(!this.animationConfig)return function(t){return!1};var o=1e3/t,r=(null===(e=this.animationConfig)||void 0===e?void 0:e.frameCount)||1;return function(t){var e,a=0|t/o,c=a%r;return i.frame=null===(e=i.animationConfig)||void 0===e?void 0:e.getFrame(c),void 0===n||a/r<n}}};return c&&(d.frame=c.getFrame(c.defaultIndex||0)),l.onload=function(){d.loaded=!0,0===e.w&&(e.w=l.naturalWidth-(a.left||0),e.h=l.naturalHeight-(a.top||0)),a.width=a.width||l.naturalWidth-(a.left||0),a.height=a.height||l.naturalHeight-(a.top||0),o&&o.draw()},l.src=u,d};return n})(),t.exports=n()}},n={};function e(i){var o=n[i];if(void 0!==o)return o.exports;var r=n[i]={exports:{}};return t[i].call(r.exports,r,r.exports,e),r.exports}(()=>{"use strict";var t=e(349);window.onload=()=>{const n=(0,t.Space)(document.getElementById("canvas"),{scale:2,center:{x:0,y:100}});n.addDrawable((({count:t=20,mainStep:n=100,secondaryDivisions:e=2})=>{const i=t*n,o=({ctx:t,pos:n,width:e,color:o="#888",horizontal:r=!0})=>{t.beginPath(),t.lineWidth=e,t.strokeStyle=o,r?(t.moveTo(-i,n),t.lineTo(i,n)):(t.moveTo(n,-i),t.lineTo(n,i)),t.stroke(),t.closePath()};return{x:0,y:0,draw(i){for(let r=-t;r<=t;++r){let a=n*r;if(o({ctx:i,pos:a,width:2,horizontal:!0}),o({ctx:i,pos:a,width:2,horizontal:!1}),r<t)for(let t=1;t<e;++t){const r=a+t/e*n;o({ctx:i,pos:r,color:"#ccc",width:1,horizontal:!0}),o({ctx:i,pos:r,color:"#ccc",width:1,horizontal:!1})}}}}})({mainStep:100,count:2})),n.addDrawable({x:0,y:0,scale:2,...(10,"red",{draw(t){t.beginPath(),t.arc(0,0,10,0,2*Math.PI),t.fillStyle="red",t.fill(),t.closePath()},checkInside:t=>Math.hypot(t.x,t.y)<10})}),(0,t.installCanvasControll)(n),n.draw()}})()})();