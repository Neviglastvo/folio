import targetToShatter from './firstScreen/targetToShatter';
import domToImage from 'dom-to-image';

const imgElement = $(".js-shatter");

$(document).ready(function () {

	imgElement.each(function (i=0) {

		let $this = this;

		domToImage.toPng(this).then(function (dataUrl) {

			let img = new Image();

			img.src = dataUrl;
			img.className = 'js-shatter-new';
			img.dataset.id = i++;

			$this.parentNode.appendChild(img);
			$this.remove();


		})
		// .catch(function (error) {
		// 	console.error('oops, something went wrong!', error);
		// })
		// .finally(function () {

		// 	console.log('toPng()');

		// });

	})

});

$('body').on('click', '.js-shatter-new', function (event) {

	let target = event.target,
		box = target.getBoundingClientRect(),
		top = box.top,
		left = box.left,
		clickX = event.clientX - left,
		clickY = event.clientY - top;

	targetToShatter(this, clickX, clickY)
});
