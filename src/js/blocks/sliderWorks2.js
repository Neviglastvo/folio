import Swiper from "swiper";
import UniversalTilt from "universal-tilt.js";

class SliderWorks {
	constructor() {
		this.currentTransitionSpeed = 0;
		this.init();
	}



	isMobileDevice() {
		return (
			typeof window.orientation !== "undefined" ||
			navigator.userAgent.indexOf("IEMobile") !== -1
		);
	}

	tiltElements(element) {
		let tiltCfg;

		if (!mobile) {
			tiltCfg = {
				settings: {
					// base: "window",
					max: 7,
					perspective: 1000,
					speed: 1000,
					// scale: 1.1,
					shine: false,
					"shine-opacity": 0.25
					// reverse: true
				}
			};
		} else {
			tiltCfg = {
				settings: {
					// base: "window",
					disabled: "x",
					max: 20,
					perspective: 800,
					speed: 2500,
					// scale: 1.1,
					shine: false,
					"shine-opacity": 0.5
					// reverse: true
				}
			};
		}

		$(element).universalTilt(tiltCfg);

		$(element).addClass("tilting");
	}

	getTransitionSpeed() {
		const transitionSpeed = this.currentTransitionSpeed;
		// don't forget to reset the variable for future calls
		this.currentTransitionSpeed = 0;
		return transitionSpeed;
	}

	getActiveIndexBeforeTransitionStart(swiper, slides) {
		const isDragging = !Math.abs(slides[swiper.activeIndex].progress === 1);
		if (isDragging) {
			return swiper.slidesGrid.indexOf(
				-swiper.touchEventsData.startTranslate ||
					swiper.params.initialSlide
			);
		} else {
			return swiper.activeIndex;
		}
	}

	getDirection(animationProgress) {
		if (animationProgress === 0) {
			return "NONE";
		} else if (animationProgress > 0) {
			return "NEXT";
		} else {
			return "BACK";
		}
	}

	progress(swiper, progress) {
		/* 
		if you need to change something for each progress
		do it here (progress variable is always in range from 0 to 1) representing progress of the whole slider
		*/
	}

	sliderInit() {
		const that = this;

		let transformDistance = [],
			swiperElements = 2.5,
			mobile = isMobileDevice() && $(window).width() <= 1023;

		// console.log(mobile);

		this.swiper = new Swiper($(".js-slider-works"), {
			on: {
				init: function() {
					let currentElement = $(this.slides[this.activeIndex]);
					let currentElementTilt = currentElement.children();

					currentElement.addClass("active");
					tiltElements(currentElementTilt);

					$.each(this.slides, function(index, element) {
						let el = $(this).find(".js-parallax");

						let translateFormula = parseFloat(
							(33.333333 * index * -1).toFixed(6)
						);

						el.css("transform", `translateX(${translateFormula}%)`);
						transformDistance.push(translateFormula);
					});

					console.log(transformDistance);
				},
				progress(progress) {
					const swiper = this;
					if (swiper.params.effect !== "myCustomTransition") return;
					that.progress(swiper, progress);
				},
				setTransition(transition) {
					const swiper = this;
					if (swiper.params.effect !== "myCustomTransition") return;
					that.setTransition(swiper, transition);
				},
				setTranslate(translate) {
					const swiper = this;
					if (swiper.params.effect !== "myCustomTransition") return;
					that.setTranslate(swiper, translate);
				},
				lazyImageReady(ready) {
					const swiper = this;
					if (swiper.params.effect !== "myCustomTransition") return;
					that.setTranslate(swiper, translate);
				}
			},
			slidesPerView: swiperElements,
			speed: 1000,
			initialSlide: 0,
			preventInteractionOnTransition: true,
			slideToClickedSlide: true,
			centeredSlides: true,
			parallax: false,
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			mousewheel: false,
			freeMode: true,
			freeModeSticky: true,
			grabCursor: true,
			lazy: true,
			preloadImages: false,
			loadPrevNext: false,
			loadOnTransitionStart: true,
			resistanceRatio: 0.5,
			touchEventsTarget: "wrapper",
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
				1023: {
					slidesPerView: swiperElements,
					spaceBetween: 0
				},
				320: {
					slidesPerView: 1,
					spaceBetween: 0
				}
			}
		});
	}

	// swiper.on('progress', function(event) {
	// 	console.log(event);
	// 	destroyTilting()
	// 	parallax()
	// });

	// swiper.on('setTransition', function(event) {
	// 	console.log(event);
	// 	parallax()
	// });

	// swiper.on('setTranslate', function(event) {
	// 	console.log(event);
	// 	parallax()
	// });

	// swiper.on("transitionEnd", function(event) {
	// 	this.lazy.loadInSlide(this.activeIndex - 1);
	// 	this.lazy.loadInSlide(this.activeIndex + 1);

	// 	let currentElement = $(this.slides[this.activeIndex]);
	// 	let currentElementTilt = currentElement.children();

	// 	$(currentElement).addClass("active");
	// 	tiltElements(currentElementTilt);
	// });

	// swiper.on("lazyImageReady", function(event, element) {
	// 	$(element)
	// 		.parents(".js-work-item")
	// 		.find(".js-work-logo")
	// 		.addClass("ready");
	// });

	// $('.js-logo').on('click', function() {
	// 	if (swiper.activeIndex === 0) {
	// 		swiper.slideTo($(swiper.slides).length, 1500);
	// 	} else {
	// 		swiper.slideTo(0, 1500);
	// 	}
	// });

	parallax() {
		// let direction = function() {
		// 	let result;
		// 	var newProgress = swiper.progress;

		// 	if (newProgress > oldProgress) {
		// 		result = 1; //right
		// 	} else {
		// 		result = -1; //left
		// 	}
		// 	oldProgress = newProgress;

		// 	return result;
		// };

		[].forEach.call(swiper.slides, function(element, i) {
			let el = element.getElementsByClassName("js-parallax")[0];

			let translateFormula = (
				transformDistance[i] +
				swiper.progress * 100 * 2.666666
			).toFixed(6);

			// if (direction() == -1) {
			el.style.transform = `translateX(${translateFormula}%)`;
			// console.log('right' + i + ' ' + `translateX(${translateFormula}%)`);
			// } else if (direction() == 1) {
			// el.style.transform = `translateX(${translateFormula}%)`;
			// console.log('left' + i + ' ' + `translateX(${translateFormula}%)`);
			// }
		});
	}

	destroyTilting() {
		let progress = swiper.progress;
		var oldProgress = swiper.progress;

		let moveCheck = function() {
			let result;
			var newProgress = progress;

			newProgress === oldProgress ? (result = false) : (result = true);
			oldProgress = newProgress;

			return result;
		};

		if (moveCheck) {
			let currentElement = $(swiper.slides[swiper.activeIndex]);
			let currentElementTilt = currentElement.children();

			$(currentElement).removeClass("active");

			if (currentElementTilt.hasClass("tilting")) {
				$(currentElementTilt).removeClass("tilting");
				$(currentElementTilt)[0].universalTilt.destroy();
			}
		}
	}
}

export const sliderWorks = new SliderWorks();
