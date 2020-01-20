import Swiper from 'swiper';

export default function sliderLayout() {

	var swiper = new Swiper('.js-slider-layout', {
		nested: true,
		slidesPerView: 1,
		direction: 'vertical',
		spaceBetween: 0,
		initialSlide: 1,
		roundLengths: true,
		speed: 700,
		loop: false,
		// simulateTouch: false,
		centeredSlides: true,
		mousewheel: true,
		// parallax:true,
		pagination: {
			el: '.js-slider-layout-pagination',
			clickable: true,
			bulletActiveClass: 'active',
			type: 'bullets',
			direction: 'horizontal',
			renderBullet: function(index, className) {
				let slideTitle = this.slides[index].dataset.title;
				let arr = [...slideTitle];
				let slideTitleCropped = '';

				// for(var i=0;i<arr.length;i++) {
				// 		slideTitleCropped += `<span>${arr[i]}</span>`
				// }

				return `<div class="layout__pagination-item ${className}">${slideTitle}</div>`;
			}
		}
	});

}
