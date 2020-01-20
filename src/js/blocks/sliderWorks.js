import Swiper from "swiper";
import UniversalTilt from "universal-tilt.js";

export default function sliderWorks() {
	let transformDistance = [],
		swiperElements = 2;

	function tiltElements(element) {
		// console.log(element);
		element.universalTilt({
			settings: {
				base: "window",
				max: 5,
				perspective: 1000,
				speed: 300,
				// shine: true,
				// "shine-opacity": 0.25,
				// reverse: true
			}
		});

		element.addClass("tilting");
	}

	let swiper = new Swiper($(".js-slider-works"), {
		on: {
			init: function() {
				let currentElement = $(this.slides[this.activeIndex]);
				let currentElementTilt = currentElement.children();
				currentElement.addClass("active");

				tiltElements(currentElementTilt);

				// $.each(this.slides, function(index, element) {
				// 	let el = $(this).find(".js-parallax");
				// 	let elWidthPercent = 100 / swiperElements;
				// 	let indexQ = index - 1;
				// 	let elWidth = element.offsetWidth;
				// el.css('transform', `translateX(${-elWidth + (indexQ * elWidth)}px)`);
				// el.css(
				// 	"transform",
				// 	`translateX(${-elWidthPercent * indexQ}%)`
				// );
				// 	transformDistance.push(getValues(el));
				// });

				// console.log(transformDistance);

				// console.log(getMethods(this));
			}
		},
		nested: true,
		slidesPerView: swiperElements,
		spaceBetween: -1,
		speed: 500,
		initialSlide: 0,
		freeMode: false,
		freeModeSticky: true,
		centeredSlides: true,
		parallax: true,
		// grabCursor: true,
		mousewheel: false,
		preloadImages: false,
		lazy: true,
		loadPrevNext: true,
		loadPrevNextAmount: 3,
		loadOnTransitionStart: true,
		pagination: {
			el: ".js-slider-works-pagination",
			progressbarOpposite: true,
			clickable: true
		},
		navigation: {
			nextEl: ".js-slider-works-button-next",
			prevEl: ".js-slider-works-button-prev"
		},
		scrollbar: {
			el: ".js-slider-works-scrollbar",
			draggable: true,
			snapOnRelease: true

			// hide: true,
		},

		breakpoints: {
			768: {
				slidesPerView: swiperElements
			},
			320: {
				slidesPerView: 1,
				spaceBetween: 0
			}
		}
	});

	swiper.on("progress", function() {
		let elements = $(this.slides);
		let elementsTilt = $(this.slides).find('.tilting');
		let currentElement = $(this.slides[this.activeIndex]);
		let currentElementTilt = currentElement.children();

		if (currentElement.hasClass("active")) {

			$(elements).each(function(index, el) {
				$(el).removeClass("active");
			});

		}

		$(elementsTilt).each(function(index, el) {
			$(el).removeClass("tilting");
			elementsTilt[0].universalTilt.destroy();
		});

	});

	swiper.on("transitionStart", function(event) {

		// let elements = $(this.slides);
		// let elementsTilt = $(this.slides).children();
		// let currentElement = $(this.slides[this.activeIndex]);
		// let currentElementTilt = currentElement.children();

		// if (currentElement.hasClass("active")) {
		// 	currentElement.removeClass("active");
		// }

		// if (elementsTilt.hasClass("tilting")) {
		// 	console.log('asd');
		// 	currentElementTilt[0].universalTilt.destroy();
		// }
	});

	swiper.on("transitionEnd", function(event) {
		console.log("transitionEnd");
		this.lazy.loadInSlide(this.activeIndex - 1);

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

	// var previousProgress = swiper.progress;
	// swiper.on("setTranslate", function() {
	// 	let progress = this.progress;
	// 	let translate = this.translate;
	// 	let elWidth = this.wrapperEl.offsetWidth;

	// 	function directionCheck() {
	// 		let result;
	// 		var currentProgress = progress;

	// 		if (currentProgress > previousProgress) {
	// 			result = 1; //right
	// 		} else {
	// 			result = -1; //left
	// 		}
	// 		previousProgress = currentProgress;

	// 		return result;
	// 	}

	// 	let direction = directionCheck();

	// 	$.each(this.slides, function(i, element) {
	// 		let el = $(element).find(".js-parallax");
	// 		let oldValue = transformDistance;
	// 		let progressQ = progress.toFixed(3);
	// 		console.log(oldValue);

	// 		let newValue = `translateX(${parseInt(oldValue[i])  + progressQ * 100 * -1}%)`;
	// 		console.log(newValue);

	// 		if (direction == -1) {
	// 			el.css("transform", newValue);
	// 			console.log(direction);
	// 		} else if (direction == 1) {
	// 			el.css('transform', `translateX(${parseInt(oldValue[i])  + progressQ * 100}px)`);
	// 			console.log(direction);
	// 		}
	// 	});
	// });

	// function getValues(el) {
	// 	var matrix = el
	// 		.css("transform")
	// 		.replace(/^\D+/g, "")
	// 		.split(",");
	// 	var x = matrix[12] || matrix[4];
	// 	// var y = matrix[13] || matrix[5];
	// 	return x;
	// }
}
