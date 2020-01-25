import {VHChromeFix} from './libs/VHChromeFix';
import sliderWorks from "./blocks/sliderWorks";

// sliderLayout()
sliderWorks();

$(".js-hamburger").on("click", function(e) {
	e.preventDefault();
	$(".js-hamburger").toggleClass("active");
	$(".js-nav-mobile").toggleClass("active");
	$(".js-blurry").toggleClass("blurry");
});

var options = [
  {
    selector: '.layout',
    vh: 100,
  },
  {
    selector: 'body',
    vh: 100,
  }
];

var vhFix = new VHChromeFix(options);

