/**
 * Modules in this bundle
 * @license
 *
 * cool-photo.js:
 *   license: appleple
 *   author: appleple
 *   homepage: http://developer.a-blogcms.jp
 *   version: 1.0.0
 *
 * This header is generated by licensify (https://github.com/twada/licensify)
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var coolPhoto = require('../index');
console.log(coolPhoto);

var applyJQuery = function applyJQuery(jQuery) {
	jQuery.fn.coolPhoto = function (settings) {
		return this.each(function () {
			if (typeof settings === 'strings') {
				if (settings === 'destroy') {}
			} else {
				new coolPhoto(this, settings);
			}
		});
	};
};

if (typeof define === 'function' && define.amd) {
	define(['jquery'], applyJQuery);
} else {
	var jq = window.jQuery ? window.jQuery : window.$;
	if (typeof jq !== 'undefined') {
		applyJQuery(jq);
	}
}

module.exports = applyJQuery;

},{"../index":3}],2:[function(require,module,exports){
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var extend = require('../lib/extend');
var dom = require('../lib/dom');
var assets = [];

var defaults = {
	classNames: {
		coolPhoto: 'cool-photo',
		coolPhotoClose: 'cool-photo-close',
		coolPhotoBody: 'cool-photo-body',
		coolPhotoInner: 'cool-photo-inner',
		coolPhotoImg: 'cool-photo-img',
		coolPhotoArrows: 'cool-photo-arrows',
		coolPhotoArrowRight: 'cool-photo-arrow-right',
		coolPhotoArrowLeft: 'cool-photo-arrow-left',
		coolPhotoImgLeft: 'cool-photo-img-left',
		coolPhotoImgRight: 'cool-photo-img-right'
	},
	arrows: true,
	dots: true,
	animationSpeed: 300,
	swipeOffset: 100
};

var coolPhoto = function () {
	function coolPhoto(element, settings) {
		var _this = this;

		_classCallCheck(this, coolPhoto);

		settings = extend({}, defaults, settings);
		this.element = element;
		this.settings = settings;
		this.index = this.addNewAsset();
		element.setAttribute('data-index', this.index);
		element.addEventListener('click', function (event) {
			_this.render();
			_this.dispatchEvent();
			event.preventDefault();
		});
	}

	_createClass(coolPhoto, [{
		key: 'dispatchEvent',
		value: function dispatchEvent() {
			var element = this.element.nextElementSibling;
			element.addEventListener('click', this.onClick.bind(this));
			element.addEventListener('mousedown', this.onTouchStart.bind(this));
			element.addEventListener('mousemove', this.onTouchMove.bind(this));
			element.addEventListener('mouseup', this.onTouchEnd.bind(this));
		}
	}, {
		key: 'onClick',
		value: function onClick(event) {
			var element = this.element.nextElementSibling;
			var settings = this.settings;
			var index = this.index;
			var target = event.target;
			if (dom.hasClass(target, settings.classNames.coolPhotoArrowLeft)) {
				var _event = new Event('click');
				this.removeComponent();
				assets[index - 1].element.dispatchEvent(_event);
			} else if (dom.hasClass(target, settings.classNames.coolPhotoArrowRight)) {
				var _event2 = new Event('click');
				this.removeComponent();
				assets[index + 1].element.dispatchEvent(_event2);
			} else if (!dom.hasClass(target, settings.classNames.coolPhotoImg)) {
				this.removeComponent();
			}
		}
	}, {
		key: 'onTouchStart',
		value: function onTouchStart(event) {
			var target = event.target;
			var settings = this.settings;
			if (dom.hasClass(target, settings.classNames.coolPhotoImg)) {
				var pos = this.getTouchPos(event);
				this.isSwipable = true;
				this.pos = { x: 0, y: 0 };
				this.oldPos = pos;
			}
			event.preventDefault();
		}
	}, {
		key: 'onTouchMove',
		value: function onTouchMove(event) {
			var target = event.target;
			var settings = this.settings;
			if (dom.hasClass(target, settings.classNames.coolPhotoImg) && this.isSwipable) {
				var pos = this.getTouchPos(event);
				var x = pos.x - this.oldPos.x;
				this.pos.x += x;
				target.style.transform = 'translateX(' + this.pos.x + 'px)';
				this.oldPos = pos;
			}
			event.preventDefault();
		}
	}, {
		key: 'onTouchEnd',
		value: function onTouchEnd(event) {
			var _this2 = this;

			var element = this.element.nextElementSibling;
			var settings = this.settings;
			var target = event.target;
			var photoImg = element.querySelector('.' + settings.classNames.coolPhotoImg);
			var nextIndex = this.index;
			if (this.isSwipable) {
				if (this.pos.x < -this.settings.swipeOffset) {
					photoImg.style = 'transition: all .3s;';
					setTimeout(function () {
						dom.addClass(photoImg, _this2.settings.classNames.coolPhotoImgRight);
					}, 1);
					nextIndex++;
				} else if (this.pos.x > this.settings.swipeOffset) {
					photoImg.style = 'transition: all .3s;';
					setTimeout(function () {
						dom.addClass(photoImg, _this2.settings.classNames.coolPhotoImgLeft);
					}, 1);
					nextIndex--;
				}
				setTimeout(function () {
					_this2.removeComponent();
					var event = new Event('click');
					assets[nextIndex].element.dispatchEvent(event);
				}, settings.animationSpeed);
				this.isSwipable = false;
			}
		}
	}, {
		key: 'getTouchPos',
		value: function getTouchPos(e) {
			var x = 0;
			var y = 0;
			if (event && event.originalEvent && event.originalEvent.touches && event.originalEvent.touches[0].pageX) {
				x = event.originalEvent.touches[0].pageX;
				y = event.originalEvent.touches[0].pageY;
			} else if (event.pageX) {
				x = event.pageX;
				y = event.pageY;
			}
			return { x: x, y: y };
		}
	}, {
		key: 'addNewAsset',
		value: function addNewAsset() {
			var element = this.element;
			var src = element.getAttribute('href');
			assets.push({
				src: src,
				element: element
			});
			return assets.length - 1;
		}
	}, {
		key: 'getAsset',
		value: function getAsset(index) {
			return assets[index];
		}
	}, {
		key: 'removeComponent',
		value: function removeComponent() {
			var element = this.element.nextElementSibling;
			var settings = this.settings;
			dom.addClass(element, settings.classNames.coolPhotoClose);
			// element.removeEventListener('click');
			setTimeout(function () {
				dom.remove(element);
			}, settings.animationSpeed);
		}
	}, {
		key: 'render',
		value: function render() {
			var element = this.element;
			var settings = this.settings;
			var index = parseInt(element.getAttribute('data-index'));
			var src = assets[index].src;
			var html = '\n\t\t\t<div class="' + settings.classNames.coolPhoto + '">\n\t\t\t\t<div class="' + settings.classNames.coolPhotoBody + '">\n\t\t\t\t\t<div class="' + settings.classNames.coolPhotoInner + '">\n\t\t\t\t\t\t<img src="' + src + '" class="' + settings.classNames.coolPhotoImg + '">\n\t\t\t\t\t\t' + (settings.arrows ? '\n\t\t\t\t\t\t\t<ul class="' + settings.classNames.coolPhotoArrows + '">\n\t\t\t\t\t\t\t\t' + (index > 0 ? '\n\t\t\t\t\t\t\t\t\t<li class="' + settings.classNames.coolPhotoArrowLeft + '" data-index="' + (index - 1) + '"></li>\n\t\t\t\t\t\t\t\t' : '') + '\n\t\t\t\t\t\t\t\t' + (index !== assets.length - 1 ? '\n\t\t\t\t\t\t\t\t\t<li class="' + settings.classNames.coolPhotoArrowRight + '" data-index="' + (index + 1) + '"></li>\n\t\t\t\t\t\t\t\t' : '') + '\n\t\t\t\t\t\t\t</ul>\n\t\t\t\t\t\t' : '') + '\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t';
			element.insertAdjacentHTML('afterend', html);
		}
	}]);

	return coolPhoto;
}();

module.exports = coolPhoto;

},{"../lib/dom":4,"../lib/extend":5}],3:[function(require,module,exports){
'use strict';

module.exports = require('./core/');

},{"./core/":2}],4:[function(require,module,exports){
'use strict';

module.exports.addClass = function (element, className) {
	if (element.classList) {
		element.classList.add(className);
	} else {
		if (element.className) {
			element.className += ' ' + className;
		} else {
			element.className = className;
		}
	}
};

module.exports.hasClass = function (element, className) {
	if (element.classList) {
		return element.classList.contains(className);
	} else {
		return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
	}
};

module.exports.remove = function (element) {
	element.parentNode.removeChild(element);
};

},{}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function deepExtend(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj) {
      continue;
    }

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (_typeof(obj[key]) === 'object') out[key] = deepExtend(out[key], obj[key]);else out[key] = obj[key];
      }
    }
  }

  return out;
};

module.exports = deepExtend;

},{}]},{},[1]);
