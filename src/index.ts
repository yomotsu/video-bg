const ua = navigator.userAgent;
const IS_OS = /iPad|iPhone|iPod/i.test( ua );
const IS_ANDROID = /android/i.test( ua );
const IS_MOBILE = IS_OS || IS_ANDROID;
const IS_CHROME = /Chrome\/(\d+)/.test( navigator.userAgent );
const I_SAFARI_VERSION = ( () => {

	const raw = navigator.appVersion.match( /OS (\d+)/ );
	return IS_OS ? ( raw ? parseInt( raw [1 ], 10 ) : 0 ) : undefined;

} )();
const A_CHROME_VERSION = ( () => {

	const raw = navigator.appVersion.match( /Chrome\/(\d+)/ );
	return IS_ANDROID && IS_CHROME ? ( raw ? parseInt( raw [1 ], 10 ) : 0 ) : undefined;

} )();


const CAN_AUTOPLAY = (
	! IS_MOBILE ||
	( IS_OS && I_SAFARI_VERSION as number >= 10 ) ||
	( IS_ANDROID && A_CHROME_VERSION as number >= 53 ) ||
	( IS_ANDROID && ! IS_CHROME ) // Android Firefox and others but not chrome
);

interface VideoBGParam {
	container: HTMLElement;
	srcSmall: string;
	srcLarge: string;
	imageSrc: string;
	aspect: number;
	fitToViewport: boolean;
}

export default class VideoBG {

	private _$container!: HTMLElement;
	private _$media!: HTMLVideoElement | HTMLImageElement;
	private _mediaAspect = 1;
	private _fitToViewport = false;

	constructor( params: VideoBGParam ) {

		this._$container = params.container;
		this._mediaAspect = params.aspect;
		this._fitToViewport = params.fitToViewport;
		this._$media;

		if ( CAN_AUTOPLAY ) {

			this._$media = document.createElement( 'video' );
			this._$media.muted = true;
			this._$media.setAttribute( 'muted', 'muted' );
			this._$media.loop = true;
			this._$media.setAttribute( 'loop', 'loop' );
			this._$media.autoplay = true;
			this._$media.setAttribute( 'autoplay', 'autoplay' );
			this._$media.setAttribute( 'playsinline', 'playsinline' );
			this._$media.src = IS_MOBILE ? params.srcSmall : params.srcLarge;
			this._$container.appendChild( this._$media );

			this._$media.addEventListener( 'canplaythrough', () => ( this._$media as HTMLVideoElement ).play() );

		} else {

			this._$media = new Image();
			this._$media.setAttribute( 'src', params.imageSrc );
			this._$container.appendChild( this._$media );

		}

		this._$media.style.position = 'absolute';
		this._$media.style.top = '50%';
		this._$media.style.left = '50%';
		this._$media.style.transform = 'translateX( -50% ) translateY( -50% )';

		const containerStyle = window.getComputedStyle( this._$container );
		this._$container.style.overflow = 'hidden';
		this._$container.style.position = containerStyle.position === 'static' ? 'relative' : '';
		this._$container.style.height = this._fitToViewport ? '100vh' : '';

		if ( IS_MOBILE && this._fitToViewport ) {

			this.fitToViewport();
			window.addEventListener( 'orientationchange', () => this.fitToViewport() );

		} else {

			this.objectFit();
			window.addEventListener( 'resize', () => this.objectFit() );

		}

	}

	fitToViewport() {

		this._$container.style.height = `${ document.documentElement.clientHeight }px`;

	}

	objectFit() {

		const rect = this._$container.getBoundingClientRect();
		const stageAspect = rect.width / rect.height;

		if ( stageAspect > this._mediaAspect ) {

			this._$media.width = rect.width;
			this._$media.height = rect.width / this._mediaAspect;

		} else {

			this._$media.width = rect.height * this._mediaAspect;
			this._$media.height = rect.height;

		}

	}

}
