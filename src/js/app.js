import sliderWorks from "./blocks/sliderWorks";

sliderWorks();




$(".js-hamburger").on("click", function(e) {
	e.preventDefault();
	$(".js-hamburger").toggleClass("active");
	$(".js-nav-mobile").toggleClass("active");
	$(".js-blurry").toggleClass("blurry");
});

// import sliderLayout from './blocks/sliderLayout';
// import sliderAbout from './blocks/sliderAbout';

// if ($('.js-slider-layout').length){
// 	sliderLayout()
// }

// if ($('.js-slider-about').length){
// 	sliderAbout()
// }


//webgltest
// import reflection from './reflection/main';

// $(document).ready(function() {

// if ($('.js-reflection').length){
// 	reflection()
// }

// });

//webgltest
// import char from './char/char';

// $(document).ready(function() {

// if ($('.char').length){
// 	char()
// }

// });
