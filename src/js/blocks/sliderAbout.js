import Swiper from 'swiper';

export default function sliderAbout(){

	var swiper = new Swiper('.js-slider-about', {

		slidesPerView: 1,
		spaceBetween: 50,
		initialSlide: 0,
		loop: true,
		centeredSlides: false,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});

}
