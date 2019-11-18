import targetToShatter from './firstScreen/targetToShatter';
import domToImage from 'dom-to-image';

const images = document.querySelectorAll('.js-shatter')

let id = 0;

document.addEventListener('click', function (e) {
	let target = e.target;



	if (target && target.classList.contains('js-shatter')) {

		let newImg,
			box = target.getBoundingClientRect(),
			top = box.top,
			left = box.left,
			clickX = e.clientX - left,
			clickY = e.clientY - top;

		domToImage.toPng(target).then(function (dataUrl) {

			let img = new Image();
			newImg = img;

			img.src = dataUrl;
			img.className = 'js-shatter-new';
			img.dataset.id = id++;

			target.parentNode.appendChild(newImg);
			target.remove();

		}).then(function () {

			targetToShatter(newImg, clickX, clickY)

		}).catch(function (error) {
			console.error('oops, something went wrong!', error);
		}).finally(function () {
			// console.log('finish');
		});

	}

});
