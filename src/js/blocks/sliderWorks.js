import Swiper from "swiper";
import UniversalTilt from "universal-tilt.js";

export default function sliderWorks() {
	let transformDistance = [],
		swiperElements = 2;

	function tiltElements(element) {
		console.log(element);
		element.universalTilt({
			settings: {
				base: "window",
				max: 5,
				perspective: 1000,
				speed: 700,
				shine: true,
				"shine-opacity": 0.1,
				reverse: true
			}
		});

		element.addClass('tilting')
	}

	let swiper = new Swiper($(".js-slider-works"), {
		on: {
			init: function() {
				let elActive = $(this.slides[this.activeIndex]);
				elActive.addClass("active");

				tiltElements(elActive);

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
		speed: 1000,
		initialSlide: 0,
		freeMode: true,
		// grabCursor: true,
		mousewheel: false,
		preloadImages: false,
		lazy: true,
		loadPrevNext: true,
		loadPrevNextAmount: 3,
		loadOnTransitionStart: true,
		freeModeSticky: true,
		centeredSlides: true,
		parallax: true,
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
			progressbarOpposite: true,
			snapOnRelease: true

			// hide: true,
		}

		// breakpoints: {
		// 	1024: {
		// 		slidesPerView: 2,
		// 	},
		// 	600: {
		// 		slidesPerView: 1.25,
		// 	}
		// }
	});

	swiper.on("progress", function() {
		let currentElement = $(this.slides[this.activeIndex]);

		if (currentElement.hasClass("active")) {
			currentElement.removeClass("active");
			console.log("not active ");
		}
	});

	swiper.on("transitionStart", function(event) {
		console.log("transitionStart");

		let currentElement = $(this.slides[this.activeIndex]);

		if (currentElement.hasClass('tilting')) {
			currentElement[0].universalTilt.destroy();
		}
	});

	swiper.on("transitionEnd", function(event) {
		console.log("transitionEnd");
		let currentElement = $(this.slides[this.activeIndex]);
		this.lazy.loadInSlide(this.activeIndex - 1);

		$(currentElement).addClass("active");
		tiltElements(currentElement);
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
