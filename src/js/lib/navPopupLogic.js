export default function navPopupLogic() {
	$('[data-popup]').each(function () {

		if ($(this).hasClass('js-popup-onhover')) {

			let content = $(this).attr('data-popup');
			let contentLink = '';
			let location = window.location.pathname.slice(1);

			$(this).on("mouseenter", function (e) {
				e.preventDefault();

				if(!$(this).is('a')){
					contentLink = $(this).find('a').attr('href');
				} else {
					contentLink = $(this).attr('href');
				}

				if(contentLink === location){
					return 0
				} else {
					$('.js-popup').removeClass('active');
					$('#popup-' + content).addClass('active')
				}

			});

		} else {

			$(this).on("click", function (e) {
				e.preventDefault();
				$('.js-popup').removeClass('active');
				$('#popup-' + content).addClass('active')
			});

		}
	});
}
