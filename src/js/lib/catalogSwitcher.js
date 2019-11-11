export default function catalogSwitcher(){

	$('[data-catalog-type]').each(function () {

		$(this).on("click", function (e) {
			e.preventDefault();
			$('.js-catalog-switcher').removeClass('active');
			$(this).addClass('active');
			let data = $(this).attr('data-catalog-type');
			let lastClass = $('.js-catalog').attr('class').split(' ').pop();
			$('.js-catalog').removeClass(lastClass);
			$('.js-catalog').addClass(data);
		});

	});
}
