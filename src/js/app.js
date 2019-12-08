//main
import sliderWorks from './blocks/sliderWorks';

if ($('.js-slider-works').length){
	sliderWorks()
}

//test
import domToImage from 'dom-to-image';
import targetToShatter from './firstScreen/targetToShatter';
import pet from './pet/pet';

if ($('.js-pet').length){
	pet()
}

console.log(` Viewport w: ${window.innerWidth}, h: ${window.innerHeight}`);

document.addEventListener('click', function (e) {
	let target = e.target;
	let id = 0;

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
			console.log(`click in x: ${clickX}, y: ${clickY}`);
			targetToShatter(newImg, clickX, clickY)

		});
		// .catch(function (error) {
		// 	console.error('oops, something went wrong!', error);
		// }).finally(function () {
		// });

	}

});


//webgltest
// import reflection from './_reflection';
// import flame from './_flame';



// if ($('.js-reflection').length){
// 	reflection()
// }

// if ($('.js-flame').length){
// 	flame()
// }





