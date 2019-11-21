import Swiper from 'swiper';

export default function sliderWorks(){
	var swiper = new Swiper('.swiper-container', {
		slidesPerView: 3,
		spaceBetween: 15,
		initialSlide: 3,
		loopedSlides: 20,
		freeMode: true,
		grabCursor: true,
		freeModeSticky: true,
		centeredSlides: true,
		parallax: true,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
	});
}
