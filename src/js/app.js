//main
// import './lib/bez.js';
// import './lib/alton.js';
// import SmoothScroll from 'smooth-scroll';
// import SnapScroll from 'snapscroll';
import sliderWorks from './blocks/sliderWorks';
// import sliderAbout from './blocks/sliderAbout';
import sliderLayout from './blocks/sliderLayout';


if ($('.js-slider-works').length){
	sliderWorks()
}
// if ($('.js-slider-about').length){
// 	sliderAbout()
// }
if ($('.js-slider-layout').length){
	sliderLayout()
}

// $('.js-hamburger').on('click', function(e) {
// 	e.preventDefault();
// 	$('.js-hamburger').toggleClass('active');
// 	$('.js-nav-mobile').toggleClass('active');
// 	$('.js-blurry').toggleClass('blurry');
// });

// const anchorScroll = new SmoothScroll('a[href*="#"]',{
// 	speed: 1000,
// 	speedAsDuration: true
// });

// SnapScroll('.js-scroll-snap', {
// 	proximity: 300,
// 	duration: 75,
// 	easing: time => time,
// 	onSnapWait: 500,
// });

// function anchorScrollTo(){

// 	$('a[href*="#"]').on('click', function(event) {
// 		$('.hamburger').click();
// 	});

// }
// anchorScrollTo()

// if($('.js-hero').length) {
//     $(document).alton({
//         firstClass : 'js-hero',
//         bodyContainer: 'js-trigger-cases',
//         scrollMode: 'headerScroll'
//     });
// }


//webgltest
import reflection from './reflection/main';


// $(document).ready(function() {

if ($('.js-reflection').length){
	reflection()
}

// });
