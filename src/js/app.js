import sliderLayout from './blocks/sliderLayout';
import sliderWorks from "./blocks/sliderWorks";

sliderLayout()
sliderWorks();

$(".js-hamburger").on("click", function(e) {
	e.preventDefault();
	$(".js-hamburger").toggleClass("active");
	$(".js-nav-mobile").toggleClass("active");
	$(".js-blurry").toggleClass("blurry");
});

// import sliderAbout from './blocks/sliderAbout';


// if ($('.js-slider-about').length){
// 	sliderAbout()
// }


//bg
import bg from './bg/main';

$(document).ready(function() {
	if ($('.js-bg').length) {
		bg()
	}
});

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
