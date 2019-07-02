interface VideoBGParam {
    container: HTMLElement;
    srcSmall: string;
    srcLarge: string;
    imageSrc: string;
    aspect: number;
    fitToViewport: boolean;
}
export default class VideoBG {
    private _$container;
    private _$media;
    private _mediaAspect;
    private _fitToViewport;
    constructor(params: VideoBGParam);
    fitToViewport(): void;
    objectFit(): void;
}
export {};
