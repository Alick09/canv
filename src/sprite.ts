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


interface iSpriteDrawer {
    url?: string;
    content?: string;
    base64?: string;
    patchSize?: iSize;
    primaryScanDirection?: tScanDirection;
    secondaryScanDirection?: tScanDirection;
    crop?: iCrop;
    rows?: number[];
    columns?: number[];
    frameRate?: number;
    svgAnimationIds?: string[];
    dataType?: string;
    size?: iSize;
    drawLoading?: (ctx: CanvasRenderingContext2D) => void;
    space?: iSpace;  // for redraw on load.
};


const getImageUrl = ({url, content, base64, dataType='image/svg+xml'}: iSpriteDrawer) => {
    if (!url && !content && !base64)
        throw TypeError("You should initialize sprite drawer with url, content or base64");

    if (url)
        return url;

    let b64 = base64;
    if (!b64 && content){
        b64 = btoa(content);
    }
    return `data:${dataType};base64,${b64}`;
}


export const SpriteDrawer = ({
        patchSize, size={w: 0, h: 0}, drawLoading, space, crop={},
        ...options
    }: iSpriteDrawer) => 
{
    const img = new Image(size.w ? size.w : undefined, size.h ? size.h : undefined);
    const url = getImageUrl(options);

    const _drawLoading = drawLoading || ((ctx: CanvasRenderingContext2D) => {
        ctx.beginPath();
        ctx.fillStyle = '#00000080';
        const w = size.w || 100, h = size.h || 100;
        ctx.rect(-w/2, -h/2, w, h);
        ctx.fill();
        ctx.closePath();
    });

    const result = {
        loaded: false,
        draw(ctx: CanvasRenderingContext2D) {
            if (!this.loaded)
                _drawLoading(ctx);
            else
                ctx.drawImage(
                    img, 
                    crop.left || 0, crop.top || 0, crop.width || 0, crop.height || 0, 
                    -size.w/2, -size.h/2, size.w, size.h
                );
        }
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
    img.src = url;

    return result;
}