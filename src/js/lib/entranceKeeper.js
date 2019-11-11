import Cookies from 'js-cookie';

export default function entranceKeeper(){

	let val = Cookies.get('enter')
	// console.log(val);

	if (!Cookies.get('enter')) {

		// console.log(' create ');
		Cookies.set('enter', 'false');
		$('.layout').addClass('blur');
		$('.js-check18').addClass('active');

	}

	if (val === 'false') {

		// console.log('exist and false');
		$('.layout').addClass('blur');
		$('.js-check18').addClass('active');

	} else if (val === 'true'){

		// console.log('else (val=true)');
		$('.layout').removeClass('blur');
		$('.js-check18').removeClass('active');

	}

}
