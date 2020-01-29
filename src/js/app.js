import {
	VHChromeFix
} from './libs/VHChromeFix';
import sliderWorks from "./blocks/sliderWorks";
import greetings from "./libs/greetings";

greetings();
sliderWorks();

$(".js-hamburger").on("click", function(e) {
	e.preventDefault();
	$(".js-hamburger").toggleClass("active");
	$(".js-nav-mobile").toggleClass("active");
	$(".js-blurry").toggleClass("blurry");
});


var vhFix = new VHChromeFix({
	selector: 'body',
	vh: 100,
}, {
	selector: '.layout',
	vh: 100,
});
