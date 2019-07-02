/*!
 * video-bg
 * https://github.com/yomotsu/video-bg
 * (c) 2019 @yomotsu
 * Released under the MIT License.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.VideoBG = factory());
}(this, function () { 'use strict';

	var ua = navigator.userAgent;
	var IS_OS = /iPad|iPhone|iPod/i.test(ua);
	var IS_ANDROID = /android/i.test(ua);
	var IS_MOBILE = IS_OS || IS_ANDROID;
	var IS_CHROME = /Chrome\/(\d+)/.test(navigator.userAgent);
	var I_SAFARI_VERSION = (function () {
	    var raw = navigator.appVersion.match(/OS (\d+)/);
	    return IS_OS ? (raw ? parseInt(raw[1], 10) : 0) : undefined;
	})();
	var A_CHROME_VERSION = (function () {
	    var raw = navigator.appVersion.match(/Chrome\/(\d+)/);
	    return IS_ANDROID && IS_CHROME ? (raw ? parseInt(raw[1], 10) : 0) : undefined;
	})();
	var CAN_AUTOPLAY = (!IS_MOBILE ||
	    (IS_OS && I_SAFARI_VERSION >= 10) ||
	    (IS_ANDROID && A_CHROME_VERSION >= 53) ||
	    (IS_ANDROID && !IS_CHROME));
	var VideoBG = (function () {
	    function VideoBG(params) {
	        var _this = this;
	        this._mediaAspect = 1;
	        this._fitToViewport = false;
	        this._$container = params.container;
	        this._mediaAspect = params.aspect;
	        this._fitToViewport = params.fitToViewport;
	        this._$media;
	        if (CAN_AUTOPLAY) {
	            this._$media = document.createElement('video');
	            this._$media.muted = true;
	            this._$media.setAttribute('muted', 'muted');
	            this._$media.loop = true;
	            this._$media.setAttribute('loop', 'loop');
	            this._$media.autoplay = true;
	            this._$media.setAttribute('autoplay', 'autoplay');
	            this._$media.setAttribute('playsinline', 'playsinline');
	            this._$media.src = IS_MOBILE ? params.srcSmall : params.srcLarge;
	            this._$container.appendChild(this._$media);
	            this._$media.addEventListener('canplaythrough', function () { return _this._$media.play(); });
	        }
	        else {
	            this._$media = new Image();
	            this._$media.setAttribute('src', params.imageSrc);
	            this._$container.appendChild(this._$media);
	        }
	        this._$media.style.position = 'absolute';
	        this._$media.style.top = '50%';
	        this._$media.style.left = '50%';
	        this._$media.style.transform = 'translateX( -50% ) translateY( -50% )';
	        var containerStyle = window.getComputedStyle(this._$container);
	        this._$container.style.overflow = 'hidden';
	        this._$container.style.position = containerStyle.position === 'static' ? 'relative' : '';
	        this._$container.style.height = this._fitToViewport ? '100vh' : '';
	        if (IS_MOBILE && this._fitToViewport) {
	            this.fitToViewport();
	            window.addEventListener('orientationchange', function () { return _this.fitToViewport(); });
	        }
	        else {
	            this.objectFit();
	            window.addEventListener('resize', function () { return _this.objectFit(); });
	        }
	    }
	    VideoBG.prototype.fitToViewport = function () {
	        this._$container.style.height = document.documentElement.clientHeight + "px";
	    };
	    VideoBG.prototype.objectFit = function () {
	        var rect = this._$container.getBoundingClientRect();
	        var stageAspect = rect.width / rect.height;
	        if (stageAspect > this._mediaAspect) {
	            this._$media.width = rect.width;
	            this._$media.height = rect.width / this._mediaAspect;
	        }
	        else {
	            this._$media.width = rect.height * this._mediaAspect;
	            this._$media.height = rect.height;
	        }
	    };
	    return VideoBG;
	}());

	return VideoBG;

}));
