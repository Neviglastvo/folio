import Swiper from 'swiper';

export default function sliderWorks(){
	var swiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		spaceBetween: 15,
		initialSlide: 4,
		loop: false,
		loopedSlides: 20,
		freeMode: true,
		grabCursor: true,
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
	});
}
