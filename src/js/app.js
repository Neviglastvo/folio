//main
import SmoothScroll from 'smooth-scroll';
import SnapScroll from 'snapscroll';
import sliderWorks from './blocks/sliderWorks';
if ($('.js-slider-works').length){
	sliderWorks()
}

$('.js-hamburger').on('click', function(e) {
	e.preventDefault();
	$('.js-hamburger').toggleClass('active');
	$('.js-nav-mobile').toggleClass('active');
	$('.js-blurry').toggleClass('blurry');
});

const anchorScroll = new SmoothScroll('a[href*="#"]',{
	speed: 1000,
	speedAsDuration: true
});



SnapScroll('.js-scroll-snap', {
	proximity: 300,
	duration: 75,
	easing: time => time,
	onSnapWait: 500,
});



function anchorScrollTo(){

	$('a[href*="#"]').on('click', function(event) {
		$('.hamburger').click();
	});


}
anchorScrollTo()

