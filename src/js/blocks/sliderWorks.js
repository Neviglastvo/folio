import Swiper from "swiper";
import UniversalTilt from "universal-tilt.js";

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

export default function sliderWorks() {
	let transformDistance = [],
		swiperElements = 2.5,
		mobile = isMobileDevice() && $(window).width() <= 767;

	// console.log(mobile);

	function tiltElements(element) {
		let tiltCfg;

		if (!mobile) {
			// console.log($(window).width());

			tiltCfg = {
				settings: {
					// base: "window",
					max: 7,
					perspective: 1000,
					speed: 1000,
					// scale: 1.1,
					shine: false,
					"shine-opacity": 0.25,
					// reverse: true
				}
			}
		} else {
			tiltCfg = {
				settings: {
					// base: "window",
					disabled: 'x',
					max: 20,
					perspective: 800,
					speed: 2500,
					// scale: 1.1,
					shine: false,
					"shine-opacity": 0.5,
					// reverse: true
				}
			}
		}

		$(element).universalTilt(tiltCfg);

		$(element).addClass("tilting");
	}

	let swiper = new Swiper($(".js-slider-works"), {
		on: {
			init: function() {
				let currentElement = $(this.slides[this.activeIndex]);
				let currentElementTilt = currentElement.children();

				currentElement.addClass("active");
				tiltElements(currentElementTilt);
			}
		},
		// nested: true,
		slidesPerView: swiperElements,
		speed: 700,
		initialSlide: 0,
		// preventInteractionOnTransition: true,
		slideToClickedSlide: true,
		centeredSlides: true,
		parallax: true,
		mousewheel: false,
		lazy: true,
		preloadImages: false,
		loadPrevNext: false,
		loadOnTransitionStart: true,
		resistanceRatio: 0.5,
		// pagination: {
		// 	el: ".js-slider-works-pagination",
		// 	progressbarOpposite: true,
		// 	clickable: true
		// },
		navigation: {
			nextEl: ".js-slider-works-button-next",
			prevEl: ".js-slider-works-button-prev"
		},
		scrollbar: {
			el: ".js-slider-works-scrollbar",
			draggable: false,
			snapOnRelease: true
		},
		breakpoints: {
			768: {
				slidesPerView: swiperElements,
				spaceBetween: 0
			},
			320: {
				slidesPerView: 1,
				spaceBetween: 15
			}
		}
	});

	var oldProgress = swiper.progress;
	let transitionStart;
	let eventType = mobile ? transitionStart = 'progress' : transitionStart = 'progress';

	swiper.on(eventType, function(event) {
		// console.log(eventType);
		let progress = this.progress;

		let moveCheck = function() {
			let result;
			var newProgress = progress;

			newProgress === oldProgress ? result = false : result = true;
			oldProgress = newProgress;

			return result;
		}

		if (moveCheck) {

			// console.log('moveCheck');

			let elements = $(this.slides);
			let elementsTilt = $(this.slides).find('.tilting');
			let currentElement = $(this.slides[this.activeIndex]);
			let currentElementTilt = currentElement.children();

			$(currentElement).removeClass("active");

			if (currentElementTilt.hasClass("tilting")) {
				// console.log('tilting');
				// console.log($(currentElementTilt)[0]);
				$(currentElementTilt).removeClass("tilting");
				$(currentElementTilt)[0].universalTilt.destroy();
			}

		}
	});

	swiper.on("transitionEnd", function(event) {
		// console.log("transitionEnd");
		this.lazy.loadInSlide(this.activeIndex - 1);
		this.lazy.loadInSlide(this.activeIndex + 1);

		let currentElement = $(this.slides[this.activeIndex]);
		let currentElementTilt = currentElement.children();

		$(currentElement).addClass("active");
		tiltElements(currentElementTilt);
	});

	swiper.on("lazyImageReady", function(event, element) {
		$(element)
			.parents(".js-work-item")
			.find(".js-work-logo")
			.addClass("ready");
	});

	$('.js-logo').on('click', function() {
		// let animationSpeed = ((swiper.activeIndex * 100))
		// console.log(animationSpeed);
		if (swiper.activeIndex === 0) {
			// console.log(swiper.slides);
			swiper.slideTo($(swiper.slides).length, 1500);
		} else {
		swiper.slideTo(0, 1500);
		}
	});

}
