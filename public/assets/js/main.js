/***************************************************
==================== JS INDEX ======================
****************************************************
01. PreLoader Js
02. Common Js
03. OffCanvas js
04. Header Search
05. Search Js
06. Body overlay Js
07. Sticky Header Js
08. Back TO Top Js
09. Mobile Menu Toggle Btn
10. Odometer Active
11. Magnific popup Js
12. Wow Js
13. Price Filter
14. Nice Select Js
15. parallax Js
16. Increment-Decrement Js
17. Checkout payment toggle Js
18. password toggle Js
19. blog arrow Back TO Top Js
20. Trusted Brand
21. Product Js
22. Testimonial Js
23. instagram js


****************************************************/

(function ($) {
	"use strict";

	var windowOn = $(window);
	/*=============================================
	=          01. PreLoader Js              =
	=============================================*/
	windowOn.on('load', function () {
		$("#loading").fadeOut(500);
	});

	/*=============================================
	=          02. Common Js             =
	=============================================*/
	$("[data-background").each(function () {
		$(this).css("background-image", "url( " + $(this).attr("data-background") + "  )");
	});

	$("[data-bg-color]").each(function () {
		$(this).css("background-color", $(this).attr("data-bg-color"));
	});

	/*=============================================
    =          03. OffCanvas js            =
   =============================================*/
	$(".eg-menu__header-offCanvas-btn").on("click", function () {
		$("body").addClass("eg-header__offCanvas-visible");
		return false;
	});

	$(".eg-header__offCanvas-overlay, .eg-header__offCanvas-toggle").on("click", function () {
		$("body").removeClass("eg-header__offCanvas-overlay, eg-header__offCanvas-visible");
	});


	/*=============================================
     =            04. Header Search            =
   =============================================*/
	$(".eg-menu__header-search > a").on("click", function () {
		$(".eg-header__search-popup").slideToggle();
		$("body").addClass("eg-header__search-visible");
		return false;
	});

	$(".eg-header__search-backdrop, .search-close").on("click", function () {
		$(".eg-header__search-popup").slideUp(500);
		$("body").removeClass("eg-header__search-visible");
	});


	/*=============================================
	=          05. Search Js              =
	=============================================*/
	// 04. Search Js
	$(".eg-search-open-btn").on("click", function () {
		$(".eg-search-area").addClass("opened");
		$(".body-overlay").addClass("opened");
	});
	$(".eg-search-close-btn").on("click", function () {
		$(".eg-search-area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
	});


	/*=============================================
	=          06. Body overlay Js              =
	=============================================*/
	$(".body-overlay").on("click", function () {
		$(".offcanvas__area").removeClass("offcanvas-opened");
		$(".eg-search-area").removeClass("opened");
		$(".body-overlay").removeClass("opened");
	});


	/*=============================================
	=          07. Sticky Header Js              =
	=============================================*/
	windowOn.on('scroll', function () {
		var scroll = $(window).scrollTop();
		if (scroll < 100) {
			$("#header-sticky").removeClass("header-sticky");
		} else {
			$("#header-sticky").addClass("header-sticky");
		}
	});


	/*=============================================
	=          08. Back TO Top Js            =
	=============================================*/
	function back__to_top() {
		var btn = $('#back__to_top');
		var btn_wrapper = $('.back__to_top_wrapper');

		windowOn.scroll(function () {
			if (windowOn.scrollTop() > 300) {
				btn_wrapper.addClass('back__to_top_btn_show');
			} else {
				btn_wrapper.removeClass('back__to_top_btn_show');
			}
		});

		btn.on('click', function (e) {
			e.preventDefault();
			$('html, body').animate({ scrollTop: 0 }, '300');
		});
	}
	back__to_top();
	

	/*=============================================
	=         09. Mobile Menu Toggle Btn             =
	=============================================*/
	 if ($(".menu-area li.eg-menu__has-children ul").length) {
		$(".menu-area .navigation li.eg-menu__has-children").append('<div class="dropdown-btn"><span class="fal fa-plus plus-line"></span></div>'
		);
	 }

   if ($(".eg-mobile__menu").length) {
		
		var mobileMenuContent = $(".menu-area .eg-menu__main-menu").html();
		$(".eg-mobile__menu .eg-mobile__menu-box .eg-mobile__menu-outer").append(
		  mobileMenuContent
		);
		
		//Dropdown Button
		$(".eg-mobile__menu li.eg-menu__has-children .dropdown-btn").on(
		  "click",
		  function () {
			 $(this).toggleClass("open");
			 $(this).prev("ul").slideToggle(300);
		  }
		);
		//Menu Toggle Btn
		$(".eg-header__mobile-toggler").on("click", function () {
		  $("body").addClass("eg-mobile__menu-visible");
		});
  
		//Menu Toggle Btn
		$(".eg-mobile__menu-backdrop, .eg-mobile__menu .eg-mobile__close-btn").on(
		  "click",
		  function () {
			 $("body").removeClass("eg-mobile__menu-visible");
		  }
		);
	 }


	/*=============================================
	=    		10. Odometer Active  	       =
	=============================================*/
	$(".odometer").appear(function (e) {
		var odo = $(".odometer");
		odo.each(function () {
			var countNumber = $(this).attr("data-count");
			$(this).html(countNumber);
		});
	});

	
	/*=============================================
	=          11. Magnific popup Js              =
	=============================================*/
	/* magnificPopup img view */
	$('.popup-image').magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});
	/* magnificPopup video view */
	$(".popup-video").magnificPopup({
		type: "iframe",
	});


	/*=============================================
	=          12. Wow Js              =
	=============================================*/
	new WOW().init();

	
	/*=============================================
	=          13. Price Filter             =
	=============================================*/
	$("#eg-slider__range").slider({
		range: true,
		min: 0,
		max: 2599,
		values: [0, 999],
		slide: function (event, ui) {
			$("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
		}
	});
	$("#amount").val("$" + $("#eg-slider__range").slider("values", 0) +
		" - $" + $("#eg-slider__range").slider("values", 1));


	/*=============================================
	=          14. Nice Select Js             =
	=============================================*/
	$(".shop-filter").niceSelect();

	
	/*=============================================
	=          15. parallax Js             =
	=============================================*/

	if ($('.scene').length > 0) {
		$('.scene').parallax({
			scalarX: 5.0,
			scalarY: 5.0,
		});
	};
	if ($('.scene-y').length > 0) {
		$('.scene-y').parallax({
			scalarY: 5.0,
			scalarX: 0,
		});
	};

	/*=============================================
	=          16. Increment-Decrement Js             =
	=============================================*/

// Function to increment the counter
$(".increment").click(function () {
	// Find the counter element within the same parent and update its value
	var counterElement = $(this).siblings(".counter");
	var counterValue = parseInt(counterElement.text());
	counterValue++;
	counterElement.text(counterValue);
});

// Function to decrement the counter (with a check to prevent going below 0)
$(".decrement").click(function () {
	// Find the counter element within the same parent and update its value
	var counterElement = $(this).siblings(".counter");
	var counterValue = parseInt(counterElement.text());
	if (counterValue > 0) {
		 counterValue--;
		 counterElement.text(counterValue);
	}
});



	/*=============================================
	=          17. Checkout payment toggle Js             =
	=============================================*/

   $(".eg-checkout-payment__item label").on("click", function () {
      $(this).siblings(".eg-checkout-payment__desc").slideToggle(400);
   });

	/*=============================================
	=          18. password toggle Js             =
	=============================================*/
	if ($("#eg-password__show-toggle").length > 0) {
      var btn = $("#eg-password__show-toggle");

      btn.click(function (e) {
         var inputType = $("#eg-password__input");
         var openEye = $("#eg-password__show");
         var closeEye = $("#eg-password__hide");

         if (inputType.attr("type") === "password") {
            inputType.attr("type", "text");
            openEye.css("display", "block");
            closeEye.css("display", "none");
         } else {
            inputType.attr("type", "password");
            openEye.css("display", "none");
            closeEye.css("display", "block");
         }
      });
   }


   /*=============================================
	=          19. blog arrow Back TO Top Js            =
	=============================================*/
	$(document).ready(function() {
		// Select the button element by its ID
		$("#scrollToTopBtn").click(function() {
			// Scroll to the top of the page smoothly
			$("html, body").animate({ scrollTop: 0 }, "slow");
		});
	});
		

	/*=============================================
	=          20. Trusted Brand              =
	=============================================*/
	var brandSlider = new Swiper('.eg-brand__active', {
		slidesPerView: 6,
		loop: true,
		autoplay: true,
		autoplay: {
			delay: 3000,
		},
		breakpoints: {
			'1200': {
				slidesPerView: 6,
			},
			'992': {
				slidesPerView: 5,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	
	var brandSlider = new Swiper('.eg-brand-2__active', {
		slidesPerView: 6,
		loop: true,
		autoplay: true,
		autoplay: {
			delay: 3000,
		},
		breakpoints: {
			'1400': {
				slidesPerView: 6,
			},
			'1200': {
				slidesPerView: 5,
			},
			'992': {
				slidesPerView: 4,
			},
			'768': {
				slidesPerView: 3,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	/*=============================================
	=          21. Product Js               =
	=============================================*/
	var productSlider = new Swiper('.eg-product__active', {
		slidesPerView: 6,
		loop: true,
		spaceBetween: 30,
		autoplay: true,
		autoplay: {
			delay: 5000,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.eg-product__next',
			prevEl: '.eg-product__prev',
		},
		breakpoints: {
			'1400': {
				slidesPerView: 6,
			},
			'1200': {
				slidesPerView: 5,
			},
			'992': {
				slidesPerView: 5,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});


	var product2Slider = new Swiper('.eg-product-2__active', {
		slidesPerView: 4,
		loop: true,
		spaceBetween: 0,
		autoplay: true,
		autoplay: {
			delay: 5000,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.eg-product-2__next',
			prevEl: '.eg-product-2__prev',
		},
		breakpoints: {
			'1400': {
				slidesPerView: 4,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});


	var product3Slider = new Swiper('.eg-product-3__active', {
		slidesPerView: 4,
		loop: true,
		spaceBetween: 30,
		autoplay: true,
		autoplay: {
			delay: 5000,
		},
		breakpoints: {
			'1400': {
				slidesPerView: 4,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});

	/*=============================================
	=          22. Testimonial Js               =
	=============================================*/
	var testimonialSlider = new Swiper('.eg-testimonial__active', {
		slidesPerView: 1,
		loop: true,
		autoplay: true,
		autoplay: {
			delay: 4000,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.eg-testimonial__next',
			prevEl: '.eg-testimonial__prev',
		},
		breakpoints: {
			'1200': {
				slidesPerView: 1,
			},
			'992': {
				slidesPerView: 1,
			},
			'768': {
				slidesPerView: 1,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});


	var product2Slider = new Swiper('.eg-testimonial-2__active', {
		slidesPerView: 4,
		loop: true,
		spaceBetween: 0,
		autoplay: true,
		autoplay: {
			delay: 5000,
		},
		// Navigation arrows
		navigation: {
			nextEl: '.eg-testimonial-2__next',
			prevEl: '.eg-testimonial-2__prev',
		},
		breakpoints: {
			'1400': {
				slidesPerView: 4,
			},
			'1200': {
				slidesPerView: 3,
			},
			'992': {
				slidesPerView: 2,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 1,
			},
			'0': {
				slidesPerView: 1,
			},
		},
	});
		

	/*=============================================
	=          23. instagram js              =
	=============================================*/
	var instagramSlider = new Swiper('.eg-instagram__active', {
		slidesPerView: 5,
		loop: false,
		spaceBetween: 65,
		autoplay: false,
		autoplay: {
			delay: 3000,
		},
		breakpoints: {
			'1400': {
				slidesPerView: 5,
			},
			'1200': {
				slidesPerView: 4,
				spaceBetween: 30,
			},
			'992': {
				slidesPerView:4,
				spaceBetween: 30,
			},
			'768': {
				slidesPerView: 2,
			},
			'576': {
				slidesPerView: 2,
			},
			'0': {
				slidesPerView: 1,
				spaceBetween: 0,
			},
		},
	});

var swiper = new Swiper(".myMainSlider", {

    loop: true,
    speed: 1000,

    autoplay: {
        delay: 4000,
        disableOnInteraction: false,
    },

    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },

    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    }
});

})(jQuery);


