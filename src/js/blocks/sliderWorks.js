import Swiper from 'swiper';

export default function sliderWorks(){
	var swiper = new Swiper('.js-slider-works', {
		on: {
			init: function () {
				$('.swiper-slide-active').addClass('active')

			},
		},
		nested: true,
		slidesPerView: 3,
		spaceBetween: 15,
		initialSlide: 0,
		// loop: true,
		// loopedSlides: 20,
		freeMode: true,
		grabCursor: true,
		mousewheel: false,
		freeModeSticky: true,
		centeredSlides: true,
		parallax: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		// effect: 'coverflow',
		coverflowEffect: {
			rotate: 25,
			slideShadows: false,
			stretch: 20,
			depth: 20,
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
