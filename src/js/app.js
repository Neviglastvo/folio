import targetToShatter from './firstScreen/targetToShatter';
import domToImage from 'dom-to-image';

const imgElements = $(".js-shatter");

$(imgElements).on('click', function (event) {


	if ($(event.target).hasClass('js-shatter')) {
		let $this = this;

		let target = event.target,
			box = target.getBoundingClientRect(),
			top = box.top,
			left = box.left,
			clickX = event.clientX - left,
			clickY = event.clientY - top;


		domToImage.toPng(this).then(function (dataUrl) {
			let img = new Image();
			img.src = dataUrl;
			img.className = 'js-shatter-new';

			$this.parentNode.appendChild(img);
			$this.remove();
			$this = img;

			console.log('toPng()');
			console.log($this);

			targetToShatter($this, clickX, clickY)

		}).catch(function (error) {
			console.error('oops, something went wrong!', error);
		});

	};
});



