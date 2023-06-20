import { tAnimationFunc } from "./animation";
import { iSpace } from "./space";

interface iSize {
    w: number;
    h: number;
};

interface iCrop {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
}


type tScanDirection = 'horizontal' | 'vertical' | 'horizontal-inverse' | 'vertical-inverse';


interface iRasterFrameProps {
    left: number;
    top: number;
    width: number;
    height: number;
}

type tFrameProps = iRasterFrameProps;

interface iSpriteAnimation {
    frameCount: number;
    getFrame: (index: number) => tFrameProps
    defaultIndex?: number;
};

interface iSpriteDrawerOptions {
    url?: string;
    content?: string | SVGElement;
    base64?: string;
    crop?: iCrop;
    dataType?: string;
    animationConfig?: iSpriteAnimation;
    size?: iSize;
    drawLoading?: (ctx: CanvasRenderingContext2D) => void;
    space?: iSpace;  // for redraw on load.
};

interface iSpriteDrawer {
    url: string;
    reloadImage: (props?: iSpriteDrawerOptions) => void;
    loaded: boolean;
    frame?: tFrameProps;
    animationConfig?: iSpriteAnimation;
    draw: (ctx: CanvasRenderingContext2D) => void;
    animate: (frameRate: number, times?: number) => tAnimationFunc;
}


const getImageUrl = ({url, content, base64, dataType='image/svg+xml'}: iSpriteDrawerOptions): string => {
    if (!url && !content && !base64)
        throw TypeError("You should initialize sprite drawer with url, content or base64");

    if (url)
        return url;

    let b64 = base64;
    if (!b64 && content){
        if (content instanceof SVGElement)
            b64 = window.btoa(content.outerHTML);
        else
            b64 = window.btoa(content);
    }
    return `data:${dataType};base64,${b64}`;
}


export const SpriteDrawer = ({
        size={w: 0, h: 0}, drawLoading, space, crop={}, animationConfig,
        ...options
    }: iSpriteDrawerOptions): iSpriteDrawer => 
{
    const img = new Image(size.w ? size.w : undefined, size.h ? size.h : undefined);

    const _drawLoading = drawLoading || ((ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.fillStyle = '#00000080';
        const w = size.w || 100, h = size.h || 100;
        ctx.rect(-w/2, -h/2, w, h);
        ctx.fill();
        ctx.closePath();
    });

    const drawImage = (ctx: CanvasRenderingContext2D, sprite: iSpriteDrawer) => {
        const _crop = {
            left: crop.left || 0,
            top: crop.top || 0,
            width: crop.width || 0,
            height: crop.height || 0
        };
        let w = size.w, h = size.h;
        if (sprite.frame) {
            Object.assign(_crop, sprite.frame);
            w = sprite.frame.width;
            h = sprite.frame.height;
        }
        ctx.drawImage(
            img, 
            _crop.left, _crop.top, _crop.width, _crop.height, 
            -w/2, -h/2, w, h
        );
    };

    const result: iSpriteDrawer = {
        loaded: false,
        frame: undefined,
        animationConfig,
        url: getImageUrl(options),
        reloadImage(props?: iSpriteDrawerOptions){
            if (props)
                this.url = getImageUrl(props);
            else
                this.url = getImageUrl(options);
            img.src = this.url;
        },
        draw(ctx: CanvasRenderingContext2D) {
            if (!this.loaded)
                _drawLoading(ctx);
            else
                drawImage(ctx, this);
        },
        animate(frameRate: number, times?: number){
            if (!this.animationConfig){
                return (ts: number) => false;
            }
            const dt = 1000 / frameRate;
            const frameCount = (this.animationConfig?.frameCount || 1);
            return (ts: number) => {
                const i = (0 | (ts / dt));
                const index = i % frameCount;
                this.frame = this.animationConfig?.getFrame(index);
                return times === undefined || i / frameCount < times;
            }
        }
    }

    if (animationConfig){
        result.frame = animationConfig.getFrame(animationConfig.defaultIndex || 0);
    }
    
    img.onload = () => {
        result.loaded = true;
        if (size.w === 0){
            size.w = img.naturalWidth - (crop.left || 0);
            size.h = img.naturalHeight - (crop.top || 0);
        }
        crop.width = crop.width || (img.naturalWidth - (crop.left || 0));
        crop.height = crop.height || (img.naturalHeight - (crop.top || 0));
        if (space)
            space.draw();
    };
    img.src = result.url;

    return result;
}