// import sliderLayout from './blocks/sliderLayout';
import sliderWorks from "./blocks/sliderWorks";

// sliderLayout()
sliderWorks();

$(".js-hamburger").on("click", function(e) {
	e.preventDefault();
	$(".js-hamburger").toggleClass("active");
	$(".js-nav-mobile").toggleClass("active");
	$(".js-blurry").toggleClass("blurry");
});


// import bg from './bg/main';

// $(document).ready(function() {
// 	if ($('.js-bg').length) {
// 		bg()
// 	}
// });
