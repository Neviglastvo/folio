import Swiper from "swiper";
import tilt from "tilt.js";

export default function sliderWorks() {

	let sooqa = [],
		swiperElements = 2,
		tiltOptions = {
			glare: true,
			maxGlare: .2,
			speed: 500,
			easing: "ease",
			maxTilt: 3,
			perspective: 500,
		};


	// function getValues(el) {
	// 	var matrix = el
	// 		.css("transform")
	// 		.replace(/^\D+/g, "")
	// 		.split(",");
	// 	var x = matrix[12] || matrix[4];
	// 	// var y = matrix[13] || matrix[5];
	// 	return x;
	// }



	let swiper = new Swiper($('.js-slider-works'), {
		on: {
			init: function() {
				$(".swiper-slide-active").addClass("active");
				// let elActive = $(".swiper-slide.active");

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
				// 	sooqa.push(getValues(el));
				// });

				// console.log(sooqa);

				// console.log(getMethods(this));
			},
		},
		nested: true,
		slidesPerView: swiperElements,
		spaceBetween: 15,
		speed: 1000,
		initialSlide: 0,
		freeMode: true,
		// grabCursor: true,
		mousewheel: false,
		preloadImages: false,
		lazy: true,
		loadPrevNext: true,
		loadPrevNextAmount: 4,
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

	swiper.on("transitionStart", function(event) {
		let elActive = $(".swiper-slide.active");

		// elActive.tilt.reset.call(elActive);
		// elActive.tilt.destroy.call(elActive);
		elActive.removeClass("active");
	});

	swiper.on("transitionEnd", function(event) {
		this.lazy.loadInSlide(this.activeIndex-1);

		let el = $(".swiper-slide-active");
		el.addClass("active")
		let elActive = $(".swiper-slide.active")


	});

	swiper.on("lazyImageReady", function(event, element) {
		$(element).parents('.js-work-item').find('.js-work-logo').addClass('ready')
	});


	let tilt = $('.js-tilt').tilt(tiltOptions);



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
	// 		let oldValue = sooqa;
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


}
