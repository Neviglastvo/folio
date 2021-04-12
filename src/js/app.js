import {
	VHChromeFix
} from './libs/VHChromeFix';
import sliderWorks from "./blocks/sliderWorks";
// import greetings from "./libs/greetings";


import Prism from 'prismjs';
import 'prismjs/components/prism-scss';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prism-themes/themes/prism-xonokai.css';

// greetings();
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



function roadmapLogic() {

	let el = $('.js-item')
	let elContent = $('.js-content')

	el.on('click', function(event) {
		let elDataContent = $(event.target).data('content');

		$(el).removeClass('active');
		$(elContent).removeClass('visible');

		$(`.js-content[data-content='${elDataContent}']`).addClass('visible');
		$(event.target).addClass('active');

		// Prism.highlight($(event.target));
	});



}
roadmapLogic()
