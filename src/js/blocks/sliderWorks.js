import Swiper from 'swiper';

export default function sliderWorks(){

	var swiper = new Swiper('.js-slider-works', {
		on: {
			init: function () {
				$('.swiper-slide-active').addClass('active')
			},
		},
		slidesPerView: 3,
		spaceBetween: 15,
		initialSlide: 0,
		// loop: true,
		// loopedSlides: 20,
		freeMode: true,
		grabCursor: true,
		// mousewheel: true,
		freeModeSticky: true,
		centeredSlides: true,
		parallax: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		// effect: 'coverflow',
		coverflowEffect: {
			rotate: 30,
			slideShadows: false,
			stretch: 100,
			depth: 100,
		},
		breakpoints: {
			1024: {
				slidesPerView: 2,
			},
			600: {
				slidesPerView: 1.25,
			}
		}
	});

	swiper.on('transitionStart', function(event) {
		$('.swiper-wrapper').find('.active').removeClass('active')
	});

	swiper.on('transitionEnd', function(event) {
		$('.swiper-slide-active').addClass('active')
	});

}
